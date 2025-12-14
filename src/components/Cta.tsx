"use client";

import React from "react";
import { Container } from "@/components/Container";
import { translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";

export const Cta = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      <Container>
        {/* Background Effects */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <div className="w-full max-w-6xl h-96 bg-gradient-to-r from-blue-500/20 via-cyan-400/15 to-blue-600/20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Decorative blur elements */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 rounded-3xl border-2 border-blue-200 dark:border-blue-800 shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-[200px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-tr-[200px]"></div>

            <div className="relative px-8 py-12 lg:px-16 lg:py-16">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-full border border-blue-200 dark:border-blue-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      {language === "en" ? "🔒 Security Assessment" : "🔒 Évaluation Sécurité"}
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {language === "en" ? "Ready to secure your organization?" : "Prêt à sécuriser votre organisation ?"}
                  </h2>

                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {language === "en"
                      ? "Our experts evaluate your posture and deliver a tailored protection plan with clear priorities."
                      : "Nos experts évaluent votre posture et livrent un plan de protection sur-mesure avec des priorités claires."}
                  </p>

                  <div className="grid gap-4 pt-4">
                    {[
                      { 
                        icon: "✓",
                        text: language === "en" ? "Expert-led security evaluation" : "Évaluation de sécurité par nos experts"
                      },
                      { 
                        icon: "✓",
                        text: language === "en" ? "Actionable, prioritized recommendations" : "Recommandations concrètes et priorisées"
                      },
                      { 
                        icon: "✓",
                        text: language === "en" ? "Clear 90-day implementation roadmap" : "Feuille de route 90 jours claire"
                      },
                      { 
                        icon: "✓",
                        text: language === "en" ? "Risk assessment & compliance check" : "Évaluation des risques et conformité"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-700 group-hover:scale-110 transition-transform">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{item.icon}</span>
                        </div>
                        <span className="text-base text-gray-800 dark:text-gray-200 font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right CTA */}
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-xl space-y-6">
                    <div className="space-y-4">
                      <a
                        href="https://calendly.com/skynet-consulting-dz/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative">{language === "en" ? "Schedule a discovery call" : "Planifier un appel de découverte"}</span>
                        <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{language === "en" ? "Free 30-minute consultation" : "Consultation gratuite de 30 minutes"}</span>
                      </div>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                        {language === "en" ? "No obligations • Immediate scheduling" : "Sans engagement • Planification immédiate"}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                          {language === "en" ? "Or" : "Ou"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="mailto:skynet.consulting.dz@email.com"
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {language === "en" ? "Contact us by email" : "Nous contacter par email"}
                      </a>
                      <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                        {language === "en" ? "Response within 24 hours" : "Réponse sous 24 heures"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
