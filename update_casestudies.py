import os

with open('src/components/CaseStudies.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'Services financiers | SOC externalisé 24/7',
    'Services financiers | Audit Augmenté par l\'IA'
)
content = content.replace(
    'Déploiement d\'un SOC externalisé 24/7 avec monitoring complet et détection IA',
    'Audit de sécurité complet et migration Cloud via infrastructure éphémère'
)
content = content.replace(
    'SOC hybride 24/7 pour tous les sites, support multilingue',
    'Exécution standardisée sur tous les sites via nos playbooks IA'
)
content = content.replace(
    'Financial Services | 24/7 Managed SOC',
    'Financial Services | AI-Augmented Audit'
)
content = content.replace(
    '24/7 managed SOC deployment with full monitoring and AI detection',
    'Comprehensive security audit and Cloud migration via ephemeral infrastructure'
)
content = content.replace(
    '24/7 hybrid SOC for all sites, multilingual support',
    'Standardized execution across all sites via our AI playbooks'
)

with open('src/components/CaseStudies.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating CaseStudies.")
