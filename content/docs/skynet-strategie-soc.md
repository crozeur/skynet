# SKYNET CONSULTING
## Stratégie Opérationnelle SOC - Managed Security Service Provider

---

## TABLE DES MATIÈRES

1. **Synthèse Exécutive**
2. **Positionnement du SOC**
3. **Architecture Technique**
4. **Modèle Économique & Pricing**
5. **Organisation & Équipes**
6. **Onboarding & Pilote**
7. **Rétention & Fidélisation**
8. **SLA & Métriques de Performance**
9. **Roadmap Opérationnelle**

---

## 1. SYNTHÈSE EXÉCUTIVE

### La Promesse SOC Skynet

Skynet Consulting offre un **SOC Managé 24/7** (Managed Security Service Provider) conçu pour détecter et contenir les menaces en temps réel, sans surcharger les équipes IT du client.

**Proposition de valeur :**
- Détection des menaces en **moins de 2 heures** (MTTD : Mean Time To Detect)
- Couverture **24/7/365** avec équipes offshore 3x8
- **Automatisation IA** (OpenClaw) qui élimine 80% des fausses alertes
- Transparence totale via portail client en temps réel
- **Marges brutes 75%+** grâce à la scalabilité de l'architecture

### L'Architecture en 4 Briques

| Brique | Rôle | Outil |
|--------|------|------|
| **Collecte** | Agents légers chez le client | **Wazuh Agent** |
| **Stockage & Visualisation** | Base de logs centralisée | **OpenSearch** |
| **Gestion d'Incidents** | Ticketing des alertes | **TheHive** |
| **Intelligence Artificielle** | Triage, enrichissement, remédiation | **OpenClaw** |

### Objectifs SOC à 6 Mois (Mars 2026)

| Métrique | Cible |
|----------|-------|
| **Clients SOC Actifs** | 8-12 |
| **MRR SOC** | 12 000 $ - 25 000 $ |
| **Marge Brute** | 75%+ |
| **Taux de Rétention** | 90%+ |
| **MTTD (Mean Time To Detect)** | < 2 heures |
| **Disponibilité Infrastructure** | 99.9% |

---

## 2. POSITIONNEMENT DU SOC

### Qui Sont Nos Clients SOC ?

**Profil Type :**
- PME et ETI (100-2000 employés)
- Secteurs régulés : Finance, Santé, E-commerce, Énergie
- DSI/CISO ayant un budget cyber mais **SANS** équipe de détection interne
- Zones géographiques : France, USA, Golfe (GCC)

