# -*- coding: utf-8 -*-
import re

with open('content/docs/skynet-strategie-soc-formatted.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's fix section 6 to perfectly match EXACTLY the Final DOC intention.
old_pilote = r'''## 6\. ONBOARDING & PILOTE

### Le Pilote d\'Acquisition Commando \(3 Semaines / 21 Jours\)

L\'objectif est de prouver une valeur irréfutable en laissant le temps vital à l\'IA de se calibrer avec précision sans générer de faux positifs\.

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Jour 1 : Déploiement Commando</div>
        <ul class="tree-items">
            <li>Fourniture du script Wazuh \(GPO/Ansible\)\.</li>
            <li>Cible : Opérationnel en moins de 24h avec algorithme <strong>0 downtime</strong> sur le SI cible\.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 2 - 5 : Calibration & Silence</div>
        <ul class="tree-items">
            <li>Analyse et configuration des exclusions\. OpenClaw assimile le bruit de fond \(baseline normal\)\.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 6 - 19 : Surveillance Active 24/7</div>
        <ul class="tree-items">
            <li>Déclenchement du Daily Flash et appels hebdomadaires de restitution de valeur pré-structurés\.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jour 20 : L\'Appel de Conversion "J20" \(Closing\)</div>
        <ul class="tree-items">
            <li>Script mathématique : <i>"Nous avons détecté X incidents réels en moins de 2h, et éliminé Y faux positifs massivement absurdes\."</i></li>
            <li>Passage formel et technique à l\'abonnement MRR lissé\.</li>
        </ul>
    </div>
</div>'''

new_pilote = r'''## 6. LE MODÈLE D'ACQUISITION : PILOTE (3 SEMAINES) → CONVERSION (J20)

### Le Cadre "Commando"
L'objectif est clair et mécanique : **prouver la valeur rapidement**, créer la confiance technique, puis **convertir**. Nous ne bloquons pas les leads avec de la documentation lourde. 

<div class="gray-box">
<strong>Documentation Client :</strong>
<ul>
<li>Fourniture d'un "Quickstart" Client de <strong>5 pages maximum</strong>.</li>
<li>But : Réduire la friction au maximum, tuer les tickets de support avant le départ, et accélérer la décision du DSI.</li>
</ul>
</div>

### Le Déroulé Opérationnel Strict

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Jour 1 : L'Amorçage</div>
        <ul class="tree-items">
            <li>Déploiement des agents Wazuh sur le SI cible.</li>
            <li>Cible absolue : <strong>Opérationnel en 24h avec 0 downtime</strong> du côté client.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 2 à 3 : Optimisation Initiale</div>
        <ul class="tree-items">
            <li>Optimisation des règles de détection et vérifications quotidiennes.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 4 à 20 : Surveillance & Démonstration</div>
        <ul class="tree-items">
            <li>Couverture 24/7 enclenchée.</li>
            <li>Appels clients hebdomadaires pour montrer l'évolution de la capture.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jour 20 : L'Appel de Conversion (Closing)</div>
        <ul class="tree-items">
            <li>Organisation stricte de l'appel pour résumer le Pilote et embrayer sur la proposition du Contrat (MRR Lissé).</li>
        </ul>
    </div>
</div>

<div class="gray-box">
<strong>La Logique de Conversion (Le Script Mathématique du J20) :</strong><br>
L'appel s'articule autour des faits chiffrés :
<ul>
    <li><i>"Nous avons détecté <strong>X incidents réels</strong> validés en moins de 2h."</i></li>
    <li><i>"La machine a éliminé <strong>Y faux positifs</strong> sans vous déranger (Preuve de la qualité du triage)."</i></li>
    <li><i>"Le déploiement était parfaitement 'smooth' (0 downtime rencontré)."</i></li>
    <li><i>Prochaine Étape : Signature du contrat pour maintenir ce niveau de sécurité.</i></li>
</ul>
</div>'''

text = re.sub(old_pilote, new_pilote, text, flags=re.DOTALL)

with open('content/docs/skynet-strategie-soc-formatted.md', 'w', encoding='utf-8') as f:
    f.write(text)

print("Section 6 Updated.")