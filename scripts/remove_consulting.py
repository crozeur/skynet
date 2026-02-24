import re
import glob

replacements = [
    # English
    (
        '"Skynet Consulting is an IT services and consulting company delivering enterprise-grade cybersecurity solutions globally. Founded by two brothers, the firm acts as a trusted technology partner for organizations of all sizes, from startups to large enterprises."',
        '"Skynet Consulting is a Cybertech company delivering enterprise-grade cybersecurity solutions globally. Founded by two brothers, the firm acts as a trusted technology partner for organizations of all sizes, from startups to large enterprises."'
    ),

    # French
    (
        '"Skynet Consulting est une société de conseil en cybersécurité proposant des solutions de niveau entreprise à l\'échelle internationale. Fondée par deux frères, la société est le partenaire de confiance des organisations de toutes tailles, des startups aux grands groupes."',
        '"Skynet Consulting est une entreprise Cybertech proposant des solutions de cybersécurité de niveau entreprise à l\'échelle internationale. Fondée par deux frères, la société est le partenaire de confiance des organisations de toutes tailles, des startups aux grands groupes."'
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
