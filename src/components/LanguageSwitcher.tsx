"use client";

import { useLanguage } from "./LanguageProvider";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}>
        EN
      </button>
      <button
        onClick={() => setLanguage("fr")}
        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
          language === "fr"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}>
        FR
      </button>
    </div>
  );
};
