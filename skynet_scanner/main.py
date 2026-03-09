from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import ssl
import socket
from datetime import datetime, timezone
import requests
import json
import urllib3
import re
import concurrent.futures

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="Skynet Scanner API", description="API de scan OSINT pour automatisation")

class ScanRequest(BaseModel):
    domain: str
    webhook_url: str = None  # Optionnel: si Make veut qu'on le prévienne à la fin

# ----------------- COPIE DES FONCTIONS DE SCAN (Identiques au script) -----------------

def check_ssl(domain):
    port = 443
    result = {"has_ssl": False, "expired": False, "days_remaining": 0, "tls_version": None, "weak_tls": False, "error": None}
    context = ssl.create_default_context()
    try:
        with socket.create_connection((domain, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                result["has_ssl"] = True
                result["tls_version"] = ssock.version()
                if ssock.version() in ("TLSv1", "TLSv1.1"): result["weak_tls"] = True
                not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                days_remaining = (not_after - datetime.now(timezone.utc).replace(tzinfo=None)).days
                result["days_remaining"] = days_remaining
                result["expired"] = days_remaining < 15
    except ssl.SSLCertVerificationError:
        result["has_ssl"] = True; result["expired"] = True; result["error"] = "Certificat invalide ou expiré"
    except Exception as e:
        result["error"] = str(e)
    return result

def check_web(domain):
    result = {
        "redirects_http_to_https": False, "server_exposed": False, "server_version": None,
        "php_version_exposed": False, "php_version": None, "missing_security_headers": [],
        "missing_csp": False, "insecure_cookies": [], "cms_detected": None,
        "cms_version_exposed": None, "wordpress_xmlrpc_open": False, "robots_admin_paths": [], "error": None
    }
    try:
        r_http = requests.get(f"http://{domain}", timeout=5, allow_redirects=False, verify=False)
        result["redirects_http_to_https"] = r_http.headers.get("Location", "").startswith("https://")
    except: pass

    try:
        response = requests.get(f"https://{domain}", timeout=5, verify=False)
        headers = response.headers
        html = response.text.lower()

        server_val = headers.get("Server", headers.get("server", ""))
        if server_val:
            result["server_version"] = server_val
            if any(c.isdigit() for c in server_val): result["server_exposed"] = True

        xpb = headers.get("X-Powered-By", "")
        if "php/" in xpb.lower():
            result["php_version_exposed"] = True
            result["php_version"] = xpb

        sec_hdrs = ["Strict-Transport-Security", "X-Frame-Options", "X-Content-Type-Options", "Permissions-Policy"]
        result["missing_security_headers"] = [h for h in sec_hdrs if h not in headers]
        result["missing_csp"] = "Content-Security-Policy" not in headers

        if "wp-content" in html or "wp-includes" in html:
            result["cms_detected"] = "WordPress"
            m = re.search(r'<meta name="generator" content="(wordpress[^"]+)"', html)
            if m: result["cms_version_exposed"] = m.group(1)
            try:
                xr = requests.get(f"https://{domain}/xmlrpc.php", timeout=4, verify=False)
                if xr.status_code in (200, 405) and "xmlrpc" in xr.text.lower():
                    result["wordpress_xmlrpc_open"] = True
            except: pass
    except Exception as e:
        result["error"] = str(e)
    return result

def check_email_security(domain):
    result = {"spf_found": False, "dmarc_found": False, "dmarc_policy": None, "dmarc_weak_policy": False, "spoofable": False}
    try:
        r_spf = requests.get(f"https://dns.google/resolve?name={domain}&type=TXT", timeout=5).json()
        if "Answer" in r_spf:
            for a in r_spf["Answer"]:
                if "v=spf1" in a.get("data", ""): result["spf_found"] = True

        r_dmarc = requests.get(f"https://dns.google/resolve?name=_dmarc.{domain}&type=TXT", timeout=5).json()
        if "Answer" in r_dmarc:
            for a in r_dmarc["Answer"]:
                data = a.get("data", "")
                if "v=DMARC1" in data:
                    result["dmarc_found"] = True
                    m = re.search(r'p=(\w+)', data)
                    if m:
                        policy = m.group(1).lower()
                        result["dmarc_policy"] = policy
                        if policy == "none": result["dmarc_weak_policy"] = True

        if not result["spf_found"] or not result["dmarc_found"] or result["dmarc_weak_policy"]:
            result["spoofable"] = True
    except: pass
    return result

CRITICAL_PORTS = {21: "FTP", 22: "SSH", 23: "Telnet", 3306: "MySQL", 3389: "RDP", 5432: "PostgreSQL"}

def _probe_port(domain, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)
            return port if s.connect_ex((domain, port)) == 0 else None
    except: return None

def check_open_ports(domain):
    open_ports = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(_probe_port, domain, p): p for p in CRITICAL_PORTS}
        for f in concurrent.futures.as_completed(futures):
            p = f.result()
            if p: open_ports[str(p)] = CRITICAL_PORTS[p]
    return open_ports

def evaluate_risk(domain, ssl_r, web_r, email_r, ports_r):
    reasons = []
    criticality = 0
    if ssl_r.get("expired"): reasons.append("SSL expiré"); criticality += 3
    if ssl_r.get("weak_tls"): reasons.append(f"TLS obsolète ({ssl_r.get('tls_version')})"); criticality += 3
    if web_r.get("server_exposed"): reasons.append(f"Serveur exposé ({web_r.get('server_version')})"); criticality += 2
    if web_r.get("php_version_exposed"): reasons.append(f"PHP exposé ({web_r.get('php_version')})"); criticality += 2
    if not web_r.get("redirects_http_to_https"): reasons.append("Pas de HTTPS forcé"); criticality += 2
    if len(web_r.get("missing_security_headers", [])) >= 3: reasons.append("Manque headers sécu"); criticality += 1
    if web_r.get("wordpress_xmlrpc_open"): reasons.append("WP xmlrpc exposé"); criticality += 4
    if email_r.get("spoofable"): reasons.append("Domaine usurpable (Fake Email possible)"); criticality += 4
    for port, service in ports_r.items(): reasons.append(f"Port critique: {port} ({service})"); criticality += 3

    has_vulnerability = len(reasons) > 0
    if criticality >= 8 or ports_r or (email_r.get("spoofable") and not email_r.get("dmarc_found")):
        template = "template_alerte_critique"
    elif has_vulnerability:
        template = "template_alerte_rouge"
    else:
        template = "template_contact_classique"

    return {
        "scanned_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "domain": domain,
        "has_vulnerability": has_vulnerability,
        "criticality_score": criticality,
        "vulnerability_reasons": reasons,
        "email_template_id": template,
        "raw_data": {"ssl": ssl_r, "web": web_r, "email_security": email_r, "exposed_ports": ports_r}
    }

# ----------------- FIN DES FONCTIONS COPIÉES -----------------

def execute_full_scan(domain: str):
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        f_ssl   = ex.submit(check_ssl, domain)
        f_web   = ex.submit(check_web, domain)
        f_email = ex.submit(check_email_security, domain)
        f_ports = ex.submit(check_open_ports, domain)
        ssl_r   = f_ssl.result()
        web_r   = f_web.result()
        email_r = f_email.result()
        ports_r = f_ports.result()
    
    return evaluate_risk(domain, ssl_r, web_r, email_r, ports_r)


def send_webhook_async(report: dict, webhook_url: str):
    """Fonction qui tourne en arrière-plan pour pousser le résultat à Make"""
    try:
        requests.post(webhook_url, json=report, timeout=5)
    except:
        pass


@app.post("/api/scan")
def scan_endpoint(request: ScanRequest, background_tasks: BackgroundTasks):
    """
    Déclenche un scan complet du domaine fourni.
    """
    domain = request.domain.strip()
    
    # Validation basique du domaine
    if not re.match(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', domain):
        raise HTTPException(status_code=400, detail="Format de domaine invalide")

    # Exécution du scan
    report = execute_full_scan(domain)

    # Si Make a fourni une URL webhook de retour, on lui envoie le résultat en arrière plan
    if request.webhook_url:
        background_tasks.add_task(send_webhook_async, report, request.webhook_url)

    return report

@app.get("/")
def health_check():
    return {"status": "OpenClaw API is running", "version": "2.0"}

if __name__ == "__main__":
    import uvicorn
    # Lancement local: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
