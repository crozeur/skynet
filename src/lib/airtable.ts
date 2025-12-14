/**
 * Airtable utility function to create a new lead record
 */

export async function createLeadInAirtable(
  email: string,
  name?: string,
  company?: string,
  sectors?: string[],
  language?: string
): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    throw new Error(
      "Missing required Airtable environment variables: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, or AIRTABLE_TABLE_NAME"
    );
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  const payload = {
    records: [
      {
        fields: {
          Email: email,
          "Nom contact": name || "",
          "Nom entreprise": company || "",
          Secteur: sectors && sectors.length > 0 ? sectors : [],
          Langue: language || "fr",
          Statut: "À contacter",
        },
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Airtable API error: ${response.status} ${JSON.stringify(errorData)}`
    );
  }
}
