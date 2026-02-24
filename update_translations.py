import re
import json

updates = {
  'en': {
    'hero_title': 'Enterprise-Grade Cybersecurity, Powered by AI & Automation',
    'hero_desc': 'We democratize high-end security for SMEs and agile enterprises. Our AI-driven execution platform and ephemeral infrastructure deliver Senior-level audits and cloud migrations at a fraction of the traditional cost.',
    'hero_benefit1': 'AI-Augmented Execution: Senior expertise delivered flawlessly on-site via our proprietary AI playbooks',
    'hero_benefit2': 'Zero-Trace Infrastructure: 1 Mission = 1 Ephemeral VM. Total data isolation and absolute security',
    'hero_benefit3': 'Cost-Effective Excellence: Big 4 quality audits and migrations, accessible to mid-market budgets',
    'service1_title': 'AI-Augmented Security Audits & Pentesting',
    'service1_for': 'SMEs, Mid-market companies (ETIs), and Startups needing enterprise-grade security validation',
    'service1_problem': 'Traditional audits are prohibitively expensive, slow, and rely on consultants who leave with your context. SMEs are priced out of high-quality security assessments.',
    'service1_solution': 'Our AI Brain guides certified field operators step-by-step, ensuring exhaustive, standardized, and flawless execution:',
    'service1_point1': 'Automated vulnerability scanning and Active Directory audits',
    'service1_point2': 'Physical and logical security assessments guided by AI playbooks',
    'service1_point3': 'Real-time transcription and automated, audit-ready reporting',
    'service1_point4': 'Zero-trace execution: all tools run from isolated, ephemeral environments',
    'service1_point5': 'Actionable 90-day remediation plan generated instantly',
    'service1_results': 'Results for your organization:',
    'service1_result1': 'Senior-level audit quality at a highly competitive price',
    'service1_result2': 'Standardized, bias-free security assessment',
    'service1_result3': 'Immediate delivery of actionable reports',
    'service1_result4': 'Absolute data confidentiality',
    'service1_price': 'From ,000 for comprehensive SME audits',
    'service2_title': 'Secure Cloud Migrations & Ephemeral Infrastructure',
    'service2_for': 'Companies looking to modernize their IT or require ultra-secure, isolated environments',
    'service2_problem': 'Cloud migrations are risky and complex. Furthermore, traditional consulting leaves behind residual data and access, creating long-term security risks.',
    'service2_solution': 'We use Infrastructure as Code (Terraform) to build, migrate, and destroy environments with military-grade precision:',
    'service2_point1': '1 Client = 1 Dedicated, Ephemeral Virtual Machine',
    'service2_point2': 'Automated cloud architecture deployment (AWS, Azure, GCP)',
    'service2_point3': 'Secure data migration with zero residual footprint',
    'service2_point4': 'Guaranteed GDPR/ISO compliance through Right to be Forgotten by design',
    'service2_results': 'Results for your organization:',
    'service2_result1': 'Flawless, automated cloud transitions',
    'service2_result2': 'Zero risk of cross-client data contamination',
    'service2_result3': 'Infrastructure that is secure by design',
    'service2_price': 'From ,000 depending on infrastructure complexity',
    'service3_title': 'Continuous Compliance & Automated FinOps',
    'service3_for': 'Growing businesses needing to maintain ISO 27001, SOC 2, or GDPR compliance while controlling cloud costs',
    'service3_problem': 'Maintaining compliance and managing cloud costs requires constant manual effort, leading to drift, audit failures, and budget overruns.',
    'service3_solution': 'Our platform continuously monitors your posture and costs, automatically generating the evidence you need:',
    'service3_point1': 'Automated evidence collection for ISO 27001 and SOC 2',
    'service3_point2': 'Real-time cloud cost optimization (FinOps) dashboards',
    'service3_point3': 'AI-generated remediation scripts for compliance drift',
    'service3_results': 'Results for your organization:',
    'service3_result1': 'Always audit-ready for compliance frameworks',
    'service3_result2': 'Cloud costs reduced by up to 40%',
    'service3_result3': 'Freed-up internal IT resources',
    'service3_price': 'From ,000/month for continuous governance',
    'why_choose_subtitle': 'The Cybertech Revolutionizing IT Consulting',
    'why_choose_desc': 'Skynet Consulting replaces the outdated, expensive traditional consulting model with an AI-powered execution platform, delivering unmatched security, speed, and cost-efficiency.',
    'benefit_one_1': 'The Skynet AI Brain',
    'benefit_one_1_desc': 'Our proprietary AI contains decades of senior cybersecurity expertise, guiding our field operators flawlessly through every mission.',
    'benefit_one_2': 'Ephemeral Infrastructure',
    'benefit_one_2_desc': 'We deploy a dedicated, isolated environment for your mission and destroy it upon completion. Zero trace, absolute security.',
    'benefit_one_3': 'Unbeatable ROI',
    'benefit_one_3_desc': 'By automating the expertise and standardizing the execution, we deliver Big 4 quality at a fraction of the cost.',
    'faq_q1': 'How does your AI-augmented execution work?',
    'faq_a1': 'Our field operators use a secure, locked-down interface to communicate with our AI Brain. The AI provides step-by-step playbooks, generates custom scripts on the fly, and compiles the final report, ensuring senior-level quality on every mission.',
    'faq_q2': 'What do you mean by Ephemeral Infrastructure?',
    'faq_a2': 'For every client mission, we automatically provision a dedicated Virtual Machine. All tools, data, and analysis happen there. Once the mission is over, the VM is permanently destroyed, guaranteeing total data isolation and security.',
    'faq_q3': 'Who is your ideal client?',
    'faq_a3': 'SMEs, ETIs, and agile enterprises that need high-end cybersecurity audits, cloud migrations, or compliance support, but find traditional consulting firms too slow or expensive.'
  },
  'fr': {
    'hero_title': 'La Cybersécurité d\'Excellence, Propulsée par l\'IA',
    'hero_desc': 'Nous démocratisons la sécurité de haut niveau pour les PME et ETI. Notre plateforme d\'exécution IA et notre infrastructure éphémère offrent des audits et migrations de niveau Senior à une fraction du coût traditionnel.',
    'hero_benefit1': 'Exécution Augmentée par l\'IA : L\'expertise Senior déployée sans faille sur le terrain via nos playbooks propriétaires',
    'hero_benefit2': 'Infrastructure Zéro Trace : 1 Mission = 1 VM Éphémère. Isolation totale des données et sécurité absolue',
    'hero_benefit3': 'Excellence Accessible : Des audits et migrations de qualité Big 4, accessibles aux budgets des PME/ETI',
    'service1_title': 'Audits de Sécurité & Pentest Augmentés par l\'IA',
    'service1_for': 'PME, ETI et Startups nécessitant une validation de sécurité de niveau entreprise',
    'service1_problem': 'Les audits traditionnels sont chers, lents et dépendent de consultants qui repartent avec votre contexte. Les PME sont souvent exclues des évaluations de haute qualité.',
    'service1_solution': 'Notre Cerveau IA guide nos opérateurs certifiés étape par étape, garantissant une exécution exhaustive, standardisée et sans faille :',
    'service1_point1': 'Scans de vulnérabilités et audits Active Directory automatisés',
    'service1_point2': 'Évaluations de sécurité physique et logique guidées par l\'IA',
    'service1_point3': 'Transcription en temps réel et génération automatique de rapports',
    'service1_point4': 'Exécution zéro trace : tous les outils tournent dans des environnements isolés',
    'service1_point5': 'Plan de remédiation à 90 jours généré instantanément',
    'service1_results': 'Résultats pour votre organisation :',
    'service1_result1': 'Qualité d\'audit de niveau Senior à un prix ultra-compétitif',
    'service1_result2': 'Évaluation de sécurité standardisée et sans biais',
    'service1_result3': 'Livraison immédiate de rapports actionnables',
    'service1_result4': 'Confidentialité absolue des données',
    'service1_price': 'À partir de 3 000 € pour un audit complet de PME',
    'service2_title': 'Migrations Cloud & Infrastructure Éphémère',
    'service2_for': 'Entreprises cherchant à moderniser leur IT ou nécessitant des environnements ultra-sécurisés',
    'service2_problem': 'Les migrations Cloud sont complexes. De plus, le conseil traditionnel laisse souvent des traces (données, accès), créant des risques de sécurité à long terme.',
    'service2_solution': 'Nous utilisons l\'Infrastructure as Code (Terraform) pour construire, migrer et détruire des environnements avec une précision militaire :',
    'service2_point1': '1 Client = 1 Machine Virtuelle Dédiée et Éphémère',
    'service2_point2': 'Déploiement automatisé d\'architectures Cloud (AWS, Azure, GCP)',
    'service2_point3': 'Migration sécurisée des données avec empreinte résiduelle nulle',
    'service2_point4': 'Conformité RGPD/ISO garantie par le Droit à l\'oubli by design',
    'service2_results': 'Résultats pour votre organisation :',
    'service2_result1': 'Transitions Cloud fluides et automatisées',
    service2_result2: 'Zéro risque de contamination de données inter-clients',
    'service2_result3': 'Une infrastructure sécurisée dès la conception (Secure by Design)',
    'service2_price': 'À partir de 5 000 € selon la complexité de l\'infrastructure',
    'service3_title': 'Conformité Continue & FinOps Automatisé',
    'service3_for': 'Entreprises en croissance devant maintenir leur conformité (ISO 27001, SOC 2, RGPD) tout en maîtrisant leurs coûts Cloud',
    'service3_problem': 'Maintenir la conformité et gérer les coûts Cloud demande un effort manuel constant, entraînant des dérives, des échecs d\'audit et des dépassements de budget.',
    'service3_solution': 'Notre plateforme surveille en continu votre posture et vos coûts, générant automatiquement les preuves nécessaires :',
    'service3_point1': 'Collecte automatisée de preuves pour ISO 27001 et SOC 2',
    'service3_point2': 'Tableaux de bord d\'optimisation des coûts Cloud (FinOps) en temps réel',
    'service3_point3': 'Scripts de remédiation générés par l\'IA en cas de dérive',
    'service3_results': 'Résultats pour votre organisation :',
    'service3_result1': 'Toujours prêt pour les audits de conformité',
    'service3_result2': 'Coûts Cloud réduits jusqu\'à 40%',
    'service3_result3': 'Ressources IT internes libérées',
    'service3_price': 'À partir de 2 000 €/mois pour une gouvernance continue',
    'why_choose_subtitle': 'La Cybertech qui révolutionne le Conseil IT',
    'why_choose_desc': 'Skynet Consulting remplace le modèle de conseil traditionnel, lent et coûteux, par une plateforme d\'exécution IA, offrant une sécurité, une rapidité et une rentabilité inégalées.',
    'benefit_one_1': 'Le Cerveau IA Skynet',
    'benefit_one_1_desc': 'Notre IA propriétaire contient des décennies d\'expertise cyber Senior, guidant nos opérateurs sur le terrain sans faille à chaque mission.',
    'benefit_one_2': 'Infrastructure Éphémère',
    'benefit_one_2_desc': 'Nous déployons un environnement dédié pour votre mission et le détruisons à la fin. Zéro trace, sécurité absolue.',
    'benefit_one_3': 'Un ROI Imbattable',
    'benefit_one_3_desc': 'En automatisant l\'expertise et en standardisant l\'exécution, nous offrons la qualité des Big 4 à une fraction du prix.',
    'faq_q1': 'Comment fonctionne votre exécution augmentée par l\'IA ?',
    'faq_a1': 'Nos opérateurs utilisent une interface sécurisée pour communiquer avec notre Cerveau IA. L\'IA fournit des playbooks étape par étape, génère des scripts sur mesure et compile le rapport final, garantissant une qualité Senior.',
    'faq_q2': 'Qu\'entendez-vous par Infrastructure Éphémère ?',
    'faq_a2': 'Pour chaque mission client, nous provisionnons automatiquement une Machine Virtuelle dédiée. Tous les outils et analyses y sont exécutés. À la fin de la mission, la VM est détruite, garantissant une isolation totale des données.',
    'faq_q3': 'Quel est votre client idéal ?',
    'faq_a3': 'Les PME, ETI et entreprises agiles qui ont besoin d\'audits de cybersécurité, de migrations Cloud ou d\'accompagnement à la conformité de haut niveau, mais qui trouvent les cabinets traditionnels trop chers ou inadaptés.'
  }
}

with open('src/lib/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We will use regex to replace the values
for lang, keys in updates.items():
    # Find the block for the language
    lang_pattern = re.compile(rf'({lang}:\s*{{)(.*?)(^\s*}},)', re.MULTILINE | re.DOTALL)
    match = lang_pattern.search(content)
    if match:
        block = match.group(2)
        for key, value in keys.items():
            # Escape quotes in value
            safe_value = value.replace('"', '\\"')
            # Replace single line or multiline string
            # Matches key: "value", or key: alue, or key: "multiline \n value",
            key_pattern = re.compile(rf'(\s*{key}:\s*)(["].*?["])(,?)', re.DOTALL)
            
            if key_pattern.search(block):
                block = key_pattern.sub(rf'\g<1>"{safe_value}"\g<3>', block)
            else:
                # If it's a multiline string without backticks (e.g. concatenated or just broken across lines)
                # We can just try to replace the first line and remove the rest, but it's safer to just replace the whole block
                pass
        
        # Replace the block in the content
        content = content[:match.start(2)] + block + content[match.end(2):]

with open('src/lib/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations updated successfully!")
