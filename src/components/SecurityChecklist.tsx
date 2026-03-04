"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { useLanguage } from "./LanguageProvider";

export const SecurityChecklist = () => {
  const { language } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});

  const content = {
    fr: {
      title: "Êtes-vous vraiment prêt face aux cyberattaques ?",
      subtitle: "Checklist posture cybersécurité",
      questions: [
        {
          id: 1,
          text: "Vos données critiques sont-elles sauvegardées quotidiennement et pouvez-vous les restaurer en moins de 24 heures ?",
          label: "Sauvegardes régulières et testées",
          icon: "💾",
        },
        {
          id: 2,
          text: "Les accès à vos systèmes critiques sont-ils protégés par une double authentification (MFA) ?",
          label: "Authentification forte (MFA)",
          icon: "🔐",
        },
        {
          id: 3,
          text: "Vos serveurs, postes de travail et équipements réseau sont-ils systématiquement mis à jour avec les derniers correctifs ?",
          label: "Mises à jour et correctifs de sécurité",
          icon: "🔄",
        },
        {
          id: 4,
          text: "Disposez-vous d'un système de monitoring actif 24/7 pour détecter les comportements anormaux ?",
          label: "Supervision des journaux et détection d'incidents",
          icon: "👁️",
        },
        {
          id: 5,
          text: "Avez-vous un plan documenté et testé pour réagir rapidement en cas de cyberattaque ?",
          label: "Plan de réponse à incident",
          icon: "⚡",
        },
        {
          id: 6,
          text: "Vos employés sont-ils régulièrement formés aux risques cyber (phishing, mots de passe, ingénierie sociale) ?",
          label: "Sensibilisation et formation des utilisateurs",
          icon: "👥",
        },
        {
          id: 7,
          text: "Les droits d'accès sont-ils limités au strict nécessaire, avec revue régulière des comptes ?",
          label: "Gestion stricte des accès et des privilèges",
          icon: "🗝️",
        },
        {
          id: 8,
          text: "Êtes-vous en conformité avec les obligations légales applicables à votre secteur ?",
          label: "Conformité avec les exigences réglementaires",
          icon: "⚖️",
        },
      ],
      conclusion:
        "Si vous avez répondu \"Non\" à plusieurs de ces questions, votre organisation est exposée à des risques cyber majeurs. Une seule faille peut suffire à compromettre l'ensemble de vos systèmes.",
      solution:
        "Skynet Consulting réalise des audits de sécurité complets pour identifier vos vulnérabilités et vous proposer un plan d'actions concret. Notre plateforme d'exécution IA permet de corriger ces points faibles rapidement et à moindre coût.",
      cta: "Contactez nos équipes dès maintenant. Nous analysons votre posture actuelle et vous proposons un accompagnement sur-mesure.",
    },
    en: {
      title: "Are you really prepared for cyberattacks?",
      subtitle: "Cybersecurity posture checklist",
      questions: [
        {
          id: 1,
          text: "Is your critical data backed up daily and can you restore it in less than 24 hours?",
          label: "Regular and tested backups",
          icon: "💾",
        },
        {
          id: 2,
          text: "Are accesses to your critical systems protected by multi-factor authentication (MFA)?",
          label: "Strong authentication (MFA)",
          icon: "🔐",
        },
        {
          id: 3,
          text: "Are your servers, workstations and network equipment systematically updated with the latest security patches?",
          label: "Security updates and patches",
          icon: "🔄",
        },
        {
          id: 4,
          text: "Do you have an active 24/7 monitoring system to detect abnormal behaviors?",
          label: "Log monitoring and incident detection",
          icon: "👁️",
        },
        {
          id: 5,
          text: "Do you have a documented and tested plan to respond quickly to a cyberattack?",
          label: "Incident response plan",
          icon: "⚡",
        },
        {
          id: 6,
          text: "Are your employees regularly trained on cyber risks (phishing, passwords, social engineering)?",
          label: "User awareness and training",
          icon: "👥",
        },
        {
          id: 7,
          text: "Are access rights limited to the strict minimum, with regular account reviews?",
          label: "Strict access and privilege management",
          icon: "🗝️",
        },
        {
          id: 8,
          text: "Are you compliant with the legal obligations applicable to your sector?",
          label: "Compliance with regulatory requirements",
          icon: "⚖️",
        },
      ],
      conclusion:
        'If you answered "No" to several of these questions, your organization is exposed to major cyber risks. A single vulnerability can compromise your entire system.',
      solution:
        "Skynet Consulting conducts comprehensive security audits to identify your vulnerabilities and propose concrete action plans. Our AI-augmented execution platform addresses these weaknesses quickly and cost-effectively.",
      cta: "Contact our teams now. We analyze your current posture and provide tailored guidance.",
    },
  };

  const t = content[language];

  const handleAnswer = (id: number, value: boolean) => {
    setAnswers({ ...answers, [id]: value });
  };

  const noCount = Object.values(answers).filter((a) => a === false).length;
  const totalAnswered = Object.values(answers).filter((a) => a !== null).length;
  const yesCount = Object.values(answers).filter((a) => a === true).length;
  const score = totalAnswered > 0 ? Math.round((yesCount / totalAnswered) * 100) : 0;

  return (
    <Container className="py-14 lg:py-16">
      <SectionTitle title={t.title} preTitle={t.subtitle} />

      {/* Questions */}
      <div className="max-w-4xl mx-auto mt-12 space-y-4">
        {t.questions.map((question, idx) => (
          <div
            key={question.id}
            className={`
              group relative overflow-hidden rounded-xl backdrop-blur-sm
              border transition-all duration-300
              ${
                answers[question.id] === true
                  ? "bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700/50 shadow-md shadow-slate-200/50"
                  : answers[question.id] === false
                    ? "bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 border-red-300 dark:border-red-700/50 shadow-md shadow-slate-200/50"
                    : "bg-white/90 dark:bg-gray-800/50 border-slate-200/80 dark:border-gray-700/50 hover:border-slate-300/80 dark:hover:border-blue-700/50 hover:shadow-md hover:shadow-slate-300/50 shadow-sm shadow-slate-200/50"
              }
              p-6
            `}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-colors duration-300 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl flex-shrink-0 mt-1 inline-block transition-transform duration-300 group-hover:scale-110">
                  {question.icon}
                </span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {question.label}
                  </h4>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed text-sm">
                {question.text}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(question.id, true)}
                  className={`
                    relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 active:scale-95
                    overflow-hidden group/btn
                    ${
                      answers[question.id] === true
                        ? "bg-green-600 text-white shadow-lg shadow-green-500/50"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/40 hover:text-green-700 dark:hover:text-green-300"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {language === "fr" ? "Oui ✓" : "Yes ✓"}
                  </span>
                  {answers[question.id] === true && (
                    <div className="absolute inset-0 bg-green-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleAnswer(question.id, false)}
                  className={`
                    relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 active:scale-95
                    overflow-hidden group/btn
                    ${
                      answers[question.id] === false
                        ? "bg-red-600 text-white shadow-lg shadow-red-500/50"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {language === "fr" ? "Non ✗" : "No ✗"}
                  </span>
                  {answers[question.id] === false && (
                    <div className="absolute inset-0 bg-red-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {totalAnswered > 0 && (
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white/90 dark:bg-gray-800/50 rounded-2xl p-8 border border-slate-200/80 dark:border-gray-700/50 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === "fr" ? "Votre score de sécurité" : "Your security score"}
              </h3>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {score}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 80
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : score >= 50
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-red-500 to-rose-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {totalAnswered}/{t.questions.length} {language === "fr" ? "questions répondues" : "questions answered"}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {totalAnswered > 0 && (
        <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {noCount >= 3 ? (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-8 rounded-2xl border-2 border-red-500/50 dark:border-red-700/50 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">
                    {language === "fr"
                      ? `${noCount} réponse${noCount > 1 ? "s" : ""} "Non" - Attention !`
                      : `${noCount} "No" answer${noCount > 1 ? "s" : ""} - Critical!`}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {t.conclusion}
                  </p>
                </div>
              </div>
            </div>
          ) : noCount > 0 ? (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-8 rounded-2xl border-2 border-yellow-500/50 dark:border-yellow-700/50 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">⚡</span>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                    {language === "fr"
                      ? "Quelques points à améliorer"
                      : "Some areas need improvement"}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {language === "fr"
                      ? "Vous avez une base solide, mais certains aspects de votre sécurité méritent d'être renforcés pour maximiser votre protection."
                      : "You have a solid foundation, but some security aspects need strengthening to maximize your protection."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border-2 border-green-500/50 dark:border-green-700/50 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-2">
                    {language === "fr" ? "Excellente posture !" : "Excellent posture!"}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {language === "fr"
                      ? "Félicitations ! Votre organisation semble bien protégée contre les risques cyber majeurs. Un audit régulier reste recommandé pour maintenir ce niveau."
                      : "Congratulations! Your organization appears well protected against major cyber risks. Regular audits are still recommended to maintain this level."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conclusion & CTA */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed font-medium">
          {t.solution}
        </p>
        <div className="bg-white/90 dark:from-blue-900/20 dark:to-indigo-900/20 border border-slate-200/80 dark:border-blue-800/50 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
          <p className="text-lg font-semibold text-slate-800 dark:text-blue-300 leading-relaxed">
            {t.cta}
          </p>
        </div>
      </div>
    </Container>
  );
};
