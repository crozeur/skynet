import json

with open('src/lib/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        '"Protect Your Critical Infrastructure with Confidence"',
        '"Enterprise-Grade Cybersecurity, Powered by AI & Automation"'
    ),
    (
        '"24/7 threat monitoring and response by our SOC, end-to-end security audits, and strategic guidance. A holistic approach to secure, audit, and govern your cybersecurity."',
        '"We democratize high-end security for SMEs and agile enterprises. Our AI-driven execution platform and ephemeral infrastructure deliver Senior-level audits and cloud migrations at a fraction of the traditional cost."'
    ),
    (
        '"Continuous monitoring by our Security Operations Center (SOC) and 24/7 threat response assisted by AI"',
        '"AI-Augmented Execution: Senior expertise delivered flawlessly on-site via our proprietary AI playbooks"'
    ),
    (
        '"Security audits and compliance assessments across your entire information system"',
        '"Zero-Trace Infrastructure: 1 Mission = 1 Ephemeral VM. Total data isolation and absolute security"'
    ),
    (
        '"Expert consulting and strategy tailored to all sectors and organization sizes"',
        '"Cost-Effective Excellence: Big 4 quality audits and migrations, accessible to mid-market budgets"'
    ),
    (
        '"24/7 Surveillance & Response - External SOC"',
        '"AI-Augmented Security Audits & Pentesting"'
    ),
    (
        '"Ministries, banks, large enterprises, and operators of vital importance (OIV)"',
        '"SMEs, Mid-market companies (ETIs), and Startups needing enterprise-grade security validation"'
    ),
    (
        '"Without centralized monitoring or formal incident response, attacks stay undetected for days. Compromises surface too late, lateral movement slips through, data is exfiltrated. Lack of 24/7 coverage allows threats to persist inside the environment."',
        '"Traditional audits are prohibitively expensive, slow, and rely on consultants who leave with your context. SMEs are priced out of high-quality security assessments."'
    ),
    (
        '"Rapid deployment of an AI-powered external SOC with global coverage:"',
        '"Our AI Brain guides certified field operators step-by-step, ensuring exhaustive, standardized, and flawless execution:"'
    ),
    (
        '"24/7 monitoring of all servers, networks, firewalls, and critical applications"',
        '"Automated vulnerability scanning and Active Directory audits"'
    ),
    (
        '"Automatic threat detection with instant alerts"',
        '"Physical and logical security assessments guided by AI playbooks"'
    ),
    (
        '"Immediate attack containment and response"',
        '"Real-time transcription and automated, audit-ready reporting"'
    ),
    (
        '"French-language reporting with incident analysis and recommendations"',
        '"Zero-trace execution: all tools run from isolated, ephemeral environments"'
    ),
    (
        '"Sovereign hosting option (local cloud or secure data center)"',
        '"Actionable 90-day remediation plan generated instantly"'
    ),
    (
        '"90% of attacks automatically stopped"',
        '"Senior-level audit quality at a highly competitive price"'
    ),
    (
        '"Detection time reduced from days to <2 minutes"',
        '"Standardized, bias-free security assessment"'
    ),
    (
        '"Reduced regulatory risk (banking, data protection, and cybersecurity compliance worldwide)"',
        '"Immediate delivery of actionable reports"'
    ),
    (
        '"Continuous oversight by our analysts, 24/7"',
        '"Absolute data confidentiality"'
    ),
    (
        '"From ,000/month for SMBs/ministries, average ,000-,000/month"',
        '"From ,000 for comprehensive SME audits"'
    ),
    (
        '"Cybersecurity Audit & Compliance"',
        '"Secure Cloud Migrations & Ephemeral Infrastructure"'
    ),
    (
        '"Administrations, banks, healthcare, energy  any organization that must demonstrate the security of its information systems (ISO 27001, PCI-DSS, GDPR, regulatory requirements)"',
        '"Companies looking to modernize their IT or require ultra-secure, isolated environments"'
    ),
    (
        '"Internal audits often lack technical depth and tangible evidence (networks, systems, applications, sensitive data). Resilience against attacks is not demonstrated, and compliance with key frameworks (ISO 27001, PCI-DSS, GDPR) has not been validated."',
        '"Cloud migrations are risky and complex. Furthermore, traditional consulting leaves behind residual data and access, creating long-term security risks."'
    ),
    (
        '"What we deliver in practice:"',
        '"We use Infrastructure as Code (Terraform) to build, migrate, and destroy environments with military-grade precision:"'
    ),
    (
        '"Full cybersecurity audit (technical + organizational) with penetration testing and control review"',
        '"1 Client = 1 Dedicated, Ephemeral Virtual Machine"'
    ),
    (
        '"Mapping of sensitive data, access, and vulnerabilities aligned to ISO 27001, PCI-DSS, and GDPR"',
        '"Automated cloud architecture deployment (AWS, Azure, GCP)"'
    ),
    (
        '"90-day action plan to remediate critical risks with local teams"',
        '"Secure data migration with zero residual footprint"'
    ),
    (
        '"Security awareness (phishing, best practices) and remediation support"',
        '"Guaranteed GDPR/ISO compliance through Right to be Forgotten by design"'
    ),
    (
        '"Clear view of priority cyber risks and real exposure to attacks"',
        '"Flawless, automated cloud transitions"'
    ),
    (
        '"Compliance trajectory (ISO 27001 / PCI-DSS / GDPR) understandable by IT and leadership"',
        '"Zero risk of cross-client data contamination"'
    ),
    (
        '"Stronger credibility with governance bodies and customers"',
        '"Infrastructure that is secure by design"'
    ),
    (
        '"From ,000-,000, up to ,000 for multi-site administrations"',
        '"From ,000 depending on infrastructure complexity"'
    ),
    (
        '"Cloud Modernization & Cost Optimization (FinOps)"',
        '"Continuous Compliance & Automated FinOps"'
    ),
    (
        '"Private groups, OIV, public institutions  organizations aiming to modernize their infrastructure or optimize IT costs"',
        '"Growing businesses needing to maintain ISO 27001, SOC 2, or GDPR compliance while controlling cloud costs"'
    ),
    (
        '"Costly and aging infrastructure (on-prem, aging hardware, fragmented cloud); complex migrations slowed by technical debt, critical business dependencies, and hidden costs (licensing, maintenance, under-optimized cloud)."',
        '"Maintaining compliance and managing cloud costs requires constant manual effort, leading to drift, audit failures, and budget overruns."'
    ),
    (
        '"Rapid assessment and modernization:"',
        '"Our platform continuously monitors your posture and costs, automatically generating the evidence you need:"'
    ),
    (
        '"Express diagnostic of infrastructure (on-premise and cloud)"',
        '"Automated evidence collection for ISO 27001 and SOC 2"'
    ),
    (
        '"Progressive migration (sovereign or hybrid cloud) with security"',
        '"Real-time cloud cost optimization (FinOps) dashboards"'
    ),
    (
        '"Cost dashboards with immediate waste identification"',
        '"AI-generated remediation scripts for compliance drift"'
    ),
    (
        '"Clear visibility of costs and waste"',
        '"Always audit-ready for compliance frameworks"'
    ),
    (
        '"Operational costs reduced by 3040%"',
        '"Cloud costs reduced by up to 40%"'
    ),
    (
        '"Modernized and secured infrastructure for digital transformation"',
        '"Freed-up internal IT resources"'
    ),
    (
        '"From ,000,000 depending on complexity"',
        '"From ,000/month for continuous governance"'
    ),
    (
        '"Enterprise-Grade Security for Every Business"',
        '"The Cybertech Revolutionizing IT Consulting"'
    ),
    (
        '"Skynet Consulting combines 24/7 SOC monitoring, AI-driven threat detection, and expert incident response to protect your organization from evolving cyber threats."',
        '"Skynet Consulting replaces the outdated, expensive traditional consulting model with an AI-powered execution platform, delivering unmatched security, speed, and cost-efficiency."'
    ),
    (
        '"24/7 Security Operations Center"',
        '"The Skynet AI Brain"'
    ),
    (
        '"Our expert SOC team monitors your infrastructure around the clock, detecting and investigating suspicious activities in real-time."',
        '"Our proprietary AI contains decades of senior cybersecurity expertise, guiding our field operators flawlessly through every mission."'
    ),
    (
        '"AI-Powered Threat Detection"',
        '"Ephemeral Infrastructure"'
    ),
    (
        '"Advanced machine learning algorithms detect anomalies and threats that traditional security tools miss."',
        '"We deploy a dedicated, isolated environment for your mission and destroy it upon completion. Zero trace, absolute security."'
    ),
    (
        '"Rapid Incident Response"',
        '"Unbeatable ROI"'
    ),
    (
        '"When threats are identified, our team responds within minutes to contain and remediate the incident."',
        '"By automating the expertise and standardizing the execution, we deliver Big 4 quality at a fraction of the cost."'
    ),
    (
        '"A Managed Security Service Provider runs threat monitoring, detection, and response for you. Skynet delivers 24/7 SOC, incident response, audits, and compliance support without requiring you to build the entire capability in-house."',
        '"Our field operators use a secure, locked-down interface to communicate with our AI Brain. The AI provides step-by-step playbooks, generates custom scripts on the fly, and compiles the final report, ensuring senior-level quality on every mission."'
    ),
    (
        '"Detection to action in minutes. Median response time < 15 minutes, with critical containment started immediately by our SOC engineers (24/7)."',
        '"For every client mission, we automatically provision a dedicated Virtual Machine. All tools, data, and analysis happen there. Once the mission is over, the VM is permanently destroyed, guaranteeing total data isolation and security."'
    ),
    (
        '"Mid-market and enterprise teams that need strong security without hiring a full internal SOC. We also support regulated sectors (finance, healthcare, energy, public) with compliance evidence."',
        '"SMEs, ETIs, and agile enterprises that need high-end cybersecurity audits, cloud migrations, or compliance support, but find traditional consulting firms too slow or expensive."'
    ),
    
    # French replacements
    (
        '"Protégez vos infrastructures critiques en toute confiance"',
        '"La Cybersécurité d\'Excellence, Propulsée par l\'IA"'
    ),
    (
        '"Détection et réponse 24/7, audits complets et pilotage stratégique. Une approche intégrée pour sécuriser, auditer et gouverner votre cybersécurité."',
        '"Nous démocratisons la sécurité de haut niveau pour les PME et ETI. Notre plateforme d\'exécution IA et notre infrastructure éphémère offrent des audits et migrations de niveau Senior à une fraction du coût traditionnel."'
    ),
    (
        '"Surveillance continue par notre centre de sécurité (SOC) et réponse aux menaces 24/7, assistées par IA"',
        '"Exécution Augmentée par l\'IA : L\'expertise Senior déployée sans faille sur le terrain via nos playbooks propriétaires"'
    ),
    (
        '"Audits de sécurité et évaluations de conformité sur l\'ensemble du SI"',
        '"Infrastructure Zéro Trace : 1 Mission = 1 VM Éphémère. Isolation totale des données et sécurité absolue"'
    ),
    (
        '"Conseil expert et stratégie adaptés à tous secteurs et tailles d\'organisation"',
        '"Excellence Accessible : Des audits et migrations de qualité Big 4, accessibles aux budgets des PME/ETI"'
    ),
    (
        '"Surveillance & réponse 24/7  SOC externalisé"',
        '"Audits de Sécurité & Pentest Augmentés par l\'IA"'
    ),
    (
        '"Ministères, Banques, Grands Groupes et OIV (Opérateurs d\'Importance Vitale)"',
        '"PME, ETI et Startups nécessitant une validation de sécurité de niveau entreprise"'
    ),
    (
        '"Sans supervision centralisée ni réponse formalisée, les attaques passent inaperçues plusieurs jours. Détection tardive des compromissions, mouvements latéraux non détectés, données exfiltrées. L\'absence de couverture 24/7 permet une présence prolongée des menaces."',
        '"Les audits traditionnels sont chers, lents et dépendent de consultants qui repartent avec votre contexte. Les PME sont souvent exclues des évaluations de haute qualité."'
    ),
    (
        '"Déploiement rapide d\'un SOC externalisé piloté par l\'IA, couverture mondiale :"',
        '"Notre Cerveau IA guide nos opérateurs certifiés étape par étape, garantissant une exécution exhaustive, standardisée et sans faille :"'
    ),
    (
        '"Monitoring 24/7 de tous vos serveurs, réseaux, firewalls et applications critiques"',
        '"Scans de vulnérabilités et audits Active Directory automatisés"'
    ),
    (
        '"Détection automatique et alertes instantanées"',
        '"Évaluations de sécurité physique et logique guidées par l\'IA"'
    ),
    (
        '"Confinement et réponse immédiats aux attaques"',
        '"Transcription en temps réel et génération automatique de rapports"'
    ),
    (
        '"Reporting en français avec synthèse et recommandations"',
        '"Exécution zéro trace : tous les outils tournent dans des environnements isolés"'
    ),
    (
        '"Option d\'hébergement souverain (cloud local ou data center sécurisé)"',
        '"Plan de remédiation à 90 jours généré instantanément"'
    ),
    (
        '"90% des attaques stoppées automatiquement"',
        '"Qualité d\'audit de niveau Senior à un prix ultra-compétitif"'
    ),
    (
        '"Temps de détection réduit de plusieurs jours à < 2 minutes"',
        '"Évaluation de sécurité standardisée et sans biais"'
    ),
    (
        '"Risque réglementaire réduit (finance, données, cybersécurité)"',
        '"Livraison immédiate de rapports actionnables"'
    ),
    (
        '"Supervision continue par nos analystes, 24/7"',
        '"Confidentialité absolue des données"'
    ),
    (
        '"À partir de 7 000 USD/mois (budget moyen 1016 000 USD/mois)"',
        '"À partir de 3 000 € pour un audit complet de PME"'
    ),
    (
        '"Audit cybersécurité & mise en conformité"',
        '"Migrations Cloud & Infrastructure Éphémère"'
    ),
    (
        '"Administrations, Banques, Secteur de la Santé, Énergie  Toute organisation devant démontrer la sécurité de son SI (ISO 27001, PCI-DSS, RGPD, exigences réglementaires)"',
        '"Entreprises cherchant à moderniser leur IT ou nécessitant des environnements ultra-sécurisés"'
    ),
    (
        '"Les audits internes manquent souvent de profondeur technique et de preuves concrètes (réseaux, systèmes, applications, données sensibles). La résilience du SI face aux attaques n\'est pas démontrée et la conformité avec les référentiels majeurs (ISO 27001, PCI-DSS, RGPD) n\'a pas été validée."',
        '"Les migrations Cloud sont complexes. De plus, le conseil traditionnel laisse souvent des traces (données, accès), créant des risques de sécurité à long terme."'
    ),
    (
        '"Ce que nous faisons concrètement :"',
        '"Nous utilisons l\'Infrastructure as Code (Terraform) pour construire, migrer et détruire des environnements avec une précision militaire :"'
    ),
    (
        '"Audit de cybersécurité complet du SI (technique + organisationnel), avec tests d\'intrusion et revue des contrôles"',
        '"1 Client = 1 Machine Virtuelle Dédiée et Éphémère"'
    ),
    (
        '"Cartographie des données sensibles, des accès et des vulnérabilités, alignée sur ISO 27001, PCIDSS et RGPD"',
        '"Déploiement automatisé d\'architectures Cloud (AWS, Azure, GCP)"'
    ),
    (
        '"Plan d\'actions 90 jours pour corriger les risques critiques avec les équipes locales"',
        '"Migration sécurisée des données avec empreinte résiduelle nulle"'
    ),
    (
        '"Sensibilisation sécurité (phishing, bonnes pratiques) et accompagnement à la remédiation"',
        '"Conformité RGPD/ISO garantie par le Droit à l\'oubli by design"'
    ),
    (
        '"Vision claire des risques cyber prioritaires et de l\'exposition réelle aux attaques"',
        '"Transitions Cloud fluides et automatisées"'
    ),
    (
        '"Trajectoire de mise en conformité (ISO 27001 / PCIDSS / RGPD) compréhensible par la DSI et la direction"',
        '"Zéro risque de contamination de données inter-clients"'
    ),
    (
        '"Crédibilité renforcée visàvis des instances de gouvernance et des clients"',
        '"Une infrastructure sécurisée dès la conception (Secure by Design)"'
    ),
    (
        '"À partir de 7 00010 000 USD, jusqu\'à 25 000 USD pour une administration multi-sites"',
        '"À partir de 5 000 € selon la complexité de l\'infrastructure"'
    ),
    (
        '"Modernisation Cloud & Optimisation des Coûts (FinOps)"',
        '"Conformité Continue & FinOps Automatisé"'
    ),
    (
        '"Groupes Privés, OIV, Établissements Publics  Organisations souhaitant moderniser leur infrastructure ou optimiser leurs coûts IT"',
        '"Entreprises en croissance devant maintenir leur conformité (ISO 27001, SOC 2, RGPD) tout en maîtrisant leurs coûts Cloud"'
    ),
    (
        '"Infrastructure coûteuse et obsolète (on-prem, matériel vieillissant, cloud fragmenté), migrations complexes freinées par la dette technique, les dépendances métier critiques et les coûts cachés (licences, maintenance, cloud mal optimisé)."',
        '"Maintenir la conformité et gérer les coûts Cloud demande un effort manuel constant, entraînant des dérives, des échecs d\'audit et des dépassements de budget."'
    ),
    (
        '"État des lieux rapide et modernisation :"',
        '"Notre plateforme surveille en continu votre posture et vos coûts, générant automatiquement les preuves nécessaires :"'
    ),
    (
        '"Diagnostic express de l\'infrastructure (on-premise et cloud)"',
        '"Collecte automatisée de preuves pour ISO 27001 et SOC 2"'
    ),
    (
        '"Migration progressive (cloud souverain ou hybride) avec sécurisation"',
        '"Tableaux de bord d\'optimisation des coûts Cloud (FinOps) en temps réel"'
    ),
    (
        '"Tableaux de bord des coûts avec identification immédiate des gaspillages"',
        '"Scripts de remédiation générés par l\'IA en cas de dérive"'
    ),
    (
        '"Visibilité claire des coûts et des gaspillages"',
        '"Toujours prêt pour les audits de conformité"'
    ),
    (
        '"Coûts opérationnels réduits de 30 à 40%"',
        '"Coûts Cloud réduits jusqu\'à 40%"'
    ),
    (
        '"Infrastructure modernisée et sécurisée pour la transformation numérique"',
        '"Ressources IT internes libérées"'
    ),
    (
        '"À partir de 10 00020 000 USD selon complexité"',
        '"À partir de 2 000 €/mois pour une gouvernance continue"'
    ),
    (
        '"Sécurité de niveau entreprise pour toutes les organisations"',
        '"La Cybertech qui révolutionne le Conseil IT"'
    ),
    (
        '"Skynet Consulting combine surveillance SOC 24/7, détection des menaces par IA et réponse aux incidents pour protéger votre organisation contre les cybermenaces évolutives."',
        '"Skynet Consulting remplace le modèle de conseil traditionnel, lent et coûteux, par une plateforme d\'exécution IA, offrant une sécurité, une rapidité et une rentabilité inégalées."'
    ),
    (
        '"Centre d\'Opérations de Sécurité 24/7"',
        '"Le Cerveau IA Skynet"'
    ),
    (
        '"Notre équipe SOC d\'experts surveille votre infrastructure 24h/24, détectant et analysant les activités suspectes en temps réel."',
        '"Notre IA propriétaire contient des décennies d\'expertise cyber Senior, guidant nos opérateurs sur le terrain sans faille à chaque mission."'
    ),
    (
        '"Détection des menaces par IA"',
        '"Infrastructure Éphémère"'
    ),
    (
        '"Des algorithmes d\'apprentissage automatique avancés détectent les anomalies et menaces que les outils de sécurité traditionnels ne repèrent pas."',
        '"Nous déployons un environnement dédié pour votre mission et le détruisons à la fin. Zéro trace, sécurité absolue."'
    ),
    (
        '"Réponse rapide aux incidents"',
        '"Un ROI Imbattable"'
    ),
    (
        '"Lorsqu\'une menace est identifiée, notre équipe intervient en quelques minutes pour contenir et neutraliser l\'incident."',
        '"En automatisant l\'expertise et en standardisant l\'exécution, nous offrons la qualité des Big 4 à une fraction du prix."'
    ),
    (
        '"Un MSSP (Managed Security Service Provider) assure la détection, la surveillance et la réponse aux menaces. Skynet fournit un SOC 24/7, la réponse aux incidents, des audits et un accompagnement à la conformité, sans que vous ayez à tout construire en interne."',
        '"Nos opérateurs utilisent une interface sécurisée pour communiquer avec notre Cerveau IA. L\'IA fournit des playbooks étape par étape, génère des scripts sur mesure et compile le rapport final, garantissant une qualité Senior."'
    ),
    (
        '"De la détection à l\'action en quelques minutes. Temps médian < 15 minutes, confinement immédiat par nos ingénieurs SOC (24/7) sur les incidents critiques."',
        '"Pour chaque mission client, nous provisionnons automatiquement une Machine Virtuelle dédiée. Tous les outils et analyses y sont exécutés. À la fin de la mission, la VM est détruite, garantissant une isolation totale des données."'
    ),
    (
        '"PME/ETI et grandes organisations souhaitant un haut niveau de sécurité sans construire un SOC interne. Adapté aux secteurs régulés (finance, santé, énergie, administration) avec preuves de conformité."',
        '"Les PME, ETI et entreprises agiles qui ont besoin d\'audits de cybersécurité, de migrations Cloud ou d\'accompagnement à la conformité de haut niveau, mais qui trouvent les cabinets traditionnels trop chers ou inadaptés."'
    )
]

# Also handle multiline strings by replacing newlines with \n in the search string
for old, new in replacements:
    # Try exact match
    if old in content:
        content = content.replace(old, new)
    else:
        # Try matching without quotes, and handle newlines
        old_no_quotes = old[1:-1]
        new_no_quotes = new[1:-1]
        
        # Sometimes the string in the file is split across lines
        # Let's just do a simple replace for now, if it fails we'll see
        if old_no_quotes in content:
            content = content.replace(old_no_quotes, new_no_quotes)
        else:
            # Try replacing \n with actual newlines
            old_multiline = old_no_quotes.replace('\\n', '\n')
            if old_multiline in content:
                content = content.replace(old_multiline, new_no_quotes)
            else:
                print(f"Could not find: {old[:50]}...")

with open('src/lib/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done replacing strings.")
