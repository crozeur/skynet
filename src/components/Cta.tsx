"use client";

import React from "react";
import { Container } from "@/components/Container";
import { translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";

export const Cta = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="secure-channel" className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
      {/* Cyber background elements */}
      <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03] dark:opacity-[0.05]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[2.5rem] border border-slate-200/80 dark:border-cyan-500/20 bg-white/90 dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl overflow-hidden">
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>

            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0">
              {/* Left Side: The Pitch */}
              <div className="p-10 lg:p-16 flex flex-col justify-center relative">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-cyan-500/30 rounded-tl-[2.5rem] opacity-50"></div>

                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-cyan-950/30 border border-slate-200 dark:border-cyan-800/50 w-fit mb-8">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-cyan-400 uppercase tracking-widest">
                    {language === "en" ? "Secure Channel : Online" : "Canal Sécurisé : En Ligne"}
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 break-words">
                  {language === "en" ? "Initiate a Confidential Briefing" : "Initier un Briefing Confidentiel"}
                </h2>

                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
                  {language === "en"
                    ? "Bypass the traditional sales pitch. Connect directly with our senior operators to discuss your infrastructure, threats, and compliance requirements."
                    : "Évitez les discours commerciaux traditionnels. Connectez-vous directement avec nos opérateurs seniors pour discuter de votre infrastructure, de vos menaces et de vos exigences de conformité."}
                </p>

                <div className="space-y-5">
                  {[
                    {
                      label: language === "en" ? "Clearance" : "Habilitation",
                      value: language === "en" ? "Senior Experts Only" : "Experts Seniors Uniquement",
                      icon: (
                        <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      )
                    },
                    {
                      label: language === "en" ? "Confidentiality" : "Confidentialité",
                      value: language === "en" ? "Strict NDA by Default" : "NDA Strict par Défaut",
                      icon: (
                        <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      )
                    },
                    {
                      label: language === "en" ? "Response Protocol" : "Protocole de Réponse",
                      value: language === "en" ? "Triage < 24 Hours" : "Triage < 24 Heures",
                      icon: (
                        <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      )
                    }
                  ].map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {spec.icon}
                      </div>
                      <div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">{spec.label}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: The Interface */}
              <div className="bg-slate-50/80 dark:bg-slate-950/50 p-10 lg:p-16 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800/50 relative flex flex-col justify-center">
                {/* Terminal-like header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {language === "en" ? "Select Connection Protocol" : "Sélectionner le Protocole"}
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Protocol 1: Live */}
                  <div className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-blue-500 to-cyan-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[15px] h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                          {language === "en" ? "Protocol 01 // Live" : "Protocole 01 // Direct"}
                        </span>
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {language === "en" ? "Secure Video Briefing" : "Briefing Vidéo Sécurisé"}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        {language === "en" ? "Schedule a 30-minute encrypted session with a lead architect." : "Planifiez une session chiffrée de 30 minutes avec un architecte principal."}
                      </p>
                      <a
                        href="https://calendly.com/skynet-consulting-dz/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-blue-600 dark:hover:bg-cyan-400 dark:hover:text-slate-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {language === "en" ? "Initialize Connection" : "Initialiser la Connexion"}
                      </a>
                    </div>
                  </div>

                  {/* Protocol 2: Async */}
                  <div className="group relative p-[1px] rounded-2xl bg-slate-200 dark:bg-slate-800 transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-700">
                    <div className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-[15px] h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {language === "en" ? "Protocol 02 // Async" : "Protocole 02 // Asynchrone"}
                        </span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {language === "en" ? "Encrypted Transmission" : "Transmission Chiffrée"}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        {language === "en" ? "Send your requirements securely. We will analyze and respond within 24h." : "Envoyez vos besoins de manière sécurisée. Nous analyserons et répondrons sous 24h."}
                      </p>
                      <a
                        href="mailto:skynet.consulting.dz@email.com"
                        className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {language === "en" ? "Transmit Message" : "Transmettre le Message"}
                      </a>
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
