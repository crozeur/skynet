"use client";

import React from "react";
import { Container } from "@/components/Container";
import { Language, translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <footer className="bg-gradient-to-b from-gray-100/70 via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 text-gray-900 dark:text-white py-12 lg:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4">{t.company_name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.company_desc}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.services_title}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">{t.mdr}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">{t.threat_hunting}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">{t.incident_response}</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">{t.vuln_management}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.company_title}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/#about" className="hover:text-gray-900 dark:hover:text-white transition">{t.about_us}</a></li>
              <li><a href="mailto:skynet.consulting.dz@email.com" className="hover:text-gray-900 dark:hover:text-white transition">{t.contact}</a></li>
              <li><a href={"https://www.linkedin.com/company/skynet-consulting-dz/about"} className="hover:text-gray-900 dark:hover:text-white transition" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">{t.careers}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{t.legal_title}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition">{t.privacy}</a></li>
              <li><a href="/terms" className="hover:text-gray-900 dark:hover:text-white transition">{t.terms}</a></li>
              <li><a href="/#services-overview" className="hover:text-gray-900 dark:hover:text-white transition">{t.security}</a></li>
              <li><a href="/#compliance" className="hover:text-gray-900 dark:hover:text-white transition">{t.compliance}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 {t.company_name}. {t.copyright}
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="mailto:skynet.consulting.dz@email.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-sm">skynet.consulting.dz@email.com</a>
              <a href={"https://www.linkedin.com/company/skynet-consulting-dz/about"} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-sm" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
