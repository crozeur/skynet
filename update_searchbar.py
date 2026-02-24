import os

with open('src/components/SearchBar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'security audit soc monitoring cybersecurity surveillance sécurité audit',
    'security audit ai execution cybersecurity surveillance sécurité audit'
)
content = content.replace(
    'services soc audit cloud compliance conformité',
    'services ai audit cloud compliance conformité'
)

with open('src/components/SearchBar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating SearchBar.tsx.")
