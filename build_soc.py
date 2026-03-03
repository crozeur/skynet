# -*- coding: utf-8 -*-
import re

with open('content/docs/Document_SOC_Final.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Insert image
text = re.sub(
    r'(Flux cible : \*\*Wazuh .*? email client \+ suivi\*\*\.)',
    r'\1\n\n<div class=\"gray-box\">\n<img src=\"rea_cropped.png\" style=\"width: 130%; max-width: 130%; margin: 40px 0 40px -35%;\">\n</div>\n',
    text, flags=re.DOTALL
)

# Apply tree structures
text = re.sub(
    r'(### Wazuh\n.*?)(?=\n###|\n##|\Z)',
    r'<div class=\"tree-structure\">\n\1</div>\n',
    text, flags=re.DOTALL
)
text = re.sub(
    r'(### OpenSearch\n.*?)(?=\n###|\n##|\Z)',
    r'<div class=\"tree-structure\">\n\1</div>\n',
    text, flags=re.DOTALL
)
text = re.sub(
    r'(### TheHive \(v5\) \+ PostgreSQL\n.*?)(?=\n###|\n##|\Z)',
    r'<div class=\"tree-structure\">\n\1</div>\n',
    text, flags=re.DOTALL
)
text = re.sub(
    r'(## 3\) Organisation et s.paration stricte\n\nS.paration.*?)(?=\n##|\Z)',
    r'<div class=\"tree-structure\">\n\1</div>\n',
    text, flags=re.DOTALL
)

# CSS insertion
css = '''<style>
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #333; }
  h1, h2, h3 { color: #1e3a8a; }
  .gray-box {
      background-color: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-radius: 0 0.5rem 0.5rem 0;
  }
  .tree-structure {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 1.5rem;
      margin: 1rem 0;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .tree-structure h3 { margin-top: 0; }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
  th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) { background-color: #f8fafc; }
</style>
'''

with open('content/docs/skynet-soc-final-formatted.md', 'w', encoding='utf-8') as f:
    f.write(css + '\n' + text)

print('Formatting done')