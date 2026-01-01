"use client";
import React, { useState } from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Language, translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";

export const Faq = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const faqdata = [
    {
      question: t.faq_q1,
      answer: t.faq_a1,
      icon: "🔒",
    },
    {
      question: t.faq_q2,
      answer: t.faq_a2,
      icon: "⚡",
    },
    {
      question: t.faq_q3,
      answer: t.faq_a3,
      icon: "🔍",
    },
    {
      question: t.faq_q4,
      answer: t.faq_a4,
      icon: "📊",
    },
    {
      question: t.faq_q5,
      answer: t.faq_a5,
      icon: "💡",
    },
    {
      question: t.faq_q6,
      answer: t.faq_a6,
      icon: "🎯",
    },
  ];

  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl mx-auto">
        <div className="space-y-3">
          {faqdata.map((item, index) => (
            <div
              key={item.question}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton
                      className={`
                        flex items-center justify-between w-full px-5 py-4 text-base text-left rounded-xl
                        font-semibold transition-all duration-300 focus:outline-none
                        focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2
                        dark:focus-visible:ring-offset-gray-900
                        ${
                          open
                            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md border border-blue-200 dark:border-blue-800/50"
                            : "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/50"
                        }
                        active:scale-[0.98] text-gray-800 dark:text-gray-100
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                          {item.icon}
                        </span>
                        <span className="block">{item.question}</span>
                      </div>
                      <ChevronUpIcon
                        className={`
                          w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 flex-shrink-0 ml-2
                          ${open ? "transform rotate-180" : ""}
                        `}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="overflow-hidden">
                      <div className="px-5 py-4 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent border-t border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {item.answer}
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
