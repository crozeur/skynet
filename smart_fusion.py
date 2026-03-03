# -*- coding: utf-8 -*-
import io

md_content = """---
title: "Stratégie Opérationnelle SOC & Machine de Livraison (MSSP)"
author: "SKYNET CONSULTING"
---

<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; }
  h1, h2, h3 { color: #0f172a; margin-top: 1.5rem; }
  h2 { font-size: 1.5rem; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
  .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0; }
  .header h1 { font-size: 2.5rem; color: #1e3a8a; margin-bottom: 0.5rem; }
  .header h2 { font-size: 1.25rem; color: #64748b; font-weight: normal; }
  .gray-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 1.5rem; margin: 1.5rem 0; border-radius: 0 0.5rem 0.5rem 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .tree-structure { background-color: #ffffff; border: 1px solid #cbd5e1; padding: 1.5rem; margin: 1.5rem 0; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .tree-node { margin-bottom: 1rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 1rem; }
  .tree-node:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
  .tree-title { font-weight: bold; color: #1e3a8a; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .tree-items { margin: 0; padding-left: 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
  th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th { background-color: #f1f5f9; font-weight: 600; color: #334155; }
  tr:nth-child(even) { background-color: #f8fafc; }
  .financial-summary { background-color: #1e3a8a; color: white; padding: 1.5rem; text-align: center; border-radius: 0.5rem; margin: 2rem 0; }
  .financial-summary .total { font-size: 1.5rem; font-weight: bold; margin: 0; }
  .financial-summary .subtext { font-size: 1rem; margin-top: 0.5rem; opacity: 0.9; }
  .footer { margin-top: 4rem; text-align: center; font-size: 0.85rem; color: #94a3b8; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
  .image-caption { text-align: center; font-style: italic; font-size: 0.9rem; color: #64748b; margin-top: 0.5rem; }
</style>

<div class="header">
    <h1>SKYNET CONSULTING</h1>
    <h2>Stratégie Opérationnelle SOC & Machine de Livraison (MSSP)</h2>
    <p><em>Février 2026 — Version Finale v1.0</em></p>
</div>

## 1. SYNTHÈSE EXÉCUTIVE & PROMESSE
Skynet Consulting délivre un SOC managé strictement orienté **résultat**, conçu pour détecter les incidents réels en moins de 2 heures (objectif MTTD) et garder une exécution simple pour le client.

<div class="gray-box">
<strong>La Valeur Opérationnelle :</strong>
<ul>
    <li>SLA de détection : <strong>&lt; 2 heures</strong> (différenciateur majeur).</li>
    <li>Couverture défensive : <strong>24/7/365</strong> avec équipe spécialisée (Ya Ha & Nabil).</li>
    <li>Automatisation à grande échelle : Réduction massive des coûts d'opération (Wazuh + Make + OpenClaw/Perplexity).</li>
    <li>Déploiement cadré fluide : <strong>Modèle Pilote (3 semaines) → Contrat</strong>.</li>
</ul>
</div>

### Le Problème du Marché (PME / ETI)
Les DSI/CISO de PME et ETI n’arrivent plus à maintenir l'exigence d'une sécurité moderne :
1. **Défaut de couverture :** Impossibilité de financer une détection humaine 24/7.
2. **Outils inopérants :** Des SIEM correctement opérés coûtent trop cher, génèrent du bruit, et exigent une maintenance lourde.
3. **Stagnation :** Aucune boucle d’amélioration post-incident (playbooks + métriques).

---
\\pagebreak

## 2. ARCHITECTURE TECHNIQUE & FLUX
La force de Skynet réside dans son architecture. Une chaîne de qualification où l'automatisation gère le triage, préservant l'analyste pour la remédiation.

<div class="gray-box">
    <strong>Flux Cible du SOC Skynet :</strong><br>
    Wazuh (Alerte) → <i>(Webhook)</i> → TheHive → <i>(Résolution Case)</i> → Make / OpenClaw → <strong>Email Client + Suivi</strong>
</div>

<div class="image-container" style="margin: 40px 0 40px -35%;">
    <img src="rea_cropped.png" alt="Architecture SOC Skynet" style="width: 130%; max-width: 130%;" />
    <div class="image-caption">Schéma Technique de l'Opérationnalité SOC</div>
</div>

### Les 3 Briques Centrales
<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">1. Wazuh (Collecte & Détection)</div>
        <ul class="tree-items">
            <li>Déploiement des agents et règles de détection.</li>
            <li>Ajustement continu des seuils pour équilibrer parfaitement bruit et précision.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">2. OpenSearch (Stockage & Visibilité)</div>
        <ul class="tree-items">
            <li>Stockage centralisé et visualisation des logs.</li>
            <li>Dashboards internes vitaux : volumétrie globale, santé des agents, calcul du MTTD, disponibilité.</li>
        </ul>
    </div>
    <div class="tree-node">
        <div class="tree-title">3. TheHive v5 + PostgreSQL (Investigation)</div>
        <ul class="tree-items">
            <li>Chaque alerte importante = un <strong>Case complet</strong> (triage → analyse → remédiation → rapport).</li>
            <li>Webhooks Wazuh → TheHive entièrement configurés et testés pour l'immédiateté.</li>
        </ul>
    </div>
</div>

<div class="gray-box">
<strong>Durcissement de l'Infrastructure (Obligatoire) :</strong>
<ul>
    <li>SSL/TLS, authentification API forte, chiffrement natif des données.</li>
    <li>Sauvegardes garanties + surveillance en temps réel de santé + alertes performance.</li>
    <li>Documentation technique strictement versionnée sous Git + procédures internes.</li>
</ul>
</div>

---
\\pagebreak

## 3. OPÉRATIONS : PLAYBOOKS, ESCALADE ET 24/7
Une croissance sécurisée nécessite de ne pas casser la machine lors de la montée en charge.

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Séparation "Militaire" stricte des Rôles</div>
        <ul class="tree-items">
            <li><strong>Ya Ha :</strong> Ventes, génération sortante, qualification rapide (5 min) et conversion.</li>
            <li><strong>Nabil :</strong> Infrastructure SOC, élaboration des playbooks, remédiation incidents réels et tenue du SLA.</li>
            <li><i>Couverture 24/7 : Modèle Follow-the-sun avec renforts extérieurs sous stricte supervision dès que la charge l'exige.</i></li>
        </ul>
    </div>
</div>

### Tolérance Zéro : Règles d'Escalade
- **Slack** : Alertes et notifications en temps réel pour l'opérationnel quotidien.
- **SMS** : Réservé <strong>UNIQUEMENT aux incidents CRITIQUES</strong>.

> ⚠️ Règle d'or interne Skynet : **Manquer un incident réel équivaut à la perte du client.** Tolérance zéro sur le traitement d'une alerte critique.

### Playbooks SOC (Minimum Viable en Prod)
Chaque crise a son process détaillé, testé d'abord en interne avant déclenchement côté client :
1. **Hameçonnage** (Phishing)
2. **Ransomware** (Chiffrement agressif)
3. **Force Brute** (Compromission d'accès)
4. **Exfiltration** (Fuite de données)

---
\\pagebreak

## 4. LE MODÈLE D'ACQUISITION : PILOTE → CONVERSION (J20)
L'objectif est de prouver une valeur massive avant toute négociation, en retirant toute la friction technologique et en accélérant la décision.

### Le Déroulé Opérationnel de l'Épreuve

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Jour 1 : L'Amorçage</div>
        Déploiement des agents Wazuh. <strong>Cible : Opérationnel en moins de 24h sans aucun downtime côté client.</strong>
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 2 à 3 : Optimisation</div>
        Calibrage des règles sur le SI client + vérifications quotidiennes du bon aiguillage des logs.
    </div>
    <div class="tree-node">
        <div class="tree-title">Jours 4 à 20 : Surveillance & Suivi</div>
        Mise sous cloche défensive 24/7 avec points d'étape formels (appels hebdomadaires).
    </div>
    <div class="tree-node">
        <div class="tree-title">Jour 20 : L'Appel de Conversion (Closing)</div>
        Résumé factuel du Pilote débouchant sur la proposition immédiate du Contrat.
    </div>
</div>

<div class="gray-box">
<strong>La Logique de Conversion du J20 (Script) :</strong><br>
L'appel s'articule autour des éléments irréfutables :
<ul>
    <li><i>"Nous avons détecté <strong>X incidents réels</strong> en moins de 2h."</i></li>
    <li><i>"La machine a éliminé <strong>Y faux positifs</strong> massifs sans vous déranger."</i></li>
    <li><i>"Le déploiement était parfaitement transparent (0 friction)."</i></li>
    <li>Transition naturelle vers le renouvellement sous abonnement lissé.</li>
</ul>
</div>

**Documentation Client :**
Un "Quickstart" fourni au client de **5 pages maximum** pour réduire la friction, casser les tickets, et accélérer sa décision.

---
\\pagebreak

## 5. MODÈLE ÉCONOMIQUE : PRICING AU VOLUME GÉRÉ

La tarification Skynet s'émancipe des abonnements par poste. Elle se base sur une consommation annuelle de logs de sécurité (mesurée pendant le Pilote), et lissée budgétairement.

<div class="gray-box" style="text-align: center;">
    <strong>Prix Unitaire de Base Skynet :</strong><br>
    <span style="font-size: 1.6rem; font-weight: bold; color: #1e3a8a;">500 $ / Go de logs</span><br>
    <span style="font-size: 0.9rem;">(Base de calcul calculée à l'année)</span>
</div>

### Calcul et Lissage (Année → MRR)
Afin de ne pas impacter la trésorerie du client de manière frontale, l'abonnement financier est divisé en **12 paiements**.

1. **Évaluation :** Pilote client mesuré par exemple à 3 Go/mois.
2. **Conversion Annuelle :** 3 Go × 12 mois = 36 Go / an.
3. **Prix Annuel Brut :** 36 Go × 500 $ = 18 000 $.
4. **Mensualisation Contractuelle :** 18 000 $ / 12 = **1 500 $ / mois**.

### Dépassements & Transparence Stratégique
La gestion des quotas évite toute facturation surprise.
- **Quota à 85% :** Alerte automatisée + Appel technique dédié avec le client (Analyse cause racine de la montée de logs + Présentation d'options techniques limitatives).
- **Quota à 100% (Décision Client) :**
  1. Achat d'Extension de Gigaoctets au même tarif (500$/Go).
  2. Optimisation directe du Logging (Réduction des sources peu critiques/verbosité).
  3. Upgrade natif vers un Quota Supérieur contractuel.

---
\\pagebreak

## 6. KPI, QUALITÉ & ROADMAP D'ÉQUILIBRE

### KPI d'Exécution & Performance (SLA)
Pour rassurer la machine d'échelle interne, un suivi constant est tenu :
- **SLA Temps de Détection (MTTD)** : &lt; 2h (Critique absolu).
- **SLA Disponibilité Infra** : Objectif de maintien de 99.9%.
- **Opérationnel** : Ratio Nombre d'incidents / Captés / Escaladés / Résolus.
- **Conversion Vente** : Objectif de Closing du Pilote à **50–70%**.

### Roadmap et Break-Even Financier

L'objectif interne absolu de pérennité du service SOC Skynet est d'atteindre le **Point d'Équilibre (Break-Even) autour de la tranche J105 – J110** (Horizon mi-Avril projeté).

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">Phase S1 – S3 : Fondations Techniques robustes</div>
        Mise en place de l'infrastructure rigoureuse. Durcissement SSL. Interconnexions Wazuh / TheHive / Webhooks de qualité industrielle + Écriture profonde des Templates.
    </div>
    <div class="tree-node">
        <div class="tree-title">Phase S4 – S12 : Lancement et Traction</div>
        Acquisition (Pilotée par OpenClaw de façon autonome). Lancement et optimisation active des Pilotes client. Stabilisation complète du processus opérationnel.
    </div>
    <div class="tree-node">
        <div class="tree-title">Phase S13+ : Scalabilité</div>
        Mise à l'échelle basée sur les engagements récurrents annuels validés et l'enrôlement externe en équipe L1 d'analyse offshore exclusive pour combler le pic de volume d'alerte sans perdre la réactivité 24/7.
    </div>
</div>

---
\\pagebreak

## 7. ANNEXES OPÉRATIONNELLES

<div class="tree-structure">
    <div class="tree-node">
        <div class="tree-title">A. Workflows d'Alerte : Make / OpenClaw / Perplexity</div>
        <ul class="tree-items">
            <li><strong>Déclenchement :</strong> Alerte Wazuh de niveau critique → Webhook vers TheHive pour générer le Case.</li>
            <li><strong>Clôture & IA :</strong> Le Case est validé/résolu par l'analyste → Déclenchement automatisation Make → L'agent OpenClaw / Perplexity rédige le résumé exécutif en LNP.</li>
            <li><strong>Notification :</strong> Envoi automatique et formaté de l'email vers le client, incluant l'historique et la suggestion prioritaire de notre lien Calendly.</li>
        </ul>
    </div>
    
    <div class="tree-node">
        <div class="tree-title">B. Modèles Standardisés des Cases TheHive</div>
        Tout ticket géré dans l'installation SOC intègre obligatoirement la suite d'instructions :
        <ul class="tree-items" style="margin-top: 5px;">
            <li>1. Contexte & Preuves techniques.</li>
            <li>2. Hypothèse opérationnelle soulevée.</li>
            <li>3. Actions d'endiguement ou d'investigation exécutées.</li>
            <li>4. Résultat technique factuel.</li>
            <li>5. Recommandations de sécurité formulées.</li>
        </ul>
    </div>

    <div class="tree-node">
        <div class="tree-title">C. Checklists Intraitables de Régulation</div>
        <ul class="tree-items">
            <li><strong>Checklist "Pilot Start"</strong> : Pour assurer le +0 downtime sur le T0.</li>
            <li><strong>Checklist "Daily Ops"</strong> : Maintien de l'infra TheHive et veille log analytique.</li>
            <li><strong>Checklist "Conversion J20"</strong> : Structure du script commercial préparatoire à l'appel.</li>
            <li><strong>Checklist "Renouvellement"</strong> : Déclenchée précisément à 85% du quota cloud pour facturation du delta.</li>
        </ul>
    </div>
</div>

<div class="financial-summary">
    <p class="total">STRATÉGIE ET MISSION : SKYNET CONSULTING MSSP</p>
    <p class="subtext">Objectif : MTTD &lt; 2h - Opérations & Intelligence</p>
</div>

<div class="footer">
    Document strictement confidentiel - SKYNET CONSULTING © 2026
</div>
"""

with io.open("content/docs/skynet-soc-final-formatted.md", "w", encoding="utf-8") as f:
    f.write(md_content)

print("Smart Fusion completed.")