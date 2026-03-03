# -*- coding: utf-8 -*-
import re

# Read V5
with open('content/docs/skynet-strategie-soc-formatted.md', 'r', encoding='utf-8') as f:
    v5_text = f.read()

# Remove the footer for appending
v5_text = re.sub(r'<div class="footer">.*?</div>', '', v5_text, flags=re.DOTALL).strip()

# Read New text
with open('content/docs/Document_SOC_Final.md', 'r', encoding='utf-8') as f:
    new_text = f.read()

# Extract the content starting from PARTIE I (ignoring the meta headers and notes)
match = re.search(r'(# PARTIE I .*)', new_text, re.DOTALL)
if match:
    supp_text = match.group(1)
else:
    supp_text = new_text

# Let's format supp_text to match the styling
# H1 (# PARTIE) -> h2 so it fits the V5 hierarchy
supp_text = re.sub(r'^# PARTIE', '## PARTIE', supp_text, flags=re.MULTILINE)
# H2 (## 1)) -> h3
supp_text = re.sub(r'^## (\d+\))', r'### \1', supp_text, flags=re.MULTILINE)
# H1 (# ANNEXES) -> h2
supp_text = re.sub(r'^# ANNEXES', '## ANNEXES', supp_text, flags=re.MULTILINE)

# Add gray boxes around unordered lists
# A simple way to do this for the supplementary text:
# Find bullet list blocks and wrap them. (Be careful not to break Markdown, we can use a simpler approach or leave it raw and clean)
# It's safer to just wrap specific sections if needed, but standard markdown looks fine in the V5 stylesheet.
# Let's add some classes to the ### headers in the supplementary text.

final_text = v5_text + '\n\n\\pagebreak\n\n' + '# MANUEL OPÉRATIONNEL & STRATÉGIE (ANNEXES)\n\n' + supp_text + '\n\n'
final_text += '<div class="footer">\n    Document confidentiel - SKYNET CONSULTING © 2026\n</div>\n'

with open('content/docs/skynet-soc-final-formatted.md', 'w', encoding='utf-8') as f:
    f.write(final_text)

print('Merged successfully.')