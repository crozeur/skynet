import { NextRequest, NextResponse } from "next/server";
import { createLeadInAirtable } from "@/lib/airtable";
import { notifyNewLead } from "@/lib/slack";
import { getClientIp, rateLimit, readJsonWithLimit, sameOriginOnly } from "@/lib/requestSecurity";

export async function POST(request: NextRequest) {
  try {
    if (!sameOriginOnly(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);
    const rl = rateLimit(`lead:${ip}`, { windowMs: 60_000, max: 5 });
    if (!rl.ok) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    // Parse request body
    const body = await readJsonWithLimit<{
      email?: unknown;
      name?: unknown;
      company?: unknown;
      sectors?: unknown;
      language?: unknown;
      website?: unknown; // honeypot
    }>(request, 12_000);

    // Honeypot: if filled, pretend success to avoid giving signal to bots.
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const language = body.language === "fr" || body.language === "en" ? body.language : "en";
    const sectors = Array.isArray(body.sectors)
      ? body.sectors.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)
      : [];

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (name.length > 120 || company.length > 160) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Validate sectors
    if (sectors.length === 0) {
      return NextResponse.json(
        { error: "At least one sector is required" },
        { status: 400 }
      );
    }

    if (sectors.length > 10) {
      return NextResponse.json({ error: "Too many sectors" }, { status: 400 });
    }

    // Create lead in Airtable
    await createLeadInAirtable(email, name, company, sectors, language);

    // Notify Slack
    await notifyNewLead(email, name, company, sectors, language);

    // Return success response
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing lead:", errorMessage);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}
