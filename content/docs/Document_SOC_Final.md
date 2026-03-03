# SKYNET CONSULTING
## Document SOC — Stratégie Opérationnelle & Machine de Livraison (MSSP)

**Date :** Février 2026  
**Version :** Final v1.0  
**Préparé par :** Ya Ha & Nabil (Skynet Consulting)

---

# Page de garde

**SOC Managé Skynet** — Détection < 2h (MTTD), exécution 24/7, process pilot → contrat.  

> Note mise en page (export PDF) : marges 2,5 cm, 2–3 couleurs (bleu/grey), sauts de page avant chaque PARTIE, sommaire en chiffres romains puis contenu en chiffres arabes, tableaux lignes alternées, annexes A/B/C.  

\pagebreak

# SOMMAIRE (I)

- PARTIE I — Promesse & Positionnement
- PARTIE II — Architecture SOC (Wazuh / OpenSearch / TheHive)
- PARTIE III — Opérations : playbooks, escalade, 24/7
- PARTIE IV — Pilote (3 semaines) → Conversion (J20)
- PARTIE V — Tarification au volume (annuel lissé sur 12 paiements)
- PARTIE VI — KPI, Qualité, Roadmap & Point d’équilibre
- ANNEXES — A. Workflows Make/Perplexity • B. Modèles TheHive • C. Checklists

\pagebreak

# PARTIE I — Promesse & Positionnement

## 1) Promesse

Skynet Consulting délivre un SOC managé orienté **résultat** : détecter les incidents réels en moins de 2 heures (objectif MTTD) et garder une exécution simple pour le client.  

## 2) Problème marché (PME/ETI)

Les PME/ETI n’arrivent pas à maintenir :
- Une détection 24/7 (coût humain),
- Un SIEM correctement opéré (bruit + maintenance),
- Une boucle d’amélioration (playbooks + métriques).

## 3) Positionnement Skynet

- Déploiement rapide (pilot cadré),
- SLA de détection < 2h comme différenciateur,
- Plateforme Wazuh/OpenSearch/TheHive + automatisation (Make + Perplexity/OpenClaw) pour réduire le coût d’opération.

\pagebreak

# PARTIE II — Architecture SOC (Wazuh / OpenSearch / TheHive)

## 1) Vue d’ensemble

Flux cible : **Wazuh → (webhook) → TheHive → (résolution case) → Make/Perplexity → email client + suivi**.

## 2) Composants

### Wazuh
- Collecte + règles de détection.
- Ajustement des seuils pour équilibrer bruit/précision.

### OpenSearch
- Stockage/visualisation.
- Dashboards internes : volumétrie, santé agents, MTTD, disponibilité.

### TheHive (v5) + PostgreSQL
- Chaque alerte importante = **Case** (triage → analyse → remédiation → rapport).
- Webhooks Wazuh → TheHive configurés et testés.

## 3) Durcissement (obligatoire)

- SSL/TLS, authentification API, chiffrement.
- Sauvegarde + surveillance de santé + alertes performance.
- Documentation technique versionnée (Git) + procédures.

\pagebreak

# PARTIE III — Opérations : playbooks, escalade, 24/7

## 1) Playbooks SOC (minimum viable)

Playbooks détaillés, testés en interne, puis appliqués en client :
- Hameçonnage (phishing)
- Ransomware
- Force brute
- Exfiltration

## 2) Règles d’escalade

- **Slack** : notifications temps réel (opérationnel).
- **SMS** : uniquement CRITIQUE.

Règle interne : **manquer un incident réel = perte client** → tolérance zéro sur CRITIQUE.

## 3) Organisation et séparation stricte

Séparation “militaire” (évite de casser la machine) :
- **Ya Ha :** Ventes / sortante / qualification 5 min / conversion.
- **Nabil :** Infra SOC / playbooks / incidents / SLA disponibilité.

Couverture 24/7 visée via modèle follow-the-sun (renforts quand charge).  

\pagebreak

# PARTIE IV — Pilote (3 semaines) → Conversion (J20)

## 1) Cadre

Objectif : prouver la valeur rapidement, créer la confiance, puis convertir.  

## 2) Déroulé opérationnel

- **Jour 1 :** déploiement Wazuh (cible : opérationnel en 24h).
- **Jours 2–3 :** optimisation des règles + vérifications quotidiennes.
- **Jours 4–20 :** surveillance 24/7 + appels clients hebdomadaires.
- **Jour 20 :** appel de conversion (résumé pilote → proposition contrat).

## 3) Logique de conversion (script)

Structure de l’appel J20 :
- X incidents réels détectés < 2h,
- Y faux positifs éliminés (qualité du triage),
- Déploiement “smooth”, 0 downtime côté client,
- Prochaine étape : contrat (durée selon ton modèle commercial).

## 4) Documentation client

- “Quickstart” client : **5 pages max**.
- But : réduire la friction, réduire tickets, accélérer décision.

\pagebreak

# PARTIE V — Tarification au volume (annuel lissé sur 12 paiements)

## 1) Principe

La tarification n’est pas “par mois”, elle est basée sur une **consommation de logs annuelle** (mesurée/estimée), puis **splittée en 12 paiements** pour lisser la trésorerie du client.

## 2) Prix unitaire

- **500 $ / Go de logs** (base de calcul).  

## 3) Calcul (annuel → 12 paiements)

1. Mesure pendant pilote : volumétrie moyenne (Go/mois) ou extrapolation.
2. Conversion en annuel : Volume_annuel = Volume_mensuel_moyen × 12.
3. Prix annuel = Volume_annuel × 500 $.
4. Paiement mensuel = Prix_annuel / 12.

### Exemple

- 3 Go/mois → 36 Go/an
- Prix annuel = 36 × 500 = 18 000 $
- Paiement = 18 000 / 12 = 1 500 $ / mois

## 4) Dépassements : transparence (85% / 100%)

- **À 85%** du quota annuel consommé : alerte + call technique (analyse cause + options).
- **À 100%** : décision client :
  - Achat de Go supplémentaires au même prix unitaire,
  - Optimisation de logging (réduction sources/verbosité),
  - Upgrade du quota annuel.

\pagebreak

# PARTIE VI — KPI, Qualité, Roadmap & Point d’équilibre

## 1) KPI d’exécution

- MTTD (cible : < 2h)
- SLA disponibilité (cible : 99.9%)
- Nombre d’incidents captés / escaladés / résolus
- Conversion pilote → contrat (cible 50–70%)

## 2) Point d’équilibre

Objectif interne : atteindre le point d’équilibre autour de **J105–J110** (mi-avril selon calendrier).  

## 3) Roadmap opérationnelle (résumé)

- S1–S3 : fondations infra (Wazuh + TheHive + webhooks + durcissement) + templates.
- S4–S12 : pilots + optimisation + process stable.
- S13+ : mise à l’échelle (clients récurrents + renfort analyste si charge).

\pagebreak

# ANNEXES

## ANNEXE A — Workflows Make / Perplexity (communication)

Workflow cible :
- Alerte Wazuh niveau critique → webhook TheHive → case
- Case résolu → Make déclenche Perplexity/OpenClaw → résumé exécutif
- Envoi email client + historique + suggestion lien Calendly

## ANNEXE B — Modèles de Case TheHive

Modèle standard (à compléter) :
- Contexte / preuves
- Hypothèse
- Actions exécutées
- Résultat
- Recommandations

## ANNEXE C — Checklists

- Checklist “Pilot start”
- Checklist “Daily ops”
- Checklist “Conversion J20”
- Checklist “Renouvellement / extension quota logs”
