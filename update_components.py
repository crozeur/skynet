import os
import glob

replacements = [
    (
        '"Protect Your Critical Infrastructure with Confidence"',
        '"Enterprise-Grade Cybersecurity, Powered by AI & Automation"'
    ),
    (
        '"24/7 threat monitoring and response by our SOC, end-to-end security audits, and strategic guidance. A holistic approach to secure, audit, and govern your cybersecurity."',
        '"We democratize high-end security for SMEs and agile enterprises. Our AI-driven execution platform and ephemeral infrastructure deliver Senior-level audits and cloud migrations at a fraction of the traditional cost."'
    ),
    (
        '"Continuous monitoring by our Security Operations Center (SOC) and 24/7 threat response assisted by AI"',
        '"AI-Augmented Execution: Senior expertise delivered flawlessly on-site via our proprietary AI playbooks"'
    ),
    (
        '"Security audits and compliance assessments across your entire information system"',
        '"Zero-Trace Infrastructure: 1 Mission = 1 Ephemeral VM. Total data isolation and absolute security"'
    ),
    (
        '"Expert consulting and strategy tailored to all sectors and organization sizes"',
        '"Cost-Effective Excellence: Big 4 quality audits and migrations, accessible to mid-market budgets"'
    ),
    (
        '"24/7 Surveillance & Response - External SOC"',
        '"AI-Augmented Security Audits & Pentesting"'
    ),
    (
        '"Ministries, banks, large enterprises, and operators of vital importance (OIV)"',
        '"SMEs, Mid-market companies (ETIs), and Startups needing enterprise-grade security validation"'
    ),
    (
        '"Without centralized monitoring or formal incident response, attacks stay undetected for days. Compromises surface too late, lateral movement slips through, data is exfiltrated. Lack of 24/7 coverage allows threats to persist inside the environment."',
        '"Traditional audits are prohibitively expensive, slow, and rely on consultants who leave with your context. SMEs are priced out of high-quality security assessments."'
    ),
    (
        '"Rapid deployment of an AI-powered external SOC with global coverage:"',
        '"Our AI Brain guides certified field operators step-by-step, ensuring exhaustive, standardized, and flawless execution:"'
    ),
    (
        '"24/7 monitoring of all servers, networks, firewalls, and critical applications"',
        '"Automated vulnerability scanning and Active Directory audits"'
    ),
    (
        '"Automatic threat detection with instant alerts"',
        '"Physical and logical security assessments guided by AI playbooks"'
    ),
    (
        '"Immediate attack containment and response"',
        '"Real-time transcription and automated, audit-ready reporting"'
    ),
    (
        '"French-language reporting with incident analysis and recommendations"',
        '"Zero-trace execution: all tools run from isolated, ephemeral environments"'
    ),
    (
        '"Sovereign hosting option (local cloud or secure data center)"',
        '"Actionable 90-day remediation plan generated instantly"'
    ),
    (
        '"90% of attacks automatically stopped"',
        '"Senior-level audit quality at a highly competitive price"'
    ),
    (
        '"Detection time reduced from days to <2 minutes"',
        '"Standardized, bias-free security assessment"'
    ),
    (
        '"Reduced regulatory risk (banking, data protection, and cybersecurity compliance worldwide)"',
        '"Immediate delivery of actionable reports"'
    ),
    (
        '"Continuous oversight by our analysts, 24/7"',
        '"Absolute data confidentiality"'
    ),
    (
        '"From ,000/month for SMBs/ministries, average ,000-,000/month"',
        '"From ,000 for comprehensive SME audits"'
    ),
    (
        '"Cybersecurity Audit & Compliance"',
        '"Secure Cloud Migrations & Ephemeral Infrastructure"'
    ),
    (
        '"Administrations, banks, healthcare, energy  any organization that must demonstrate the security of its information systems (ISO 27001, PCI-DSS, GDPR, regulatory requirements)"',
        '"Companies looking to modernize their IT or require ultra-secure, isolated environments"'
    ),
    (
        '"Internal audits often lack technical depth and tangible evidence (networks, systems, applications, sensitive data). Resilience against attacks is not demonstrated, and compliance with key frameworks (ISO 27001, PCI-DSS, GDPR) has not been validated."',
        '"Cloud migrations are risky and complex. Furthermore, traditional consulting leaves behind residual data and access, creating long-term security risks."'
    ),
    (
        '"What we deliver in practice:"',
        '"We use Infrastructure as Code (Terraform) to build, migrate, and destroy environments with military-grade precision:"'
    ),
    (
        '"Full cybersecurity audit (technical + organizational) with penetration testing and control review"',
        '"1 Client = 1 Dedicated, Ephemeral Virtual Machine"'
    ),
    (
        '"Mapping of sensitive data, access, and vulnerabilities aligned to ISO 27001, PCI-DSS, and GDPR"',
        '"Automated cloud architecture deployment (AWS, Azure, GCP)"'
    ),
    (
        '"90-day action plan to remediate critical risks with local teams"',
        '"Secure data migration with zero residual footprint"'
    ),
    (
        '"Security awareness (phishing, best practices) and remediation support"',
        '"Guaranteed GDPR/ISO compliance through Right to be Forgotten by design"'
    ),
    (
        '"Clear view of priority cyber risks and real exposure to attacks"',
        '"Flawless, automated cloud transitions"'
    ),
    (
        '"Compliance trajectory (ISO 27001 / PCI-DSS / GDPR) understandable by IT and leadership"',
        '"Zero risk of cross-client data contamination"'
    ),
    (
        '"Stronger credibility with governance bodies and customers"',
        '"Infrastructure that is secure by design"'
    ),
    (
        '"From ,000-,000, up to ,000 for multi-site administrations"',
        '"From ,000 depending on infrastructure complexity"'
    ),
    (
        '"Cloud Modernization & Cost Optimization (FinOps)"',
        '"Continuous Compliance & Automated FinOps"'
    ),
    (
        '"Private groups, OIV, public institutions  organizations aiming to modernize their infrastructure or optimize IT costs"',
        '"Growing businesses needing to maintain ISO 27001, SOC 2, or GDPR compliance while controlling cloud costs"'
    ),
    (
        '"Costly and aging infrastructure (on-prem, aging hardware, fragmented cloud); complex migrations slowed by technical debt, critical business dependencies, and hidden costs (licensing, maintenance, under-optimized cloud)."',
        '"Maintaining compliance and managing cloud costs requires constant manual effort, leading to drift, audit failures, and budget overruns."'
    ),
    (
        '"Rapid assessment and modernization:"',
        '"Our platform continuously monitors your posture and costs, automatically generating the evidence you need:"'
    ),
    (
        '"Express diagnostic of infrastructure (on-premise and cloud)"',
        '"Automated evidence collection for ISO 27001 and SOC 2"'
    ),
    (
        '"Progressive migration (sovereign or hybrid cloud) with security"',
        '"Real-time cloud cost optimization (FinOps) dashboards"'
    ),
    (
        '"Cost dashboards with immediate waste identification"',
        '"AI-generated remediation scripts for compliance drift"'
    ),
    (
        '"Clear visibility of costs and waste"',
        '"Always audit-ready for compliance frameworks"'
    ),
    (
        '"Operational costs reduced by 3040%"',
        '"Cloud costs reduced by up to 40%"'
    ),
    (
        '"Modernized and secured infrastructure for digital transformation"',
        '"Freed-up internal IT resources"'
    ),
    (
        '"From ,000,000 depending on complexity"',
        '"From ,000/month for continuous governance"'
    ),
    (
        '"Enterprise-Grade Security for Every Business"',
        '"The Cybertech Revolutionizing IT Consulting"'
    ),
    (
        '"Skynet Consulting combines 24/7 SOC monitoring, AI-driven threat detection, and expert incident response to protect your organization from evolving cyber threats."',
        '"Skynet Consulting replaces the outdated, expensive traditional consulting model with an AI-powered execution platform, delivering unmatched security, speed, and cost-efficiency."'
    ),
    (
        '"24/7 Security Operations Center"',
        '"The Skynet AI Brain"'
    ),
    (
        '"Our expert SOC team monitors your infrastructure around the clock, detecting and investigating suspicious activities in real-time."',
        '"Our proprietary AI contains decades of senior cybersecurity expertise, guiding our field operators flawlessly through every mission."'
    ),
    (
        '"AI-Powered Threat Detection"',
        '"Ephemeral Infrastructure"'
    ),
    (
        '"Advanced machine learning algorithms detect anomalies and threats that traditional security tools miss."',
        '"We deploy a dedicated, isolated environment for your mission and destroy it upon completion. Zero trace, absolute security."'
    ),
    (
        '"Rapid Incident Response"',
        '"Unbeatable ROI"'
    ),
    (
        '"When threats are identified, our team responds within minutes to contain and remediate the incident."',
        '"By automating the expertise and standardizing the execution, we deliver Big 4 quality at a fraction of the cost."'
    ),
    (
        '"A Managed Security Service Provider runs threat monitoring, detection, and response for you. Skynet delivers 24/7 SOC, incident response, audits, and compliance support without requiring you to build the entire capability in-house."',
        '"Our field operators use a secure, locked-down interface to communicate with our AI Brain. The AI provides step-by-step playbooks, generates custom scripts on the fly, and compiles the final report, ensuring senior-level quality on every mission."'
    ),
    (
        '"Detection to action in minutes. Median response time < 15 minutes, with critical containment started immediately by our SOC engineers (24/7)."',
        '"For every client mission, we automatically provision a dedicated Virtual Machine. All tools, data, and analysis happen there. Once the mission is over, the VM is permanently destroyed, guaranteeing total data isolation and security."'
    ),
    (
        '"Mid-market and enterprise teams that need strong security without hiring a full internal SOC. We also support regulated sectors (finance, healthcare, energy, public) with compliance evidence."',
        '"SMEs, ETIs, and agile enterprises that need high-end cybersecurity audits, cloud migrations, or compliance support, but find traditional consulting firms too slow or expensive."'
    )
]

for filepath in glob.glob('src/components/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for old, new in replacements:
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

print("Done updating components.")
