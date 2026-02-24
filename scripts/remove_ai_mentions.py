import re
import glob

replacements = [
    # English
    (
        '"Enterprise-Grade Cybersecurity, Powered by AI & Automation"',
        '"Enterprise-Grade Cybersecurity, Powered by Advanced Automation"'
    ),
    (
        '"We democratize high-end security for SMEs and agile enterprises. Our AI-driven execution platform and ephemeral infrastructure deliver Senior-level audits and cloud migrations at a fraction of the traditional cost."',
        '"We democratize high-end security for SMEs and agile enterprises. Our proprietary execution platform and ephemeral infrastructure deliver Senior-level audits and cloud migrations at a fraction of the traditional cost."'
    ),
    (
        '"AI-Augmented Execution: Senior expertise delivered flawlessly on-site via our proprietary AI playbooks"',
        '"Standardized Execution: Senior expertise codified into strict processes to guarantee flawless, bias-free audits"'
    ),
    (
        '"AI-Augmented Security Audits & Pentesting"',
        '"Advanced Security Audits & Pentesting"'
    ),
    (
        '"Our AI Brain guides certified field operators step-by-step, ensuring exhaustive, standardized, and flawless execution:"',
        '"Our proprietary execution platform orchestrates every step of the audit, ensuring exhaustive, standardized, and flawless execution:"'
    ),
    (
        '"Physical and logical security assessments guided by AI playbooks"',
        '"Physical and logical security assessments guided by codified playbooks"'
    ),
    (
        '"AI-generated remediation scripts for compliance drift"',
        '"Automated generation of custom remediation scripts for compliance drift"'
    ),
    (
        '"Skynet Consulting replaces the outdated, expensive traditional consulting model with an AI-powered execution platform, delivering unmatched security, speed, and cost-efficiency."',
        '"Skynet Consulting replaces the outdated, expensive traditional consulting model with an advanced execution platform, delivering unmatched security, speed, and cost-efficiency."'
    ),
    (
        '"The Skynet AI Brain"',
        '"The Skynet Execution Engine"'
    ),
    (
        '"Our proprietary AI contains decades of senior cybersecurity expertise, guiding our field operators flawlessly through every mission."',
        '"Our proprietary platform contains decades of codified senior cybersecurity expertise, guiding our field operators flawlessly through every mission."'
    ),
    (
        '"Our field operators use a secure, locked-down interface to communicate with our AI Brain. The AI provides step-by-step playbooks, generates custom scripts on the fly, and compiles the final report, ensuring senior-level quality on every mission."',
        '"Our field operators use a secure, locked-down interface connected to our execution engine. It provides step-by-step playbooks, generates custom scripts on the fly, and compiles the final report, ensuring senior-level quality on every mission."'
    ),
    (
        '"AI-augmented security audits, cloud migrations, and automated compliance."',
        '"Advanced security audits, cloud migrations, and automated compliance."'
    ),
    (
        '"AI-augmented audits, cloud migrations, and compliance services."',
        '"advanced audits, cloud migrations, and compliance services."'
    ),

    # French
    (
        '"La Cybersécurité d\'Excellence, Propulsée par l\'IA"',
        '"La Cybersécurité d\'Excellence, Propulsée par l\'Automatisation Avancée"'
    ),
    (
        '"Nous démocratisons la sécurité de haut niveau pour les PME et ETI. Notre plateforme d\'exécution IA et notre infrastructure éphémère offrent des audits et migrations de niveau Senior à une fraction du coût traditionnel."',
        '"Nous démocratisons la sécurité de haut niveau pour les PME et ETI. Notre plateforme d\'exécution propriétaire et notre infrastructure éphémère offrent des audits et migrations de niveau Senior à une fraction du coût traditionnel."'
    ),
    (
        '"Exécution Augmentée par l\'IA : L\'expertise Senior déployée sans faille sur le terrain via nos playbooks propriétaires"',
        '"Méthodologie d\'Exécution Standardisée : L\'expertise Senior codifiée dans des processus stricts pour garantir un audit sans faille et sans biais"'
    ),
    (
        '"Notre Cerveau IA guide nos opérateurs certifiés étape par étape, garantissant une exécution exhaustive, standardisée et sans faille :"',
        '"Notre plateforme d\'exécution propriétaire orchestre chaque étape de l\'audit, garantissant une exécution exhaustive, standardisée et sans faille :"'
    ),
    (
        '"Évaluations de sécurité physique et logique guidées par l\'IA"',
        '"Évaluations de sécurité physique et logique guidées par des playbooks codifiés"'
    ),
    (
        '"Scripts de remédiation générés par l\'IA en cas de dérive"',
        '"Génération automatisée de scripts de remédiation sur-mesure en cas de dérive"'
    ),
    (
        '"Skynet Consulting remplace le modèle de conseil traditionnel, lent et coûteux, par une plateforme d\'exécution IA, offrant une sécurité, une rapidité et une rentabilité inégalées."',
        '"Skynet Consulting remplace le modèle de conseil traditionnel, lent et coûteux, par une plateforme d\'exécution avancée, offrant une sécurité, une rapidité et une rentabilité inégalées."'
    ),
    (
        '"Le Cerveau IA Skynet"',
        '"Le Moteur d\'Exécution Skynet"'
    ),
    (
        '"Notre IA propriétaire contient des décennies d\'expertise cyber Senior, guidant nos opérateurs sur le terrain sans faille à chaque mission."',
        '"Notre plateforme propriétaire contient des décennies d\'expertise cyber Senior codifiée, guidant nos opérateurs sur le terrain sans faille à chaque mission."'
    ),
    (
        '"Nos opérateurs utilisent une interface sécurisée pour communiquer avec notre Cerveau IA. L\'IA fournit des playbooks étape par étape, génère des scripts sur mesure et compile le rapport final, garantissant une qualité Senior."',
        '"Nos opérateurs utilisent une interface sécurisée connectée à notre moteur d\'exécution. Il fournit des playbooks étape par étape, génère des scripts sur mesure et compile le rapport final, garantissant une qualité Senior."'
    ),
    (
        '"d\'audits augmentés par l\'IA, de migrations cloud et de services de conformité."',
        '"d\'audits avancés, de migrations cloud et de services de conformité."'
    ),
    
    # CTAs
    (
        '"Book a call"',
        '"Request a Demo"'
    ),
    (
        '"Réserver un appel"',
        '"Demander une démo"'
    ),
    (
        '"Email us"',
        '"Start a Free Audit"'
    ),
    (
        '"Nous écrire"',
        '"Lancer un audit gratuit"'
    ),
    (
        '"Schedule a discovery call"',
        '"See the platform in action"'
    ),
    (
        '"Planifier un appel de découverte"',
        '"Voir la plateforme en action"'
    )
]

for filepath in glob.glob('src/lib/translations.ts', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for old, new in replacements:
        content = content.replace(old, new)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for filepath in glob.glob('src/components/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for old, new in replacements:
        content = content.replace(old, new)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

print("Done updating translations and components.")
