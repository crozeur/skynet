param(
  [int]$Port = 3000,
  [int]$StartupTimeoutSeconds = 60,
  [switch]$SkipLint
)

$ErrorActionPreference = 'Stop'

function Write-Step([string]$msg) {
  Write-Host ("\n==> {0}" -f $msg)
}

function Fail([string]$msg) {
  Write-Error $msg
  exit 1
}

function Get-NodePath() {
  $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Path) { return $cmd.Path }
  Fail "node.exe not found. Install Node.js."
}

function Get-NpmCliPath() {
  $candidate = 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
  if (Test-Path $candidate) { return $candidate }

  # Fallback: try to locate npm.ps1 and infer the npm folder
  $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
  if ($npmCmd -and $npmCmd.Path) {
    $maybe = Join-Path (Split-Path $npmCmd.Path -Parent) 'node_modules\npm\bin\npm-cli.js'
    if (Test-Path $maybe) { return $maybe }
  }

  Fail "npm-cli.js not found. Is Node.js/npm installed correctly?"
}

function Start-DevServer([string]$workingDir, [string]$logDir) {
  $node = Get-NodePath
  $npmCli = Get-NpmCliPath

  New-Item -ItemType Directory -Force -Path $logDir | Out-Null
  $outLog = Join-Path $logDir 'dev-out.log'
  $errLog = Join-Path $logDir 'dev-err.log'
  Remove-Item -Force -ErrorAction SilentlyContinue $outLog, $errLog

  # IMPORTANT: quote npm-cli.js path because it contains spaces.
  $args = '"' + $npmCli + '" run dev'

  $p = Start-Process -FilePath $node -ArgumentList $args -WorkingDirectory $workingDir -PassThru -RedirectStandardOutput $outLog -RedirectStandardError $errLog
  return [pscustomobject]@{ Process = $p; OutLog = $outLog; ErrLog = $errLog }
}

function Wait-ForHttp([string]$url, [int]$timeoutSeconds) {
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $res = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 3 -UseBasicParsing
      if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 500) {
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  return $false
}

function Invoke-JsonPost([string]$url, [object]$body, [hashtable]$headers = @{}) {
  $json = $body | ConvertTo-Json -Depth 10
  $allHeaders = @{}
  foreach ($k in $headers.Keys) { $allHeaders[$k] = $headers[$k] }

  try {
    $res = Invoke-WebRequest -Uri $url -Method POST -Headers $allHeaders -ContentType 'application/json' -Body $json -TimeoutSec 15 -UseBasicParsing
    return [pscustomobject]@{ Status = [int]$res.StatusCode; Headers = $res.Headers; Body = $res.Content }
  } catch {
    $resp = $_.Exception.Response
    if ($resp) {
      $status = [int]$resp.StatusCode
      $headersObj = $resp.Headers
      $content = ''
      try {
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $content = $reader.ReadToEnd()
      } catch {
        $content = ''
      }
      return [pscustomobject]@{ Status = $status; Headers = $headersObj; Body = $content }
    }
    throw
  }
}

function New-FakeIp() {
  # RFC 5737 TEST-NET-3 range
  $rand = Get-Random -Minimum 1 -Maximum 254
  return "203.0.113.$rand"
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$logDir = Join-Path $repoRoot '.tmp'
$baseUrl = "http://localhost:$Port"

Write-Step "(Optional) Lint"
if (-not $SkipLint) {
  Push-Location $repoRoot
  try {
    npm run lint | Out-Host
  } finally {
    Pop-Location
  }
}

Write-Step "Start Next.js dev server"
$server = Start-DevServer -workingDir $repoRoot -logDir $logDir

try {
  Write-Step "Wait for server: $baseUrl"
  $ok = Wait-ForHttp -url "$baseUrl/" -timeoutSeconds $StartupTimeoutSeconds
  if (-not $ok) {
    $errTail = ''
    if (Test-Path $server.ErrLog) {
      $errTail = (Get-Content $server.ErrLog -Raw -ErrorAction SilentlyContinue)
    }
    Fail "Dev server did not become ready on $baseUrl within $StartupTimeoutSeconds seconds.\n--- dev stderr ---\n$errTail"
  }

  Write-Step "Test: POST /api/translate (fr=>fr should short-circuit)"
  $tr = Invoke-JsonPost -url "$baseUrl/api/translate" -body @{ text = 'Bonjour, ceci est un test.'; targetLang = 'fr' }
  if ($tr.Status -ne 200) {
    Fail "translate failed: HTTP $($tr.Status) body=$($tr.Body)"
  }
  $trJson = $null
  try { $trJson = $tr.Body | ConvertFrom-Json } catch { }
  if (-not $trJson -or -not $trJson.translated) {
    Fail "translate response missing 'translated': body=$($tr.Body)"
  }

  Write-Step "Test: POST /api/lead (honeypot should return ok=true)"
  $fakeIp = New-FakeIp
  $leadHeaders = @{ 'x-forwarded-for' = $fakeIp }
  $leadBody = @{ email='test@example.com'; name='Test'; company='ACME'; sectors=@('it'); language='fr'; website='bot-field' }
  $lead = Invoke-JsonPost -url "$baseUrl/api/lead" -body $leadBody -headers $leadHeaders
  if ($lead.Status -ne 200) {
    Fail "lead honeypot failed: HTTP $($lead.Status) body=$($lead.Body)"
  }

  Write-Step "Test: Lead burst rate limit (expect 429 on 13th call)"
  $fakeIpBurst = New-FakeIp
  $leadHeadersBurst = @{ 'x-forwarded-for' = $fakeIpBurst }
  $statuses = @()
  $first429 = $null
  for ($i=1; $i -le 13; $i++) {
    $r = Invoke-JsonPost -url "$baseUrl/api/lead" -body $leadBody -headers $leadHeadersBurst
    $statuses += $r.Status
    if (-not $first429 -and $r.Status -eq 429) {
      $first429 = $r
    }
  }

  $statusStr = ($statuses -join ',')
  Write-Host "Lead status codes: $statusStr (xff=$fakeIpBurst)"

  if ($statuses[0] -ne 200) {
    Fail "lead should allow at least the first request: got $($statuses[0])"
  }
  if ($statuses[-1] -ne 429) {
    Fail "lead expected 429 on 13th request; got $($statuses[-1]). Statuses: $statusStr"
  }

  if ($first429) {
    $retryAfterHeader = $first429.Headers['Retry-After']
    if (-not $retryAfterHeader) {
      Fail "429 response missing Retry-After header. Body=$($first429.Body)"
    }

    try {
      $b = $first429.Body | ConvertFrom-Json
      if (-not $b.retryAfter) {
        Fail "429 response missing JSON retryAfter. Body=$($first429.Body)"
      }
    } catch {
      Fail "429 response is not valid JSON. Body=$($first429.Body)"
    }
  }

  Write-Host "\n✅ Local API checks passed."
} finally {
  Write-Step "Stop dev server"
  try {
    if ($server -and $server.Process -and -not $server.Process.HasExited) {
      Stop-Process -Id $server.Process.Id -Force -ErrorAction SilentlyContinue
    }
  } catch { }
}
