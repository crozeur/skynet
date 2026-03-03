# -*- coding: utf-8 -*-
import re

with open('content/docs/skynet-strategie-soc-formatted.md', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Pricing
text = re.sub(
    r'### La Tarification au Volume \(Pay-as-you-grow\).*?Grandes ETI, Finance \|',
    r'''### La Tarification au Volume (Forfait Annuel Lissé)

Le modèle de pricing s'affranchit du comptage par agents. Il est basé sur un forfait annuel pur de volume de logs, lissé sur 12 mensualités pour préserver la trésorerie du client.

<div class="gray-box">
<strong>Principe de Tarification :</strong><br>
<span style="font-size: 1.4rem; font-weight: bold; color: #1e3a8a;">500 $ / Go de logs par an</span>
</div>

**Exemple Pratique :**
1. Consommation évaluée : **3 Go / mois**.
2. Fixation annuelle : 36 Go / an (36 × 500$ = **18 000$**).
3. Facturation Mensuelle MRR : 18 000$ / 12 = **1 500 $ / mois**.

**Transparence & Gestion des Dépassements (Sécurité Confiance) :**
- **Seuil 85% :** Alerte proactive et appel cyber technique gratuit avec le DSI pour analyser la cause racine.
- **Seuil 100% :** Le client garde le contrôle complet de la décision :
  1. Achat d'extensions de Go supplémentaires (au même prix unitaire de 500$).
  2. Optimisation immédiate des logs (réduction saine de verbosité).
  3. Upgrade natif du contrat.
*Règle SOC Skynet : Aucune surfacturation cachée.*''',
    text, flags=re.DOTALL
)

# 2. Pilote Commando
text = re.sub(
    r'### Le Pilote Commando \(14 Jours\).*?<li>Signature du contrat MRR pour étendre le déploiement à tout le parc.</li>\s*</ul>\s*</div>\s*</div>',
    r'''### Le Pilote d'Acquisition Commando (3 Semaines / 21 Jours)

L'objectif est de prouver une valeur irréfutable en laissant le temps vital à l'IA de se calibrer avec précision sans générer de faux positifs.

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Jour 1 : Déploiement Commando</div>
        <ul class="tree-items">
            <li>Fourniture du script Wazuh (GPO/Ansible).</li>
            <li>Cible : Opérationnel en moins de 24h avec algorithme <strong>0 downtime</strong> sur le SI cible.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 2 - 5 : Calibration & Silence</div>
        <ul class="tree-items">
            <li>Analyse et configuration des exclusions. OpenClaw assimile le bruit de fond (baseline normal).</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 6 - 19 : Surveillance Active 24/7</div>
        <ul class="tree-items">
            <li>Déclenchement du Daily Flash et appels hebdomadaires de restitution de valeur pré-structurés.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jour 20 : L'Appel de Conversion "J20" (Closing)</div>
        <ul class="tree-items">
            <li>Script mathématique : <i>"Nous avons détecté X incidents réels en moins de 2h, et éliminé Y faux positifs massivement absurdes."</i></li>
            <li>Passage formel et technique à l'abonnement MRR lissé.</li>
        </ul>
    </div>
</div>''',
    text, flags=re.DOTALL
)


# 3. Outils Comms (Make/Perplexity)
text = text.replace(
    r'<li>Il clôture automatiquement les faux positifs (80% des alertes).</li>\n</ul>\n</div>',
    r'''<li>Il clôture automatiquement les faux positifs (80% des alertes).</li>
</ul>
</div>

<div class="gray-box">
<strong>Étape 5 : Communication Automatisée (Make + API Perplexity)</strong><br>
La boucle client est entièrement couverte :
<ul>
<li>Lorsqu'un analyste clôture un ticket complexe de remédiation, <strong>Make</strong> intercepte l'événement de TheHive.</li>
<li>Il déclenche l'API <strong>Perplexity</strong> qui rédige instantanément un résumé exécutif complet du problème et de la solution.</li>
<li>Un "Daily Flash" est envoyé au DSI automatiquement, <strong>sans que l'analyste réseau de niveau supérieur (Nabil) n'ait à taper un seul mot de commercial ou de reporting.</strong></li>
</ul>
</div>'''
)

# 4. Séparation Rôles
text = text.replace(
    r'## 5. ORGANISATION & ÉQUIPES\n\n### L\'Équipe Skynet \(Le Modèle Hybride\)',
    r'''## 5. ORGANISATION & ÉQUIPES

### La Règle d'Exécution Absolue (Séparation "Militaire")

<div class="gray-box">
<strong>Le Dogme des 100% :</strong>
<ul>
<li><strong>Ya Ha (100% Ventes & Croissance) :</strong> Mène rigoureusement l'Appel de Disqualification exclusif de 5 minutes avec le lead, gère le sortant et clôture physiquement les Ventes J20.</li>
<li><strong>Nabil (100% Tech / SOC / Escalade) :</strong> Détient l'infrastructure SOC complète, conçoit les Playbooks d'arrêt des menaces, et gère le SLA. <i>Nabil ne doit strictement jamais procéder en front line de qualification commerciale.</i></li>
</ul>
</div>

### L'Équipe d'Opération (Modèle de Continuité)'''
)

# 5. Playbooks production ready
text = text.replace(
    r'<li>Création des playbooks de réponse à incident (Ransomware, Phishing, Malware).</li>',
    r'<li><strong>Dogme de Production (Playbooks) :</strong> L\'infrastructure SOC entière n\'est actée "production-ready" en clientèle qu\'<strong>après</strong> la validation formelle des 4 Playbooks internes obligatoires : Phishing, Ransomware, Force Brute et Exfiltration.</li>'
)

# 6. SLA Escalades
text = text.replace(
    r'### Les Engagements Skynet \(SLA\)',
    r'''### Doctrine d'Escalade Interne ("Tolérance Zéro")

<div class="gray-box">
<strong>Canaux de Communication Limités :</strong>
<ul>
<li><strong>Slack :</strong> Usage de routine, suivi opérationnel bas niveau.</li>
<li><strong>SMS Direct :</strong> UNIQUEMENT déclenché pour alerter de situations Critiques (Exfiltration/Root Compromise).</li>
</ul>
<p style="margin-top: 10px; font-size: 1.1rem;">⚠️ <strong>Dogme Punitif d'Exécution :</strong> Un (1) seul incident réel manqué ou ignoré équivaut systématiquement à la perte factuelle du client. Tolérance Zéro sur l'étanchéité des alertes.</p>
</div>

### Les Engagements Client (SLA)'''
)

with open('content/docs/skynet-strategie-soc-formatted.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('V5 Corrected and updated!')