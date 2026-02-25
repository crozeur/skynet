import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";

const badges = [
  { name: "SOC 2", desc: "Controls & assurance", level: "Attestation" },
  { name: "ISO 27001", desc: "Information security", level: "In progress" },
  { name: "GDPR", desc: "Data protection", level: "Compliant" },
  { name: "Elastic Verified MSP", desc: "Managed services", level: "Verified" },
];

export const Certifications = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-slate-50 dark:bg-gray-900">
      <Container>
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold">
            {language === "en" ? "Certifications" : "Certifications"}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {language === "en"
              ? "Security and compliance you can audit"
              : "Sécurité et conformité auditables"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-3xl mx-auto">
            {language === "en"
              ? "We align with leading standards so you can trust our controls and documentation."
              : "Nous nous alignons sur les principaux standards pour garantir des contrôles et une documentation fiables."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="rounded-lg border border-slate-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-800/60 p-4 shadow-sm shadow-slate-200/50"
            >
              <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300 font-semibold mb-1">{badge.name}</p>
              <p className="text-gray-900 dark:text-white font-semibold">{badge.desc}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.level}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
