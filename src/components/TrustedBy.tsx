import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";

const logos = [
  { name: "Elastic", placeholder: "Elastic" },
  { name: "Azure", placeholder: "Azure" },
  { name: "AWS", placeholder: "AWS" },
  { name: "GCP", placeholder: "GCP" },
  { name: "FinTech Group", placeholder: "FinTech" },
  { name: "Public Sector", placeholder: "Public" },
];

export const TrustedBy = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Container>
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold">
            {language === "en" ? "Trusted by" : "Ils nous font confiance"}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {language === "en"
              ? "Enterprises, public sector and critical operators"
              : "Entreprises, secteur public et opérateurs critiques"}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="h-16 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/60 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-200"
            >
              {logo.placeholder}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
