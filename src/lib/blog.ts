export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  pillar: "SOC" | "AUDIT" | "CLOUD";
  date: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "loi-18-07-cybersecurite-algerie",
    title: "Loi 18‑07 : 7 erreurs qui exposent encore les PME algériennes",
    excerpt: "Que demande vraiment la loi 18‑07, et où la plupart des entreprises restent vulnérables malgré les audits.",
    pillar: "AUDIT",
    date: "2025-01-01",
    content: `
      <h2>Introduction</h2>
      <p>La loi 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel impose des exigences strictes aux entreprises algériennes. Pourtant, de nombreuses PME restent vulnérables malgré les audits de conformité.</p>
      
      <h2>Les 7 erreurs courantes</h2>
      
      <h3>1. Manque de documentation</h3>
      <p>La plupart des entreprises n'ont pas de registre de traitement des données à jour. C'est pourtant une exigence fondamentale de la loi 18-07.</p>
      
      <h3>2. Absence de politique de sécurité</h3>
      <p>Sans politique de sécurité formalisée et communiquée aux employés, les données sensibles restent exposées aux fuites et aux accès non autorisés.</p>
      
      <h3>3. Gestion des accès insuffisante</h3>
      <p>Trop d'employés ont accès à des données sensibles dont ils n'ont pas besoin pour leur travail quotidien.</p>
      
      <h3>4. Sauvegardes inadéquates</h3>
      <p>Les sauvegardes ne sont pas testées régulièrement ou sont stockées au même endroit que les données principales.</p>
      
      <h3>5. Formation inexistante</h3>
      <p>Les employés ne sont pas formés aux bonnes pratiques de cybersécurité et aux exigences de la loi 18-07.</p>
      
      <h3>6. Plan de réponse aux incidents absent</h3>
      <p>En cas de violation de données, l'entreprise n'a pas de procédure claire pour réagir rapidement.</p>
      
      <h3>7. Sous-traitants non auditésès</h3>
      <p>Les prestataires externes qui traitent vos données ne sont pas évalués sur leurs pratiques de sécurité.</p>
      
      <h2>Conclusion</h2>
      <p>La conformité à la loi 18-07 nécessite une approche systématique et continue, pas seulement un audit ponctuel. Contactez Skynet Consulting pour un audit complet de votre posture de sécurité.</p>
    `
  },
  {
    slug: "soc-externalise-pme-algerie",
    title: "Pourquoi un SOC externalisé pour les PME algériennes ?",
    excerpt: "Les limites des antivirus et firewalls classiques face aux attaques modernes.",
    pillar: "SOC",
    date: "2025-01-08",
    content: `
      <h2>Le contexte de la cybersécurité en Algérie</h2>
      <p>Les PME algériennes font face à des menaces cybernétiques de plus en plus sophistiquées. Les solutions traditionnelles comme les antivirus et les firewalls ne suffisent plus.</p>
      
      <h2>Qu'est-ce qu'un SOC ?</h2>
      <p>Un Security Operations Center (SOC) est un centre de surveillance et de réponse aux incidents de sécurité qui fonctionne 24/7. Il détecte, analyse et répond aux menaces en temps réel.</p>
      
      <h2>Les limites des solutions traditionnelles</h2>
      
      <h3>Antivirus classiques</h3>
      <p>Les antivirus détectent uniquement les menaces connues via des signatures. Les attaques zero-day passent inaperçues.</p>
      
      <h3>Firewalls seuls</h3>
      <p>Un firewall bloque les accès non autorisés mais ne détecte pas les comportements malveillants à l'intérieur du réseau.</p>
      
      <h3>Manque de surveillance continue</h3>
      <p>Sans surveillance 24/7, les attaques peuvent se propager pendant des jours avant d'être détectées.</p>
      
      <h2>Avantages d'un SOC externalisé</h2>
      
      <h3>Coût optimisé</h3>
      <p>Construire un SOC interne coûte entre 500 000 et 1 500 000 USD par an. Un SOC externalisé démarre à 7 000 USD/mois.</p>
      
      <h3>Expertise immédiate</h3>
      <p>Accès à des analystes certifiés et à des technologies de pointe sans avoir à recruter et former une équipe.</p>
      
      <h3>Couverture 24/7</h3>
      <p>Surveillance continue de votre infrastructure, même la nuit et les week-ends.</p>
      
      <h3>Conformité réglementaire</h3>
      <p>Aide à répondre aux exigences de la loi 18-07 et des normes internationales (ISO 27001, etc.).</p>
      
      <h2>Comment ça marche ?</h2>
      <p>Le SOC externalisé de Skynet Consulting surveille vos serveurs, réseaux, applications et endpoints. En cas de détection d'une menace, nos analystes interviennent immédiatement pour contenir l'attaque et vous alerter.</p>
      
      <h2>Conclusion</h2>
      <p>Pour les PME algériennes, un SOC externalisé est la solution la plus rentable et efficace pour se protéger contre les cybermenaces modernes. Contactez-nous pour une évaluation gratuite.</p>
    `
  },
  {
    slug: "migration-cloud-securisee-algerie",
    title: "Migration cloud sécurisée : guide pour les entreprises algériennes",
    excerpt: "Comment migrer vers le cloud tout en respectant la souveraineté des données et la loi 18-07.",
    pillar: "CLOUD",
    date: "2025-01-15",
    content: `
      <h2>Le cloud en Algérie : opportunités et défis</h2>
      <p>Le cloud computing offre flexibilité, scalabilité et réduction des coûts. Mais pour les entreprises algériennes, la migration doit respecter les exigences de souveraineté des données et de la loi 18-07.</p>
      
      <h2>Les préoccupations courantes</h2>
      
      <h3>Souveraineté des données</h3>
      <p>Où sont hébergées vos données ? Qui y a accès ? Ces questions sont cruciales pour la conformité réglementaire.</p>
      
      <h3>Sécurité du cloud</h3>
      <p>Le cloud est-il vraiment sûr ? Comment garantir que vos données ne seront pas compromises ?</p>
      
      <h3>Coûts cachés</h3>
      <p>Les coûts de migration, de formation et d'optimisation peuvent surprendre sans une planification adéquate.</p>
      
      <h2>Notre approche de migration sécurisée</h2>
      
      <h3>1. Audit initial</h3>
      <p>Évaluation complète de votre infrastructure actuelle et identification des workloads prioritaires pour la migration.</p>
      
      <h3>2. Choix de la solution</h3>
      <p>Cloud souverain algérien, cloud hybride ou multi-cloud selon vos besoins et contraintes réglementaires.</p>
      
      <h3>3. Plan de migration</h3>
      <p>Migration progressive par phases avec tests à chaque étape pour minimiser les risques.</p>
      
      <h3>4. Sécurisation</h3>
      <p>Configuration des contrôles de sécurité : chiffrement, gestion des accès, surveillance continue.</p>
      
      <h3>5. Optimisation des coûts</h3>
      <p>Mise en place de tableaux de bord FinOps pour suivre et optimiser vos dépenses cloud.</p>
      
      <h2>Options de cloud souverain</h2>
      <p>Plusieurs options existent pour héberger vos données en Algérie tout en bénéficiant des avantages du cloud : data centers locaux, cloud hybride avec réplication locale, ou solutions cloud souveraines certifiées.</p>
      
      <h2>Résultats attendus</h2>
      <ul>
        <li>Réduction des coûts opérationnels de 30-40%</li>
        <li>Infrastructure moderne et scalable</li>
        <li>Conformité avec la loi 18-07</li>
        <li>Amélioration de la sécurité et de la disponibilité</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>La migration vers le cloud est inévitable, mais elle doit être planifiée et sécurisée. Skynet Consulting vous accompagne dans cette transformation avec une expertise locale et internationale.</p>
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
