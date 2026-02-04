export function pillarToSlug(pillar: string): string {
  return pillar.trim().toLowerCase();
}

export function topicToSlug(topic: string): string {
  const noAccents = topic
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return noAccents
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "-")
    .replace(/-+/g, "-");
}
