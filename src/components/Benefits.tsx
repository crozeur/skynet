"use client";

import React from "react";
import { Container } from "@/components/Container";
import { translations } from "@/lib/translations";
import { useLanguage } from "./LanguageProvider";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface BenefitsProps {
  imgPos?: "left" | "right";
  variant?: "one" | "two";
  data?: {
    title: string;
    desc: string;
    bullets: {
      title: string;
      desc: string;
      icon?: React.ReactNode;
    }[];
  };
}

export const Benefits = (props: Readonly<BenefitsProps>) => {
  const { language } = useLanguage();
  const t = translations[language];

  const defaultData = (variant: string | undefined) =>
    variant === "two"
      ? {
          title: t.benefit_two_title,
          desc: t.benefit_two_1_desc,
          bullets: [
            { title: t.benefit_two_1, desc: t.benefit_two_1_desc },
            { title: t.benefit_two_2, desc: t.benefit_two_2_desc },
            { title: t.benefit_two_3, desc: t.benefit_two_3_desc },
          ],
        }
      : {
          title: t.benefit_one_title,
          desc: t.benefit_one_1_desc,
          bullets: [
            { title: t.benefit_one_1, desc: t.benefit_one_1_desc },
            { title: t.benefit_one_2, desc: t.benefit_one_2_desc },
            { title: t.benefit_one_3, desc: t.benefit_one_3_desc },
          ],
        };

  const data = props.data ?? defaultData(props.variant);
  return (
      <Container className="flex flex-wrap mb-20 lg:gap-12 lg:flex-nowrap items-center">
        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:order-2" : ""
          }`}>
          <div>
            <div className="flex flex-col w-full">
              <h3 className="max-w-2xl text-4xl lg:text-4xl font-bold leading-tight tracking-tight text-gray-800 lg:leading-tight dark:text-white">
                {data.title}
              </h3>

              <p className="max-w-2xl py-6 text-lg leading-relaxed text-gray-600 lg:text-gray-600 xl:text-lg dark:text-gray-300">
                {data.desc}
              </p>
            </div>

            <div className="w-full mt-6">
              {data.bullets.map((item, index) => (
                <Benefit
                  key={index}
                  title={item.title}
                  icon={item.icon ?? <ShieldCheckIcon />}
                >
                  {item.desc}
                </Benefit>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center justify-center w-full lg:w-1/2 mt-12 lg:mt-0 ${
            props.imgPos === "right" ? "lg:order-1" : ""
          }`}>
          <div className="w-full">
            <SecurityIllustration />
          </div>
        </div>
      </Container>
  );
};

function Benefit(props: any) {
  return (
      <div className="flex items-start mt-8 space-x-4">
        <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg w-14 h-14 shadow-lg shadow-cyan-500/30">
          {React.cloneElement(props.icon, {
            className: "w-8 h-8 text-white",
          })}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {props.title}
          </h4>
          <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
            {props.children}
          </p>
        </div>
      </div>
  );
}

function SecurityIllustration() {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-cyan-500 border-opacity-40 rounded-2xl p-8 overflow-hidden shadow-2xl">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Security elements */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Status indicators */}
        <div className="space-y-3 bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm border border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-sm text-cyan-300 font-mono font-semibold">systems_protected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" style={{animationDelay: '0.3s'}}></div>
            <span className="text-sm text-cyan-300 font-mono font-semibold">threats_detected: 0</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" style={{animationDelay: '0.6s'}}></div>
            <span className="text-sm text-cyan-300 font-mono font-semibold">status: online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