**Pourquoi Ils Choisissent Notre SOC :**
1. **Expertise 24/7 en continu** (pas juste un outil, une équipe)
2. **Coût prévisible et scalable** (facturation par Go de logs)
3. **Zéro maintenance technique** (on gère l'infrastructure pour eux)
4. **Conformité garantie** (RGPD, HIPAA, SOC2, ISO 27001)

### Le Problème du Marché

**Avant Skynet :**
```
Option 1 : Embaucher un CISO interne
├─ Coût : 60 000 € - 80 000 € / an
├─ Risque : 1 personne = goulot d'étranglement
└─ Scalabilité : Aucune

Option 2 : Acheter un outil SIEM (Splunk, ELK)
├─ Coût infrastructure : 20 000 € - 50 000 € / an
├─ Coût maintenance : 30 000 € - 60 000 € / an
├─ Risque : Fausses alertes massives (95% non-exploitables)
└─ Scalabilité : Limitée à la capacité serveur

Option 3 : SOC traditionnel (Mandiant, CrowdStrike)
├─ Coût : 100 000 € + / an (prohibitif pour PME)
└─ Lock-in : Contrats 3-5 ans, très rigides
```

**Après Skynet :**
```
SOC Managé Skynet
├─ Coût : 1 500 $ - 2 500 $ / mois (PME peut le justifier)
├─ Humain + IA : 100% du travail qualifié
├─ Scalabilité : Illimitée (50 clients parallèles, 2 personnes HQ)
├─ Expertise : Senior (Nabil) + Analystes certifiés
└─ Sortie facile : Pas de lock-in long terme
```

### Notre Avantage Concurrentiel

| Critère | Skynet | Mandiant | SIEM DIY |
|---------|--------|----------|----------|
| **Coût** | 1.5k-2.5k$/mois | 100k+$/an | 50k-100k$/an |
| **Time-to-Value** | 2 semaines | 2-3 mois | 1-2 mois |
| **MTTD (Detection)** | < 2h | 4-6h | 8h+ (bruit) |
| **Faux positifs** | 5-10% | 15-20% | 80-90% |
| **Équipe Dédiée** | ✅ 24/7 | ✅ 24/7 | ❌ Self-service |
| **IA Triage** | ✅ OpenClaw | ❌ Manual | ❌ Manual |
| **Conformité Régionalisée** | ✅ UE/US/GCC | ⚠️ Centralisé | ⚠️ Client |
| **Support 24/7** | ✅ En Français/EN | ✅ Anglais mainly | ❌ Aucun |

---

## 3. ARCHITECTURE TECHNIQUE

### Vue d'Ensemble du Flux de Données

[image:169]

Chaque client SOC est un **flux de données isolé et souverain**.

### Étape 1 : Collecte (Wazuh Agent)

**Qu'est-ce que Wazuh ?**
Un agent léger déployé sur chaque serveur/endpoint du client. Il collecte :
- Logs système (Windows Event Log, Syslog Linux)
- Événements réseau (connexions, transferts)
- Événements applicatifs (crash, erreurs)
- Données de performance (CPU, mémoire)

**Déploiement :**
```
Architecture Standard (PME 50-200 serveurs)
├─ Agent Wazuh sur 30-50 serveurs critiques
├─ Collecteur Wazuh (concentrateur réseau)
├─ Transmission TLS chiffrée vers OpenSearch Skynet
└─ Volume attendu : 1-3 Go logs/jour
```

**Sécurité :**
- Authentification par certificat SSL
- Chiffrement AES-256 en transit
- Aucune donnée en clair ne quitte le réseau du client

### Étape 2 : Stockage & Visualisation (OpenSearch)

**Qu'est-ce qu'OpenSearch ?**
Une base de données distribuée spécialisée dans les gros volumes de logs. Chaque cluster OpenSearch est **régionalisé par juridiction**.

**Implémentation :**
```
Clients UE (RGPD)
└─ Cluster OpenSearch à Francfort (AWS EU-Central-1)

Clients USA
└─ Cluster OpenSearch à Virginie (AWS US-East-1)

Clients Golfe
└─ Cluster OpenSearch à Bahreïn (AWS Middle-East)
```

**Portail Client :**
Accès en lecture seule au dashboard OpenSearch.
```
Ce que le client voit :
✅ Dernières attaques détectées
✅ État de santé des agents Wazuh
✅ Graphiques de menaces par type
✅ Timeline des incidents
❌ Jamais les données brutes d'autres clients
```

### Étape 3 : Gestion d'Incidents (TheHive)

**Qu'est-ce que TheHive ?**
Un système de ticketing spécialisé en cybersécurité. Chaque alerte devient un "Case" (dossier).

**Workflow d'une Alerte :**
```
1. Wazuh détecte un événement suspect
   ↓
2. OpenClaw analyse le contexte
   ↓
3. Si faux positif (95%+ des cas) → Fermé automatiquement
   ↓
4. Si vrai positif → Crée un Case dans TheHive
   ↓
5. OpenClaw propose marche à suivre (playbook)
   ↓
6. Analyste (Nabil ou équipe nuit) exécute la remédiation
   ↓
7. Case fermée avec rapport d'action
```

**Exemple de Case :**
```
ID : CASE_2026_0842
Titre : Tentative Brute Force SSH (Serveur DB)

Informations Contextuelles (enrichies par OpenClaw) :
├─ Adresse source : 203.0.113.42 (République Tchèque)
├─ Threat Intel : IP listée dans 12 botnets connus ✓
├─ Nombre tentatives : 4 392 en 15 min
├─ Taux de succès : 0 (authentification forte en place) ✓
└─ Sévérité : MOYENNE (contenu, pas d'accès)

Marche à Suivre Proposée (OpenClaw) :
1. Ajouter IP source en blacklist (pare-feu)
2. Monitorer comptes du serveur (pas d'accès = OK)
3. Garder l'IP en watchlist 7 jours
4. Fermer le case

Action Client : Validé ✓
Exécution : Automatisée (pare-feu via API)
Status : Fermé à 09:45 UTC
```

### Étape 4 : Intelligence Artificielle (OpenClaw)

**Le Rôle d'OpenClaw dans le SOC :**

OpenClaw n'est pas un "chatbot". C'est un **orchestrateur de tâches** connecté aux APIs de Wazuh, OpenSearch et TheHive.

**Tâches Principales :**

| Tâche | Exécution | Résultat |
|-------|-----------|----------|
| **Triage d'Alertes** | Analyse contexte (WHOIS, ASN, Threat Intel) | 95% fausses alertes éliminées |
| **Enrichissement** | Requête VirusTotal, AbuseIPDB, Shodan | Contexte ajouté au Case |
| **Détection d'Anomalies** | Baseline comportement utilisateur (ML) | Détecte accès anormaux |
| **Génération Playbooks** | Recommande marche à suivre standardisée | Analyste valide seulement |
| **Daily Flash** | Rédige rapport quotidien pour client | PDF + Email automatisé |
| **Escalade Intelligente** | Si menace critique → Réveille Nabil | Pas de fausse alerte |

**Exemple : Approche de Détection d'Anomalies**

```
Baseline Utilisateur (Jean Dupont, Finance) :
├─ Heures habituelles : 8h-18h (GMT+1)
├─ Géolocalisation : Bureau Paris
├─ Accès : Serveur Finance, SalesForce, Email
├─ Volume données : 10-50 MB/jour

ANOMALIE DÉTECTÉE (15 Mars 2026, 03h45 UTC) :
├─ Jean accède depuis IP : 185.220.101.12 (Tor Exit Node)
├─ Heure : 3h45 du matin (hors horaires)
├─ Transfert de données : 2.5 GB (50x le volume normal)
├─ Serveur accédé : Toute la base financière

Scoring OpenClaw : CRITIQUE (95% probabilité compromission)

Action Automatique :
├─ Case créé dans TheHive (URGENT)
├─ Email d'alerte à Nabil + Analyste
├─ Déconnexion forcer de la session Jean
├─ Forensique en cours...
```

---

## 4. MODÈLE ÉCONOMIQUE & PRICING

### Structure de Tarification

**Le modèle Skynet = Facturation par Volume de Logs**

Pourquoi par volume ? Parce que c'est équitable et scalable :
- Client petit (1 Go/mois) paie peu
- Client gros (10 Go/mois) paie plus
- Aucune surprise (prix = commodité)

### Les Trois Packs Commerciaux

#### Pack Starter (PME Petite)

```
Volume Maximum : 3 Go logs/mois
Prix : 1 500 $ / mois
Dépassement : 200 $ par Go supplémentaire

Inclus :
✅ Agents Wazuh (jusqu'à 20 serveurs)
✅ Détection 24/7 (< 2h MTTD)
✅ OpenSearch Dashboard en lecture seule
✅ 5 Cases TheHive / mois
✅ Email support (réponse < 4h)
✅ Rapport mensuel (PDF)

Exclus :
❌ Support phone 24/7
❌ Intégration custom
❌ Threat Intel premium
```

#### Pack Pro (PME Moyenne)

```
Volume Maximum : 5 Go logs/mois
Prix : 2 500 $ / mois
Dépassement : 200 $ par Go supplémentaire

Inclus :
✅ Agents Wazuh (jusqu'à 50 serveurs)
✅ Détection 24/7 + réponse 1h (SLA)
✅ OpenSearch Dashboard + alertes personnalisées
✅ Intégration TheHive (playbooks auto)
✅ Threat Intel enrichissement (VirusTotal + AbuseIPDB)
✅ Phone support 24/7 (hotline dédiée)
✅ Rapport mensuel + Weekly digest
✅ Revue mensuelle avec Nabil (30 min)

Exclus :
❌ Incident Response (c'est à la carte)
❌ Forensique poussée
```

#### Pack Enterprise (ETI)

```
Volume : Illimité
Prix : Sur devis (min 5 000 $ / mois)
SLA : 1h MTTD, 30 min réponse

Inclus :
✅ Tout du Pack Pro +
✅ Agents Wazuh illimités
✅ Détection avancée (ML, anomalies)
✅ Incident Response inclus (Nabil disponible)
✅ Customisation infrastrucure
✅ Threat Intelligence premium (Dark Web monitoring)
✅ Revues trimestrielles stratégiques
✅ Audit annuel conformité HIPAA/SOC2
```

### Revenus MRR Attendus

**Scénario Mois 2 (Février 2026)** : 6 Clients SOC

```
Répartition Clients :
├─ 3 clients Pack Starter × 1500 $ = 4 500 $
├─ 2 clients Pack Pro × 2500 $ = 5 000 $
└─ 1 client Pack Enterprise = 5 000 $
│
Total MRR SOC = 14 500 $
```

**Scénario Mois 3 (Mars 2026)** : 10 Clients SOC

```
Répartition Clients :
├─ 4 clients Pack Starter × 1500 $ = 6 000 $
├─ 4 clients Pack Pro × 2500 $ = 10 000 $
└─ 2 clients Pack Enterprise × 5000 $ = 10 000 $
│
Total MRR SOC = 26 000 $
```

### Structure de Coûts (Pour 1 Client Pack Pro)

```
Revenu Client : 2 500 $ / mois

COÛTS DIRECTS :
├─ Infrastructure AWS (OpenSearch) : 300 $
├─ Licences Wazuh/TheHive : 100 $
├─ Threat Intel APIs (VirusTotal, AbuseIPDB) : 50 $
├─ Stockage S3 Backups (30 jours) : 50 $
└─ Contingency (5%) : 125 $
│
Total Coûts Directs = 625 $

MARGE BRUTE = 1 875 $ / client (75%)
│
Amortissement Coûts Fixes (Nabil, Support, etc.) :
├─ Avec 10 clients × 1875 $ = 18 750 $ total marge
└─ Coûts fixes SOC = 5 000 $ (Nabil 2k + Support 1.5k + Ops 1.5k)
│
Profit SOC = 13 750 $ / mois (10 clients)
```

---

## 5. ORGANISATION & ÉQUIPES

### Structure Skynet HQ (Architecture 3x8)

```
DIRECTION GÉNÉRALE (24/7)
├─ Ya Ha (CEO)
└─ Nabil (CTO)

TIER 1 : GESTION & INGÉNIERIE (JOUR)
├─ Nabil (CTO)
│  ├─ Onboarding nouveaux clients
│  ├─ Incidents critiques (escalade)
│  ├─ Architecture infrastructure
│  └─ Relation DSI/CISO (appels stratégiques)
│
└─ Support Manager (JOUR) [À recruter]
   ├─ Tickets support Starter/Pro
   ├─ FAQ clients
   └─ Formation utilisateurs

TIER 2 : ANALYSE DE NUIT (SOIR/NUIT/AUBE)
├─ Analyste Junior 1 (Alger, 18h-02h UTC)
├─ Analyste Junior 2 (Alger, 02h-10h UTC)
└─ Analyste Junior 3 (Alger, 10h-18h UTC)
   [Recrutement en cours]

ORCHESTRATION IA (24/7 - AUTOMATISÉE)
└─ OpenClaw
   ├─ Triage des 95% fausses alertes
   ├─ Enrichissement contexte
   ├─ Génération playbooks
   ├─ Escalade intelligente à Nabil si CRITIQUE
   └─ Génération rapports Daily Flash
```

### Les Rôles en Détail

#### Nabil (CTO) - Jour + On-Call

**Temps alloué SOC :** 50-60% (reste sur infrastructure générale)

**Responsabilités :**
- Onboarding clients (réunion kick-off 30 min)
- Incidents Critiques (escalade OpenClaw)
- Validation playbooks complex
- Revues mensuelles clients Pack Pro/Enterprise
- Architecture infrastructure (sécurité, conformité)

**Nombre de clients manageable :** 10-15 (avec IA)

#### Équipe Analystes Juniors (Alger, 3x8)

**Profil :** Certifiés Security+ ou équivalent

**Responsabilités (par analyste) :**
- Réception d'alertes pré-triées par OpenClaw
- Analyse contexte fourni par l'IA
- Exécution playbooks
- Rédaction rapports cases
- **NE JAMAIS** réveiller Nabil sauf menace critique avérée

**Volume :** 1 analyste = 3-5 clients confortablement

**Salaire Algérie :** 500 $ - 700 $ / mois (marché local)

#### Support Manager (JOUR) [À recruter]

**Profil :** Quelques années expérience support IT

**Responsabilités :**
- Tickets support Starter/Pro (email/chat)
- FAQ clients
- Problèmes Wazuh/OpenSearch (première ligne)
- Coordination avec Nabil pour escalade
- Formation clients (webinars, docs)

**Rôle :** Libre Nabil pour travail stratégique (plutôt que emails de support)

**Salaire Algérie :** 400 $ - 600 $ / mois

---

## 6. ONBOARDING & PILOTE

### Le Pilote Gratuit (14 Jours)

**Objectif :** Prouver la valeur, convertir en contrat MRR

**Timeline :**
```
J0 : Kick-Off Technique (30 min avec Nabil)
     └─ DSI installe l'agent Wazuh lui-même
        (preuve de sécurité du process)

J1-13 : Fonctionnement Quotidien
     ├─ Wazuh collecte logs
     ├─ OpenClaw trie alertes
     ├─ Daily Flash généré chaque matin
     └─ Client voit les menaces détectées

J12 : Appel de Conversion
     └─ "Vous avez vu 12 jours de détection.
          Signons le contrat 12 mois ?"

J14 : DEADLINE FERME
     └─ Infrastructure s'arrête si pas de signature
        (Urgence force la décision)
```

### Phase 1 : Réunion Kick-Off (30 min)

**Participants :** Nabil + DSI Client

**Agenda :**
```
1. Présentation SOC Skynet (5 min)
   - Architecture overview
   - SLA MTTD < 2h
   - Équipes 24/7

2. Déploiement Agent (10 min)
   - DSI installe Wazuh lui-même sur test server
   - Nabil guide par écran partagé
   - Démontre que c'est simple et transparent

3. Accès Portail (5 min)
   - DSI reçoit login OpenSearch
   - Voit un exemple de dashboard
   - Peut commencer à voir logs en temps réel

4. Support & Ressources (10 min)
   - Numéro hotline 24/7 (si Pack Pro+)
   - Documentation clients
   - Prochain check-in : J7
```

**Signal Client:** "Ce mec connaît son affaire. On peut lui faire confiance."

### Phase 2 : Daily Flash (Preuve de Valeur)

**Format :**
```
=== SOC SKYNET - RAPPORT QUOTIDIEN ===

Client : [NOM_CLIENT]
Date : 27 Février 2026
Période : 26 Février 00:00 - 27 Février 00:00 UTC

📊 RÉSUMÉ EXÉCUTIF
├─ Événements Totaux : 87 432
├─ Alertes Détectées : 142
├─ Vrais Positifs (menaces réelles) : 3
└─ Faux Positifs Éliminés : 139 ✓

🚨 MENACES DÉTECTÉES (3 incidents)

CRITIQUE (Demande action immédiate)
├─ Tentative Brute Force SSH (Serveur BD)
│  ├─ Source : 203.0.113.42 (République Tchèque)
│  ├─ Tentatives : 2 847
│  ├─ Succès : 0 (authentification forte) ✓
│  ├─ Action : Ajouter IP en blacklist (fait) ✓
│  └─ Sévérité : MOYENNE (contenu, pas d'accès)
│
└─ Malware Détecté (Endpoint utilisateur)
   ├─ Utilisateur : jean.dupont@societe.fr
   ├─ Fichier : invoice_2026.zip (Trojan)
   ├─ Threat Intel : Connu (Emotet botnet) ⚠️
   ├─ Action : Fichier mis en quarantaine (fait) ✓
   └─ Sévérité : CRITIQUE (menace confirmée)

MOYENNE (Surveillance)
└─ Accès Administrateur 03h45 UTC (Serveur APP)
   ├─ Compte : svc_backup
   ├─ Raison : Job backup planifié (normal) ✓
   ├─ Sévérité : INFO

✅ DISPONIBILITÉ INFRASTRUCTURE
├─ Wazuh Agents : 47/47 actifs (100%)
├─ OpenSearch Cluster : 99.9% uptime
├─ Alertes Perdues : 0
└─ Délai Détection : Moyenne 87 min (< 2h) ✓

📈 TENDANCES
├─ Scan de ports : +15% (normal, scans externes)
├─ Brute force : Stable
├─ Malware : 0 (avant cette semaine : 2)
└─ Anomalies Utilisateur : Stable

📝 RECOMMANDATIONS
1. Renforcer authentification SSH (clé privée + MFA)
2. Former utilisateurs sur phishing (fichiers .zip suspects)
3. Augmenter logs application (actuellement minimes)

Prochaine étape : Appel J12 pour signature MRR.

---
Rapport généré par OpenClaw | Validé par Nabil
```

**Impact Client :** "Wow, en 2 semaines ils ont détecté 2 vrais malwares que notre antivirus a manqués."

### Phase 3 : Appel de Conversion (J12)

**Pitch :**
```
"Vous avez vu pendant 12 jours que notre SOC détecte 
les menaces en moins de 2 heures.

Regardez votre Daily Flash : 3 incidents détectés et 
bloqués sans qu'aucun de vos équipes IT n'ait à faire 
quoi que ce soit.

Pour continuer cette protection et cette automatisation, 
on signe un contrat de 12 mois à [PRIX] par mois.

Signature électronique aujourd'hui = Service continu J15.
Pas de signature = Infrastructure s'arrête J14 à minuit."
```

**Objection Courante :**
```
DSI : "On va réfléchir... demander d'autres devis."

Toi : "Bien sûr, 100% normal. Vous avez 24 heures.
      Passé minuit demain, la VM d'essai s'arrête 
      et vous perdez accès aux données.
      On se rappelle demain 10h ?"
```

**Taux de Conversion Attendu :** 60-70%

---

## 7. RÉTENTION & FIDÉLISATION

### Le Problème : Éviter le Churn (Clients Qui Partent)

**Risk de Départ :**
```
Après 3 mois : Client teste si le SOC vaut vraiment le prix
Après 6 mois : Client compare avec concurrents
Après 12 mois : Renouvellement = moment critique
```

**Solution Skynet = Augmenter la "Stickiness"**

### Les 5 Piliers de la Rétention

#### Pilier 1 : Portail Client Transparent

**Ce que le client voit (OpenSearch Dashboard personnalisé) :**
```
- Attaques détectées ce mois : 23
- Attaques bloquées : 23 (100%)
- Temps de détection moyen : 47 min (< 2h) ✓
- Incidents résolus : 23 (100%)
- Disponibilité infrastructure : 99.95%
- Agents Wazuh actifs : 47/47 (100%)

Graphiques :
- Tendance des menaces (derniers 90 jours)
- Distribution par type (malware, brute force, anomalies)
- MTTD trend (on s'améliore ?)
```

**Impact Psychologique :** "On voit clairement la valeur chaque jour."

#### Pilier 2 : Rapport Mensuel Exécutif

**Génération :** Automatisée par OpenClaw

**Format :** PDF 1 page par email le 1er du mois

```
RÉSUMÉ MENSUEL - FÉVRIER 2026

KPIs Sécurité :
├─ Menaces Détectées : 47
├─ Vrais Positifs : 7 (incidents réels)
├─ Faux Positifs : 40 (éliminés par IA) ✓
├─ MTTD Moyen : 89 min
├─ Incidents Résolu : 7/7 (100%)
└─ Disponibilité : 99.98% (0.5h downtime prévu maintenance)

Tendances :
- Brute Force : +5% (normal, scans externes augmentent)
- Malware : -30% (formation utilisateurs efficace) ✓
- Anomalies Utilisateur : Stable

Attaques Bloquées Qui Auraient Pu Causer des Dégâts :
1. Ransomware Emotet (27 Feb) → Contenu, quarantine
   Perte potentielle si pas détecté : 50 000 € / jour ✓
2. Brute Force AD (3 Feb) → Bloqué, pas d'accès
   Risque potentiel : Vol données sensibles
3. Data Exfil Anomalie Utilisateur (15 Feb) → Détecté 45 min

Prochaines Étapes :
- Implémenter MFA (recommandé depuis Jan)
- Monitorer serveur APP (logs faibles actuellement)

Questions ? Contactez notre support 24/7 ou appelez Nabil.
```

**Impact Client :** "Notre DSI peut montrer ça à sa direction. On justifie facilement le budget."

#### Pilier 3 : Revues Mensuelles (Pack Pro+)

**Fréquence :** 30 min / mois avec Nabil

**Format (30 min):**
```
15 min : Revue des incidents du mois
- 3 cas critiques : quoi, pourquoi, comment
- Leçons apprises
- Changements à faire ?

10 min : Recommandations sécurité
- MFA sur AD (urgence)
- Formation phishing (utilisateurs cliblés)
- Augmenter logs applicatifs (détection + fine)

5 min : Questions client + roadmap
```

**Impact Client :** "Nabil connaît notre infra par cœur. C'est pas juste un outil, c'est un partenaire."

#### Pilier 4 : L'Effet de Réseau (Succès Visible)

Chaque mois que rien de grave ne se passe → Client oublie pourquoi il a besoin du SOC.

**Solution = Faire voir les "saves" (incidents évités) :**

```
Chaque Case fermé = Email automatique au client
"Nous avons bloqué un incident qui aurait pu coûter..."

Exemple :
"Ransomware détecté sur endpoint. Mis en quarantaine 
en 12 minutes. Perte potentielle estimée : 50 000 €.
Cet incident aurait probablement causé l'arrêt de 
2-3 jours de production sans notre SOC."
```

#### Pilier 5 : Upsell vers Autres Services

Une fois le SOC en place, le client fait confiance. Opportunités d'upsell :

```
After 3 mois SOC → Offrir Audit Cloud Security
After 6 mois SOC → Offrir FinOps (économies énergies)
After 12 mois SOC → Offrir Incident Response (contrat annuel)
```

**Impact Économique :**
```
Client Pack Pro (2 500 $ / mois)
├─ Pilote (14j) = 0 $
├─ Mois 1-12 = 2 500 $ × 12 = 30 000 $
├─ Upsell Audit Cloud (Mois 6) = 5 000 $ one-time
└─ Upsell IR (Mois 12) = 1 000 $ / mois (récurrent)

Total Année 1 = 30 000 + 5 000 + 12 000 = 47 000 $ ✓
```

---

## 8. SLA & MÉTRIQUES DE PERFORMANCE

### Les SLA Skynet

| SLA | Pack Starter | Pack Pro | Enterprise |
|-----|-------------|----------|-----------|
| **MTTD (Détection)** | < 3h | < 2h | < 1h |
| **Response Time** | 8h | 1h | 30 min |
| **Uptime Infrastructure** | 99% | 99.9% | 99.95% |
| **Monthly Report** | ✅ | ✅ | ✅ |
| **Strategic Review** | ❌ | 1x mois | 1x trimestre |
| **Availability Contact** | Email | Phone 24/7 | Nabil direct |

### Métriques de Performance Suivies

#### Métrique 1 : MTTD (Mean Time To Detect)

```
Définition : Temps moyen entre un incident réel 
et sa détection par le SOC

Cible : < 2h pour tous les packs
Formule : Somme(temps_détection) / Nombre_incidents

Exemple Février 2026 (10 clients) :
├─ Incident 1 (Brute Force) : 47 min
├─ Incident 2 (Malware) : 89 min
├─ Incident 3 (Anomalie User) : 34 min
├─ Incident 4 (Data Exfil) : 112 min
├─ Incident 5 (SSH Compromise) : 76 min
├─ Incident 6 (Config Unauthorized) : 23 min
├─ Incident 7 (Privilege Escalation) : 95 min
└─ MTTD Moyen = 68 min ✓ (< 2h)

Tracker : Dashboard Nabil avec MTTD par client par mois
```

#### Métrique 2 : Taux de Faux Positifs

```
Définition : % d'alertes qui ne sont pas des menaces réelles

Cible : < 10% (les 95%+ autres sont éliminées par IA)

Formule : Faux_Positifs / Total_Alertes

Exemple Février 2026 :
├─ Total d'alertes générées : 1 247
├─ Cases créés (vrais positifs) : 47
├─ Faux positifs éliminés par OpenClaw : 1 200
└─ Taux Faux Pos = 1200/1247 = 96.2% ✓

Impact : Analyste humain ne voit que les 47 vrais cas
(pas de surcharge d'alertes)
```

#### Métrique 3 : Uptime Infrastructure

```
Définition : % de temps que le SOC est disponible

Cible : 99.9% (2.7h de downtime/mois acceptable)

Formule : (Total_Secondes - Downtime_Secondes) / Total_Secondes

Février 2026 :
├─ Secondes en mois = 2 419 200
├─ Downtime (maintenance AWS) = 432 sec (7 min)
├─ Uptime = (2419200 - 432) / 2419200 = 99.98% ✓

Incidents à zéro : Clusters redondants, no single point failure
```

#### Métrique 4 : MTTR (Mean Time To Respond)

```
Définition : Temps moyen avant qu'on agisse sur une alerte

Cible : < 1h (Pack Pro), < 30 min (Enterprise)

Février 2026 (Pack Pro) :
├─ Alerte #1 : 12 min (analyste nuit voit de suite)
├─ Alerte #2 : 34 min
├─ Alerte #3 : 47 min
├─ Alerte #4 : 23 min
├─ ...
└─ MTTR Moyen = 38 min ✓ (< 1h)
```

#### Métrique 5 : Retention Rate

```
Définition : % de clients renouvelant contrat 12 mois

Cible : > 90% (industry standard 70-80%)

Février 2026 (premières expirations Janvier 2025) :
├─ Clients expirés : 3
├─ Clients renouvelés : 3
├─ Nouveaux clients : +5
└─ Retention = 3/3 = 100% ✓

Plan d'action si churn :
- Appel DSI (pourquoi partir ?)
- Offrir upgrade gratuit (Pack Starter → Pro)
- Ajouter security reviews mensuels
```

---

## 9. ROADMAP OPÉRATIONNELLE

### Phase 1 : Janvier 2026 (Fondations)
**THEME : Déploiement Infrastructure & 3 Premiers Clients**

```
SEMAINES 1-2 :
✅ Infrastructure AWS régionalisée (UE/US/GCC)
✅ Cluster OpenSearch + Wazuh + TheHive en production
✅ OpenClaw skill "SOC Triage" (prompts système)
✅ Templates Daily Flash + Monthly Report
✅ Portail client OpenSearch (personnalisé)

SEMAINES 3-4 :
✅ Recruter 2 Analystes Juniors (Alger)
✅ 3 clients pilotes lancés (Starter)
✅ Tester SLA MTTD < 2h
✅ Affiner playbooks detction
```

**KPIs** :
- Clients SOC : 3
- MRR : 4 500 $ (3 × 1 500 $)
- MTTD Moyen : 120 min (objectif)
- Taux Faux Pos : 94% (acceptable)

---

### Phase 2 : Février 2026 (Scaling & Optimisation)
**THEME : 6 Clients & Automatisations Avancées**

```
SEMAINES 5-8 :
✅ Ajouter 3 nouveaux clients (1 Pro, 2 Starter)
✅ Implémenter ML anomaly detection (OpenClaw)
✅ Automatiser génération playbooks
✅ Créer bot Telegram "Marque Blanche"
✅ Mettre en place Daily Flash 100% automatisé
✅ Recruter Support Manager
✅ Offrir revues mensuelles clients Pro
```

**KPIs** :
- Clients SOC : 6 (3 Starter + 2 Pro + 1 Enterprise pilot)
- MRR : 14 500 $
- MTTD Moyen : 85 min ✓
- Taux Faux Pos : 92% ✓
- Retention Pilot : 100%

---

### Phase 3 : Mars 2026 (Full Scale)
**THEME : 10 Clients & Enterprise Contracts**

```
SEMAINES 9-12 :
✅ Atteindre 10 clients MRR stables
✅ Lancer offre "Incident Response" (à la carte)
✅ Implémenter Dark Web monitoring (OpenClaw)
✅ Certifier pour compliance HIPAA/SOC2
✅ Mettre en place dashboard Nabil (vue d'ensemble 10 clients)
✅ Upsell Cloud Security + FinOps audits
✅ NPS survey (cible > 50)
```

**KPIs** :
- Clients SOC : 10-12
- MRR : 25 000 $ - 30 000 $ ✓
- Marge Brute : 75%+
- MTTD Moyen : 70 min ✓
- Taux Faux Pos : 90% ✓
- Retention 12m : 90%+
- NPS : > 50
- Clients upsellés (Audit Cloud) : 3-4

---

## CONCLUSION

Le SOC Skynet Consulting est un **service production-ready** qui génère du revenu récurrent stable avec des marges excellentes.

**Les 3 Forces Clés :**
1. **IA qui trie 95% des alertes** (Analystes humains travaillent que sur vrais cas)
2. **Organisation 3x8 scalable** (2 personnes HQ + 3 juniors Alger)
3. **Transparence client maximale** (Portail, rapports, revues)

**Résultat :** 
- 10-12 clients en 3 mois
- 25 000 $ - 30 000 $ MRR
- Marges 75%+
- Rétention 90%+

**Cette infrastructure peut accueillir 50+ clients sans recruter additional (IA agit comme multiplicateur d'effort).**

---

**Préparé par :** Ya Ha & Nabil (Skynet Consulting)
**Date :** Février 2026
**Version :** 2.0 (Stratégie Complète)

---

## ANNEXE : Architecture SOC

[image:169]