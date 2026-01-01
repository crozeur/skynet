import { NextRequest, NextResponse } from "next/server";

// Professional French glossary
const frenchGlossary: Record<string, string> = {
  cybersecurity: "cybersécurité",
  cybersecure: "cybersécurisé",
  "threat detection": "détection des menaces",
  "incident response": "réponse aux incidents",
  incident: "incident",
  vulnerability: "vulnérabilité",
  compliance: "conformité",
  soc: "SOC",
  siem: "SIEM",
  phishing: "hameçonnage",
  ransomware: "rançongiciel",
  malware: "malveillance",
  breach: "violation",
  audit: "audit",
  monitoring: "surveillance",
  detection: "détection",
  alert: "alerte",
  endpoint: "terminal",
  network: "réseau",
  threat: "menace",
  attack: "attaque",
  response: "réponse",
  recovery: "récupération",
  backup: "sauvegarde",
  framework: "cadre",
  assessment: "évaluation",
  posture: "posture",
};

async function translateWithGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    // Google Translate via gtx endpoint
    const encoded = encodeURIComponent(text);
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encoded}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    // Google returns nested array structure
    if (Array.isArray(data) && data[0]) {
      let result = "";
      if (Array.isArray(data[0])) {
        // data[0] is array of [translated, original] pairs
        result = data[0].map((chunk: any[]) => chunk[0] || "").join("");
      }
      return result || null;
    }

    return null;
  } catch (error) {
    console.error("Google Translate error:", error);
    return null;
  }
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `en|${targetLang}`,
    });

    const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Check for quota error
    if (data.responseStatus === 429 || data.responseData?.translatedText?.includes("MYMEMORY WARNING")) {
      return null;
    }

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return null;
  } catch (error) {
    console.error("MyMemory error:", error);
    return null;
  }
}

function applyGlossary(text: string): string {
  let result = text;

  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.entries(frenchGlossary).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [en, fr] of sortedTerms) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, fr);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang = "fr" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    // Try Google Translate first (most reliable)
    let translated = await translateWithGoogle(text, targetLang);

    // If Google fails, try MyMemory
    if (!translated) {
      translated = await translateWithMyMemory(text, targetLang);
    }

    // If both fail, use glossary only
    if (!translated) {
      translated = applyGlossary(text);
    } else {
      // Apply glossary to improve translation quality
      translated = applyGlossary(translated);
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
