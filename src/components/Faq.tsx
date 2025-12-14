"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Language, translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";

export const Faq = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const faqdata = [
    {
      question: t.faq_q1,
      answer: t.faq_a1,
    },
    {
      question: t.faq_q2,
      answer: t.faq_a2,
    },
    {
      question: t.faq_q3,
      answer: t.faq_a3,
    },
    {
      question: t.faq_q4,
      answer: t.faq_a4,
    },
    {
      question: t.faq_q5,
      answer: t.faq_a5,
    },
    {
      question: t.faq_q6,
      answer: t.faq_a6,
    },
  ];

  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-blue-600`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
  };
