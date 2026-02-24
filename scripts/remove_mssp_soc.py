import re
import glob

replacements = [
    # English
    (
        '"Service level agreement for SOC platform availability"',
        '"Service level agreement for platform availability"'
    ),
    (
        '"Our 24/7 SOC team monitors your environment in real-time, detecting and investigating potential threats."',
        '"Our 24/7 team monitors your environment in real-time, detecting and investigating potential threats."'
    ),
    (
        '"Our MSSP Services"',
        '"Our Advanced Services"'
    ),
    (
        '"What is an MSSP?"',
        '"How does your platform work?"'
    ),
    (
        '"Skynet Consulting is an IT services and consulting company delivering enterprise-grade cybersecurity solutions globally."',
        '"Skynet Consulting is a Cybertech company delivering enterprise-grade cybersecurity solutions globally."'
    ),

    # French
    (
        '"Niveau de service garanti pour la disponibilité de notre plateforme SOC"',
        '"Niveau de service garanti pour la disponibilité de notre plateforme"'
    ),
    (
        '"Surveillance & réponse 24/7 – SOC externalisé"',
        '"Surveillance & réponse 24/7"'
    ),
    (
        '"Notre équipe SOC 24/7 surveille votre environnement en temps réel, détectant et analysant les menaces potentielles."',
        '"Notre équipe 24/7 surveille votre environnement en temps réel, détectant et analysant les menaces potentielles."'
    ),
    (
        '"Nos Services MSSP"',
        '"Nos Services Avancés"'
    ),
    (
        '"Qu\'est-ce qu\'un MSSP ?"',
        '"Comment fonctionne votre plateforme ?"'
    ),
    (
        '"Skynet Consulting est une société de conseil en cybersécurité proposant des solutions de niveau entreprise à l\'échelle internationale."',
        '"Skynet Consulting est une entreprise Cybertech proposant des solutions de cybersécurité de niveau entreprise à l\'échelle internationale."'
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
