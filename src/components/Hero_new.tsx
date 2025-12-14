"use client";

import { Container } from "@/components/Container";
import { AuditForm } from "@/components/AuditForm";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Container className="flex flex-col lg:flex-row gap-12 items-start py-16 lg:py-28">
      {/* Left Column: Text Content & Benefits */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-gray-900 lg:leading-tight dark:text-white mb-6">
          {t.hero_title}
        </h1>
        <p className="text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
          {t.hero_desc}
        </p>

        {/* Benefits List */}
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5 flex-none">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 pt-0.5">{t.hero_benefit1}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5 flex-none">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 pt-0.5">{t.hero_benefit2}</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5 flex-none">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300 pt-0.5">{t.hero_benefit3}</span>
          </li>
        </ul>
      </div>

      {/* Right Column: Audit Form Card */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t.hero_audit_title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-8">
            {t.hero_audit_desc}
          </p>

          {/* Audit Form Component */}
          <AuditForm />

          {/* Secondary CTA: Schedule Call */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {t.hero_call_to_action}
            </p>
            <a
              href="https://calendly.com/skynet-consulting-dz/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              {t.hero_schedule_call}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};
