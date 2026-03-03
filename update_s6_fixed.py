# -*- coding: utf-8 -*-
import re

with open('content/docs/skynet-strategie-soc-formatted.md', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = r'''## 6. MÉTHODOLOGIE D'INTÉGRATION : LE PILOTE (3 SEMAINES)

### Prouver la valeur avant de s'engager
Plutôt que de vendre une promesse théorique à l'aveugle, Skynet Consulting déploie son SOC directement sur votre environnement pendant 21 jours. L'objectif est clair : démontrer mathématiquement notre capacité à détecter des incidents réels en moins de 2 heures, sans aucune perturbation pour vos services.

<div class="gray-box">
<strong>L'Onboarding Sans Friction (Zéro Lenteur) :</strong>
<ul>
<li>Au démarrage, nous fournissons un "Quickstart" technique de <strong>5 pages maximum</strong>.</li>
<li><strong>Le but :</strong> Éviter les manuels lourds de 50 pages, réduire toute friction au démarrage, et tuer les erreurs techniques avant même qu'elles n'apparaissent.</li>
</ul>
</div>

### Le Déroulé Structuré du Pilote

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Jour 1 : L'Amorçage et l'Installation</div>
        <ul class="tree-items">
            <li>Déploiement simple des agents Wazuh sur le parc informatique ciblé.</li>
            <li><strong>Obligation de résultat :</strong> Le SOC doit être opérationnel en moins de 24h avec rigoureusement <strong>0 downtime (aucune coupure)</strong> sur les services du client.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 2 à 3 : La Phase d'Apprentissage (Calibrage IA)</div>
        <ul class="tree-items">
            <li>L'intelligence artificielle analyse le trafic pour mémoriser ce qui est un comportement "normal" dans l'entreprise (Baseline).</li>
            <li>Ajustement sur-mesure des règles de détection pour éliminer d'emblée tout bruit de fond.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 4 à 19 : Le Bouclier Actif (Surveillance 24/7)</div>
        <ul class="tree-items">
            <li>Le SOC passe en statut défensif global. Les environnements sont monitorés nuit et jour.</li>
            <li>Envoi du Daily Flash quotidien et organisation d'appels hebdomadaires courts pour montrer la capture en temps réel.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jour 20 : Le Bilan Décisionnel Continu</div>
        <ul class="tree-items">
            <li>Arrêt de la phase d'essai et restitution formelle des faits découverts. C'est l'étape de transition vers le contrat de maintenance complet.</li>
        </ul>
    </div>
</div>

<div class="gray-box">
<strong>La Logique Stratégique du Bilan au J20 :</strong><br>
La réunion du Jour 20 (Clôture) est purement factuelle et s'appuie sur la démonstration de la valeur :
<ul>
    <li><strong>Validation de menaces :</strong> <i>"Nous avons détecté <strong>X incidents réels</strong> sur votre réseau. Pour chacun d'entre eux, notre équipe a réagi en moins de 2 heures."</i></li>
    <li><strong>Gain de temps DSI :</strong> <i>"Notre système a bloqué et qualifié <strong>Y fausses alertes massives</strong>. Nous ne vous avons jamais dérangé pour rien."</i></li>
    <li><strong>Fiabilité technique :</strong> <i>"Le déploiement était complètement transparent."</i></li>
    <li><strong>Continuité :</strong> Signature du contrat final pour pérenniser ce cocon sécuritaire sous facturation lissée.</li>
</ul>
</div>\n\n'''

# More robust regex that just replaces everything between Section 6 and Section 7 headings
new_text = re.sub(
    r'(## 6\..*?)(?=\s*## 7\.)',
    replacement,
    text,
    flags=re.DOTALL
)

if text != new_text:
    with open('content/docs/skynet-strategie-soc-formatted.md', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("SUCCESS: Text was matched and replaced.")
else:
    print("ERROR: Regex did not match anything. Text untouched.")
