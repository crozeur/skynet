import {
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  ArchiveBoxIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";

const benefitOne = {
  title: "Why Skynet?",
  desc: "Skynet delivers enterprise-grade security capabilities specifically designed for SMBs and mid-market organizations. Our AI-powered platform provides continuous monitoring, rapid threat detection, and expert-led incident response.",
  bullets: [
    {
      title: "AI-Augmented Execution",
      desc: "Round-the-clock security operations center staffed by certified analysts monitoring your environment.",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "AI-Powered Threat Detection",
      desc: "Advanced machine learning algorithms detect known and unknown threats in real-time.",
      icon: <SparklesIcon />,
    },
    {
      title: "Fast Incident Response",
      desc: "Immediate containment and remediation when threats are detected, minimizing impact.",
      icon: <BoltIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Our MSSP Services",
  desc: "Comprehensive security services to protect your organization from evolving cyber threats. From detection to response, we've got you covered.",
  bullets: [
    {
      title: "Managed Detection & Response (MDR)",
      desc: "24/7 monitoring, threat hunting, and rapid incident response from our expert team.",
      icon: <EyeIcon />,
    },
    {
      title: "Threat Hunting & Intelligence",
      desc: "Proactive hunting for advanced threats and continuous threat intelligence feeds.",
      icon: <ArchiveBoxIcon />,
    },
    {
      title: "Vulnerability & Compliance Management",
      desc: "Identify, prioritize, and remediate vulnerabilities while maintaining compliance standards.",
      icon: <GlobeAltIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
