/**
 * Slack utility function to notify new leads
 */

export async function notifyNewLead(
  email: string,
  name?: string,
  company?: string,
  sectors?: string[],
  language?: string
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Missing required environment variable: SLACK_WEBHOOK_URL");
  }

  const contactName = name || "Non précisé";
  const companyName = company || "Non précisée";
  const sectorsList = sectors && sectors.length > 0 ? sectors.join(", ") : "Non précisé";
  const languageDisplay = language || "fr";
  
  const message = {
    text: `🔥 Nouveau lead site : ${email} – ${contactName} – Entreprise : ${companyName} – Secteurs : ${sectorsList} – Langue : ${languageDisplay}`,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Slack webhook error: ${response.status} ${errorData}`
    );
  }
}
