import os
import re
import json

blog_dir = "content/blog"

title_updates = {
    "30-question-security-audit-checklist-sme-it-managers.mdx": "The 30-Point Security Audit Checklist for SME IT Leaders",
    "audit-evidence-template-collect-map-track.mdx": "Audit Evidence Guide: How to Collect, Map, and Track Compliance",
    "audit-evidence-template-map-risks-proof-fixes.mdx": "Mapping Security Risks: A Practical Guide to Proving Remediation",
    "build-practical-soc-smes-monitor-run.mdx": "Building a Practical SOC for SMEs: From Monitoring to Execution",
    "cloud-cutover-runbook-waves-go-live-hypercare.mdx": "The Ultimate Cloud Cutover Runbook: Go-Live & Hypercare Strategies",
    "cloud-migration-cutover-runbook-small-it-team.mdx": "Cloud Migration Cutover: A Step-by-Step Runbook for Small IT Teams",
    "cloud-migration-cutover-runbook-steps-roles-hypercare.mdx": "Mastering Cloud Migrations: Essential Steps, Roles, and Hypercare",
    "cloud-migration-runbook-waves-cutover-hypercare.mdx": "Structuring Your Cloud Migration: Waves, Cutover, and Post-Launch Support",
    "cloud-misconfigurations-catch-first-microsoft-365-aws.mdx": "Top Cloud Misconfigurations to Fix Immediately in Microsoft 365 & AWS",
    "cloud-misconfigurations-smes-storage-iam-basics.mdx": "Securing Cloud Storage & IAM: Essential Configurations for SMEs",
    "internal-security-audit-checklist-small-it-teams.mdx": "The Complete Internal Security Audit Checklist for Small IT Teams",
    "it-security-audit-prep-20-evidence-items-gather-now.mdx": "IT Security Audit Prep: 20 Crucial Evidence Items to Gather Today",
    "run-security-audit-new-saas-apps-60-minutes.mdx": "How to Run a Security Audit on New SaaS Applications in 60 Minutes",
    "secure-first-aws-account-day-one-settings.mdx": "Securing Your First AWS Account: Critical Day-One Configurations",
    "secure-m365-10-settings-smes-review-first.mdx": "Microsoft 365 Security: 10 Settings Every SME Must Review First",
    "secure-microsoft-365-tenant-one-afternoon.mdx": "How to Secure Your Microsoft 365 Tenant in a Single Afternoon",
    "security-audit-checklist-review-before-consultant.mdx": "Pre-Audit Checklist: What to Review Before the Security Consultant Arrives",
    "sme-incident-response-playbook-contain-communicate-recover.mdx": "The SME Incident Response Playbook: Contain, Communicate, and Recover",
    "sme-security-audit-checklist-30-days.mdx": "The 30-Day Security Audit Checklist: Achieving Better Visibility for SMEs",
    "soc-alert-triage-playbook-small-teams.mdx": "SOC Alert Triage Playbook: Streamlining Operations for Small Teams",
    "soc-alert-triage-workflow-small-it-teams.mdx": "Designing an Effective SOC Alert Triage Workflow for Small IT Teams",
    "soc-alerts-triage-playbook-small-it-teams.mdx": "The Definitive SOC Alerts Triage Playbook for Small IT Teams",
    "soc-noise-reduction-checklist-smes-first-30-days.mdx": "SOC Noise Reduction Checklist: Optimizing Alerts in Your First 30 Days",
    "soc-onboarding-checklist-smes-alerts-reporting.mdx": "SOC Onboarding Checklist for SMEs: Configuring Alerts and Reporting",
    "soc-playbook-smes-triage-phishing-alerts-15-minutes.mdx": "SOC Playbook: How to Triage Phishing Alerts in Under 15 Minutes",
    "soc-playbook-triage-escalate-sme-alerts.mdx": "SOC Playbook: Best Practices for Triaging and Escalating Security Alerts",
    "soc-triage-checklist-smes-alert-escalation.mdx": "SOC Triage Checklist: Mastering Alert Escalation for SMEs",
    "soc-triage-checklist-smes-reduce-alert-noise-fast.mdx": "SOC Triage Checklist: How to Reduce Alert Noise Fast and Effectively"
}

for filename, new_title in title_updates.items():
    filepath = os.path.join(blog_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace the title in the metadata
        new_content = re.sub(r'title:\s*".*?"', f'title: "{new_title}"', content, count=1)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filename}")

