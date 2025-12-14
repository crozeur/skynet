import { NextRequest, NextResponse } from "next/server";
import { createLeadInAirtable } from "@/lib/airtable";
import { notifyNewLead } from "@/lib/slack";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, name, company, sectors, language } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate sectors
    if (!sectors || !Array.isArray(sectors) || sectors.length === 0) {
      return NextResponse.json(
        { error: "At least one sector is required" },
        { status: 400 }
      );
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
      { error: "Failed to process lead", details: errorMessage },
      { status: 500 }
    );
  }
}
