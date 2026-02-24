import os

with open('src/components/Compliance.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'SOC 24/7 avec preuves traçables',
    'Exécution IA avec preuves traçables'
)
content = content.replace(
    '24/7 SOC with traceable evidence',
    'AI Execution with traceable evidence'
)

with open('src/components/Compliance.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating Compliance.")