# Now let's update the French overrides
fr_overrides_path = "scripts/blog_title_overrides.fr.json"
fr_titles = {
    "30-question-security-audit-checklist-sme-it-managers": "La checklist d'audit de sécurité en 30 points pour les DSI de PME",
    "audit-evidence-template-collect-map-track": "Guide des preuves d'audit : Comment collecter, cartographier et suivre la conformité",
    "audit-evidence-template-map-risks-proof-fixes": "Cartographie des risques de sécurité : Guide pratique pour prouver la remédiation",
    "build-practical-soc-smes-monitor-run": "Construire un SOC pratique pour les PME : De la supervision à l'exécution",
    "cloud-cutover-runbook-waves-go-live-hypercare": "Le Runbook ultime de bascule Cloud : Stratégies de Go-Live et d'Hypercare",
    "cloud-migration-cutover-runbook-small-it-team": "Bascule de migration Cloud : Un Runbook étape par étape pour les petites équipes IT",
    "cloud-migration-cutover-runbook-steps-roles-hypercare": "Maîtriser les migrations Cloud : Étapes essentielles, rôles et Hypercare",
    "cloud-migration-runbook-waves-cutover-hypercare": "Structurer votre migration Cloud : Vagues, bascule et support post-lancement",
    "cloud-misconfigurations-catch-first-microsoft-365-aws": "Les pires erreurs de configuration Cloud à corriger immédiatement sur Microsoft 365 et AWS",
    "cloud-misconfigurations-smes-storage-iam-basics": "Sécuriser le stockage Cloud et l'IAM : Configurations essentielles pour les PME",
    "internal-security-audit-checklist-small-it-teams": "La checklist complète d'audit de sécurité interne pour les petites équipes IT",
    "it-security-audit-prep-20-evidence-items-gather-now": "Préparation à l'audit de sécurité IT : 20 éléments de preuve cruciaux à rassembler aujourd'hui",
    "run-security-audit-new-saas-apps-60-minutes": "Comment réaliser un audit de sécurité sur de nouvelles applications SaaS en 60 minutes",
    "secure-first-aws-account-day-one-settings": "Sécuriser votre premier compte AWS : Configurations critiques du premier jour",
    "secure-m365-10-settings-smes-review-first": "Sécurité Microsoft 365 : 10 paramètres que chaque PME doit vérifier en priorité",
    "secure-microsoft-365-tenant-one-afternoon": "Comment sécuriser votre environnement Microsoft 365 en un seul après-midi",
    "security-audit-checklist-review-before-consultant": "Checklist pré-audit : Ce qu'il faut vérifier avant l'arrivée du consultant en sécurité",
    "sme-incident-response-playbook-contain-communicate-recover": "Le Playbook de réponse aux incidents pour PME : Contenir, communiquer et récupérer",
    "sme-security-audit-checklist-30-days": "La checklist d'audit de sécurité en 30 jours : Obtenir une meilleure visibilité pour les PME",
    "soc-alert-triage-playbook-small-teams": "Playbook de triage des alertes SOC : Rationaliser les opérations pour les petites équipes",
    "soc-alert-triage-workflow-small-it-teams": "Concevoir un workflow efficace de triage des alertes SOC pour les petites équipes IT",
    "soc-alerts-triage-playbook-small-it-teams": "Le Playbook définitif de triage des alertes SOC pour les petites équipes IT",
    "soc-noise-reduction-checklist-smes-first-30-days": "Checklist de réduction du bruit SOC : Optimiser les alertes lors de vos 30 premiers jours",
    "soc-onboarding-checklist-smes-alerts-reporting": "Checklist d'intégration SOC pour les PME : Configuration des alertes et du reporting",
    "soc-playbook-smes-triage-phishing-alerts-15-minutes": "Playbook SOC : Comment trier les alertes de phishing en moins de 15 minutes",
    "soc-playbook-triage-escalate-sme-alerts": "Playbook SOC : Bonnes pratiques pour le triage et l'escalade des alertes de sécurité",
    "soc-triage-checklist-smes-alert-escalation": "Checklist de triage SOC : Maîtriser l'escalade des alertes pour les PME",
    "soc-triage-checklist-smes-reduce-alert-noise-fast": "Checklist de triage SOC : Comment réduire le bruit des alertes rapidement et efficacement"
}

with open(fr_overrides_path, "w", encoding="utf-8") as f:
    json.dump(fr_titles, f, indent=2, ensure_ascii=False)
print("Updated French overrides")
