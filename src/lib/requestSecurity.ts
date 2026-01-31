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
