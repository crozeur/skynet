import os

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'Cybersecurity Solutions & Managed SOC',
    'AI-Augmented Cybersecurity Solutions'
)
content = content.replace(
    'Expert cybersecurity services: Managed SOC operations, security audits, and cloud security.',
    'Expert cybersecurity services: AI-augmented security audits, cloud migrations, and automated compliance.'
)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating layout.tsx.")
