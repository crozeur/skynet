# -*- coding: utf-8 -*-
import re

with open('content/docs/skynet-soc-final-formatted.md', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace Shodan
text = text.replace("Shodan + OpenClaw", "OpenClaw (Reconnaissance autonome)")
text = text.replace("Shodan", "OpenClaw")

# 2. Re-format the appended text to match the beautiful V5 style

# We will wrap lists in gray boxes or tree structures where appropriate.

def wrap_lists_in_gray_box(match):
    header = match.group(1)
    list_items = match.group(2)
    return f"{header}\n\n<div class=\"gray-box\">\n<ul>\n" + \
           re.sub(r'- (.*)', r'<li>\1</li>', list_items) + \
           "\n</ul>\n</div>\n"

# Replace bullet lists preceded by an H3 into gray boxes (useful for problem statements, etc)
# Let's find patterns like: ### 2) Problème marché\n\nLes PME...\n- Item\n- Item
def wrap_sections(text):
    # This might be tricky with regex, let's target specific sections we know.
    
    # Positionnement
    text = re.sub(
        r'(Les PME/ETI n’arrivent pas à maintenir :)\n((?:- .*\n?)+)',
        r'<div class="gray-box">\n<strong>\1</strong>\n<ul>\n' + r'\2' + r'</ul>\n</div>\n',
        text
    )
    
    # Positionnement Skynet
    text = re.sub(
        r'(### 3\) Positionnement Skynet\n\n)((?:- .*\n?)+)',
        r'\1<div class="tree-structure">\n<ul>\n\2</ul>\n</div>\n',
        text
    )
    
    # Composants - Wazuh
    text = re.sub(
        r'(### Wazuh\n)((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<div class="tree-node"><div class="tree-title">Wazuh</div>\n<ul class="tree-items">\n\2</ul>\n</div>\n</div>\n',
        text
    )
    text = re.sub(r'</ul>\n</div>\n</div>\n\n- (.*)', r'<li>\1</li>\n</ul>\n</div>\n</div>\n', text) # Fix any leftover list item formatting

    # Composants - OpenSearch
    text = re.sub(
        r'(### OpenSearch\n)((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<div class="tree-node"><div class="tree-title">OpenSearch</div>\n<ul class="tree-items">\n\2</ul>\n</div>\n</div>\n',
        text
    )

    # Composants - TheHive
    text = re.sub(
        r'(### TheHive \(v5\) \+ PostgreSQL\n)((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<div class="tree-node"><div class="tree-title">TheHive (v5) + PostgreSQL</div>\n<ul class="tree-items">\n\2</ul>\n</div>\n</div>\n',
        text
    )

    # Durcissement
    text = re.sub(
        r'(### 3\) Durcissement \(obligatoire\)\n\n)((?:- .*\n?)+)',
        r'\1<div class="gray-box">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Playbooks
    text = re.sub(
        r'(Playbooks détaillés, testés en interne, puis appliqués en client :)\n((?:- .*\n?)+)',
        r'<div class="gray-box">\n<strong>\1</strong>\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Escalade
    text = re.sub(
        r'(### 2\) Règles d’escalade\n\n)((?:- .*\n?)+)',
        r'\1<div class="tree-structure">\n<ul class="tree-items">\n\2</ul>\n</div>\n',
        text
    )

    # Organisation
    text = re.sub(
        r'(Séparation “militaire” \(évite de casser la machine\) :)\n((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<strong>\1</strong>\n<ul class="tree-items">\n\2</ul>\n</div>\n',
        text
    )

    # Deroule operationnel
    text = re.sub(
        r'(### 2\) Déroulé opérationnel\n\n)((?:- .*\n?)+)',
        r'\1<div class="gray-box">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Logique conversion
    text = re.sub(
        r'(Structure de l’appel J20 :)\n((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<strong>\1</strong>\n<ul>\n\2</ul>\n</div>\n',
        text
    )
    
    # Doc client
    text = re.sub(
        r'(### 4\) Documentation client\n\n)((?:- .*\n?)+)',
        r'\1<div class="gray-box">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Calcul
    text = re.sub(
        r'(### 3\) Calcul \(annuel → 12 paiements\)\n\n)((?:\d+\. .*\n?)+)',
        r'\1<div class="tree-structure">\n<ol>\n\2</ol>\n</div>\n',
        text
    )
    
    text = re.sub(
        r'(### Exemple\n\n)((?:- .*\n?)+)',
        r'\1<div class="gray-box">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Depassements
    text = re.sub(
        r'(### 4\) Dépassements .*?\n\n)((?:- .*\n?(?:  - .*\n?)*)+)',
        r'\1<div class="tree-structure">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # KPI
    text = re.sub(
        r'(### 1\) KPI d’exécution\n\n)((?:- .*\n?)+)',
        r'\1<div class="gray-box">\n<ul>\n\2</ul>\n</div>\n',
        text
    )

    # Roadmap
    text = re.sub(
        r'(### 3\) Roadmap opérationnelle \(résumé\)\n\n)((?:- .*\n?)+)',
        r'\1<div class="tree-structure">\n<ul class="tree-items">\n\2</ul>\n</div>\n',
        text
    )

    # Annexes -> Turn to tree-structures
    text = re.sub(
        r'(Workflow cible :)\n((?:- .*\n?)+)',
        r'<div class="tree-structure">\n<strong>\1</strong>\n<ul class="tree-items">\n\2</ul>\n</div>\n',
        text
    )
    text = re.sub(
        r'(Modèle standard \(à compléter\) :)\n((?:- .*\n?)+)',
        r'<div class="gray-box">\n<strong>\1</strong>\n<ul>\n\2</ul>\n</div>\n',
        text
    )
    text = re.sub(
        r'(## ANNEXE C — Checklists\n\n)((?:- .*\n?)+)',
        r'\1<div class="tree-structure">\n<ul class="tree-items">\n\2</ul>\n</div>\n',
        text
    )

    # Finally, convert all raw - item inside our newly minted <ul> tags into <li>item</li>
    def li_replacer(match):
        list_block = match.group(1)
        # convert items
        list_block = re.sub(r'(?m)^- (.*)$', r'<li>\1</li>', list_block)
        # convert nested items
        list_block = re.sub(r'(?m)^  - (.*)$', r'<ul><li>\1</li></ul>', list_block)
        return '<ul>\n' + list_block + '</ul>'

    text = re.sub(r'<ul>\n((?:.*\n)+?)</ul>', li_replacer, text)
    
    # Clean up ol
    def ol_replacer(match):
        list_block = match.group(1)
        list_block = re.sub(r'(?m)^\d+\. (.*)$', r'<li>\1</li>', list_block)
        return '<ol>\n' + list_block + '</ol>'
    
    text = re.sub(r'<ol>\n((?:.*\n)+?)</ol>', ol_replacer, text)

    return text

text = wrap_sections(text)

# Also wrap the ANNEXE title so it feels like a V5 header
text = text.replace("# MANUEL OPÉRATIONNEL & STRATÉGIE (ANNEXES)", "\n---\n\n## ANNEXE : MANUEL OPÉRATIONNEL & STRATÉGIE")

with open('content/docs/skynet-soc-final-formatted.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('Formatting of appendices done and Shodan removed.')