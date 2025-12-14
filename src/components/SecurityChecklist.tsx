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
        },
        {
          id: 2,
          text: "Les accès à vos systèmes critiques sont-ils protégés par une double authentification (MFA) ?",
          label: "Authentification forte (MFA)",
        },
        {
          id: 3,
          text: "Vos serveurs, postes de travail et équipements réseau sont-ils systématiquement mis à jour avec les derniers correctifs ?",
          label: "Mises à jour et correctifs de sécurité",
        },
        {
          id: 4,
          text: "Disposez-vous d'un système de monitoring actif 24/7 pour détecter les comportements anormaux ?",
          label: "Supervision des journaux et détection d'incidents",
        },
        {
          id: 5,
          text: "Avez-vous un plan documenté et testé pour réagir rapidement en cas de cyberattaque ?",
          label: "Plan de réponse à incident",
        },
        {
          id: 6,
          text: "Vos employés sont-ils régulièrement formés aux risques cyber (phishing, mots de passe, ingénierie sociale) ?",
          label: "Sensibilisation et formation des utilisateurs",
        },
        {
          id: 7,
          text: "Les droits d'accès sont-ils limités au strict nécessaire, avec revue régulière des comptes ?",
          label: "Gestion stricte des accès et des privilèges",
        },
        {
          id: 8,
          text: "Êtes-vous en conformité avec les obligations légales applicables à votre secteur ?",
          label: "Conformité avec les exigences réglementaires",
        },
      ],
      conclusion:
        "Si vous avez répondu \"Non\" à plusieurs de ces questions, votre organisation est exposée à des risques cyber majeurs. Une seule faille peut suffire à compromettre l'ensemble de vos systèmes.",
      solution:
        "Skynet Consulting réalise des audits de sécurité complets pour identifier vos vulnérabilités et vous proposer un plan d'actions concret. Nos solutions de SOC externalisé 24/7 permettent de corriger ces points faibles.",
      cta: "Demandez dès maintenant un audit de sécurité gratuit en laissant votre email. Nous analysons votre posture actuelle et vous envoyons des recommandations concrètes par email sous 48 heures.",
    },
    en: {
      title: "Are you really prepared for cyberattacks?",
      subtitle: "Cybersecurity posture checklist",
      questions: [
        {
          id: 1,
          text: "Is your critical data backed up daily and can you restore it in less than 24 hours?",
          label: "Regular and tested backups",
        },
        {
          id: 2,
          text: "Are accesses to your critical systems protected by multi-factor authentication (MFA)?",
          label: "Strong authentication (MFA)",
        },
        {
          id: 3,
          text: "Are your servers, workstations and network equipment systematically updated with the latest security patches?",
          label: "Security updates and patches",
        },
        {
          id: 4,
          text: "Do you have an active 24/7 monitoring system to detect abnormal behaviors?",
          label: "Log monitoring and incident detection",
        },
        {
          id: 5,
          text: "Do you have a documented and tested plan to respond quickly to a cyberattack?",
          label: "Incident response plan",
        },
        {
          id: 6,
          text: "Are your employees regularly trained on cyber risks (phishing, passwords, social engineering)?",
          label: "User awareness and training",
        },
        {
          id: 7,
          text: "Are access rights limited to the strict minimum, with regular account reviews?",
          label: "Strict access and privilege management",
        },
        {
          id: 8,
          text: "Are you compliant with the legal obligations applicable to your sector?",
          label: "Compliance with regulatory requirements",
        },
      ],
      conclusion:
        'If you answered "No" to several of these questions, your organization is exposed to major cyber risks. A single vulnerability can compromise your entire system.',
      solution:
        "Skynet Consulting conducts comprehensive security audits to identify your vulnerabilities and propose concrete action plans. Our 24/7 managed SOC solutions address these weaknesses.",
      cta: "Request a free security audit now by leaving your email. We analyze your current posture and send you concrete recommendations by email within 48 hours.",
    },
  };

  const t = content[language];

  const handleAnswer = (id: number, value: boolean) => {
    setAnswers({ ...answers, [id]: value });
  };

  const noCount = Object.values(answers).filter((a) => a === false).length;
  const totalAnswered = Object.values(answers).filter((a) => a !== null).length;

  return (
    <Container className="py-14 lg:py-16">
      <SectionTitle title={t.title} preTitle={t.subtitle} />

      {/* Questions */}
      <div className="max-w-4xl mx-auto mt-12 space-y-6">
        {t.questions.map((question) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {question.label}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{question.text}</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(question.id, true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  answers[question.id] === true
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                }`}
              >
                {language === "fr" ? "Oui ✓" : "Yes ✓"}
              </button>
              <button
                onClick={() => handleAnswer(question.id, false)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  answers[question.id] === false
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                }`}
              >
                {language === "fr" ? "Non ✗" : "No ✗"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {totalAnswered > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          {noCount >= 3 ? (
            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border-2 border-red-600 dark:border-red-500">
              <div className="flex items-start gap-4">
                <span className="text-5xl">⚠️</span>
                <div>
                  <h3 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-3">
                    {language === "fr"
                      ? `${noCount} réponse${noCount > 1 ? "s" : ""} "Non" - Attention !`
                      : `${noCount} "No" answer${noCount > 1 ? "s" : ""} - Warning!`}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {t.conclusion}
                  </p>
                </div>
              </div>
            </div>
          ) : noCount > 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-8 rounded-2xl border-2 border-yellow-600 dark:border-yellow-500">
              <div className="flex items-start gap-4">
                <span className="text-5xl">⚡</span>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-900 dark:text-yellow-400 mb-3">
                    {language === "fr"
                      ? "Quelques points à améliorer"
                      : "Some areas need improvement"}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    {language === "fr"
                      ? "Vous avez une base solide, mais certains aspects de votre sécurité méritent d'être renforcés."
                      : "You have a solid foundation, but some aspects of your security need strengthening."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-2xl border-2 border-green-600 dark:border-green-500">
              <div className="flex items-start gap-4">
                <span className="text-5xl">✓</span>
                <div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-3">
                    {language === "fr" ? "Excellente posture !" : "Excellent posture!"}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">
                    {language === "fr"
                      ? "Félicitations ! Votre organisation semble bien protégée. Un audit régulier reste recommandé."
                      : "Congratulations! Your organization appears well protected. Regular audits are still recommended."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conclusion & CTA */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {t.solution}
        </p>
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          {t.cta}
        </p>
      </div>
    </Container>
  );
};
