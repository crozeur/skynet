import type { NextRequest } from "next/server";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

function getBuckets(): Map<string, Bucket> {
  const g = globalThis as unknown as { __SKYNET_RATE_LIMIT__?: Map<string, Bucket> };
  if (!g.__SKYNET_RATE_LIMIT__) g.__SKYNET_RATE_LIMIT__ = new Map<string, Bucket>();
  return g.__SKYNET_RATE_LIMIT__;
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function sameOriginOnly(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // allow server-to-server / same-origin navigations

  try {
    const originHost = new URL(origin).host;
    const requestHost = new URL(req.url).host;
    return originHost === requestHost;
  } catch {
    return false;
  }
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const buckets = getBuckets();

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: Math.max(0, opts.max - 1), resetAt };
  }

  const nextCount = existing.count + 1;
  existing.count = nextCount;
  buckets.set(key, existing);

  const ok = nextCount <= opts.max;
  return {
    ok,
    remaining: Math.max(0, opts.max - nextCount),
    resetAt: existing.resetAt,
  };
}

function getUpstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

async function upstashGetNumber(endpoint: string, cfg: { url: string; token: string }): Promise<number | null> {
  const res = await fetch(`${cfg.url}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { result?: unknown };
  const n = typeof data.result === "number" ? data.result : Number(data.result);
  return Number.isFinite(n) ? n : null;
}

function safeKey(key: string): string {
  return encodeURIComponent(key);
}

export async function rateLimitDistributed(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const cfg = getUpstashConfig();

  // Safe fallback if Upstash is not configured.
  if (!cfg) return rateLimit(key, opts);

  try {
    const k = safeKey(key);
    const count = await upstashGetNumber(`/incr/${k}`, cfg);

    // If Upstash errors, fallback instead of breaking.
    if (count == null) return rateLimit(key, opts);

    // Set expiry only when the key is first created.
    if (count === 1) {
      await upstashGetNumber(`/expire/${k}/${Math.ceil(opts.windowMs / 1000)}`, cfg);
    }

    const ok = count <= opts.max;

    if (ok) {
      return {
        ok: true,
        remaining: Math.max(0, opts.max - count),
        resetAt: now + opts.windowMs,
      };
    }

    // Only compute TTL when blocked (to set Retry-After).
    const ttlSeconds = await upstashGetNumber(`/ttl/${k}`, cfg);
    const ttlMs = ttlSeconds != null && ttlSeconds > 0 ? ttlSeconds * 1000 : opts.windowMs;

    return {
      ok: false,
      remaining: 0,
      resetAt: now + ttlMs,
    };
  } catch {
    // Never block the site if rate limit infra fails.
    return rateLimit(key, opts);
  }
}

export async function rateLimitByIp(
  req: NextRequest,
  prefix: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  return rateLimitDistributed(`skynet:${prefix}:${ip}`, opts);
}

export async function readJsonWithLimit<T>(req: NextRequest, maxBytes: number): Promise<T> {
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const len = Number(contentLength);
    if (Number.isFinite(len) && len > maxBytes) {
      throw new Error("PAYLOAD_TOO_LARGE");
    }
  }

  const raw = await req.text();
  if (raw.length > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("INVALID_JSON");
  }
}
