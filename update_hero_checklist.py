import os

# Update Hero.tsx
with open('src/components/Hero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '? "SOC = Security Operations Center"',
    '? "AI-Augmented Execution Platform"'
)
content = content.replace(
    ': "SOC = Centre des opérations de sécurité"}',
    ': "Plateforme d\'Exécution Augmentée par l\'IA"}'
)
content = content.replace(
    ': "Propulsé par notre centre des opérations de sécurité (SOC)"}',
    ': "Propulsé par notre Cerveau IA propriétaire"}'
)
content = content.replace(
    '["24/7 SOC", "Evidence-ready reports", "Deployment < 10 days"]',
    '["Zero-Trace VMs", "Evidence-ready reports", "Deployment < 10 days"]'
)

with open('src/components/Hero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update SecurityChecklist.tsx
with open('src/components/SecurityChecklist.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'Nos solutions de SOC externalisé 24/7 permettent de corriger ces points faibles.',
    'Notre plateforme d\'exécution IA permet de corriger ces points faibles rapidement et à moindre coût.'
)
content = content.replace(
    'Our 24/7 managed SOC solutions address these weaknesses.',
    'Our AI-augmented execution platform addresses these weaknesses quickly and cost-effectively.'
)

with open('src/components/SecurityChecklist.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating Hero and SecurityChecklist.")
