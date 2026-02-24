import re
import glob

replacements = [
    # English
    (
        '"AI-Augmented Cybersecurity Solutions"',
        '"Advanced Cybersecurity Solutions"'
    ),
    (
        '"AI-augmented security audits"',
        '"advanced security audits"'
    ),
    (
        '"AI-Augmented Execution"',
        '"Standardized Execution"'
    ),
    (
        '"AI-Augmented Security Audits"',
        '"Advanced Security Audits"'
    ),
    (
        '"AI-generated remediation scripts"',
        '"Automated remediation scripts"'
    ),
    (
        '"AI Brain"',
        '"Execution Engine"'
    ),
    (
        '"AI playbooks"',
        '"codified playbooks"'
    ),
    (
        '"AI-powered execution platform"',
        '"advanced execution platform"'
    ),
    (
        '"AI-driven execution platform"',
        '"proprietary execution platform"'
    ),
    (
        '"AI-augmented audits"',
        '"advanced audits"'
    ),

    # French
    (
        '"Exécution Augmentée par l\'IA"',
        '"Méthodologie d\'Exécution Standardisée"'
    ),
    (
        '"Cerveau IA"',
        '"Moteur d\'Exécution"'
    ),
    (
        '"guidées par l\'IA"',
        '"guidées par des playbooks codifiés"'
    ),
    (
        '"générés par l\'IA"',
        '"générés automatiquement"'
    ),
    (
        '"plateforme d\'exécution IA"',
        '"plateforme d\'exécution avancée"'
    ),
    (
        '"Notre IA propriétaire"',
        '"Notre plateforme propriétaire"'
    ),
    (
        '"d\'audits augmentés par l\'IA"',
        '"d\'audits avancés"'
    ),
    (
        '"Propulsée par l\'IA"',
        '"Propulsée par l\'Automatisation Avancée"'
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
