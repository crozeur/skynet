/**
 * Sector definitions with exact names for Airtable synchronization
 * IMPORTANT: These MUST match exactly the options created in Airtable
 */

export const SECTOR_OPTIONS = [
  {
    key: "banking",
    en: "Banking / Insurance",
    fr: "Banque / Assurance",
  },
  {
    key: "public",
    en: "Public Administration",
    fr: "Administration publique",
  },
  {
    key: "healthcare",
    en: "Healthcare",
    fr: "Santé",
  },
  {
    key: "telecom",
    en: "Telecommunications",
    fr: "Télécommunications",
  },
  {
    key: "energy",
    en: "Energy / Utilities",
    fr: "Énergie / Utilités",
  },
  {
    key: "manufacturing",
    en: "Manufacturing / Industry",
    fr: "Industrie / Fabrication",
  },
  {
    key: "retail",
    en: "Retail / E-commerce",
    fr: "Commerce de détail / E-commerce",
  },
  {
    key: "other",
    en: "Other",
    fr: "Autre",
  },
] as const;

/**
 * Get the label for a sector key in a specific language
 */
export function getSectorLabel(
  key: string,
  language: "en" | "fr"
): string | undefined {
  const option = SECTOR_OPTIONS.find((opt) => opt.key === key);
  return option ? option[language] : undefined;
}

/**
 * Get all sector labels for a language
 */
export function getAllSectorLabels(language: "en" | "fr"): string[] {
  return SECTOR_OPTIONS.map((opt) => opt[language]);
}

/**
 * Verify that translations match Airtable options (for testing)
 */
export function verifySectorSync(translations: Record<string, string>): {
  missing: string[];
  extra: string[];
  valid: boolean;
} {
  const translationLabels = Object.values(translations);
  const airtableOptions = getAllSectorLabels("en").concat(
    getAllSectorLabels("fr")
  );

  const missing = airtableOptions.filter((opt) => !translationLabels.includes(opt));
  const extra = translationLabels.filter((label) => !airtableOptions.includes(label));

  return {
    missing,
    extra,
    valid: missing.length === 0 && extra.length === 0,
  };
}
