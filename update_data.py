import os

with open('src/components/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '24/7 SOC Monitoring',
    'AI-Augmented Execution'
)

with open('src/components/data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating data.js.")
