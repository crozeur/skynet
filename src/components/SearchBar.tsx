"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";

export const SearchBar = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; snippet: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchContent = () => {
      const searchTerms = query.toLowerCase();
      const matches: { id: string; title: string; snippet: string }[] = [];

      // Define searchable sections
      const sections = [
        { id: "hero", title: language === "en" ? "Home" : "Accueil", keywords: "security audit soc monitoring cybersecurity surveillance sécurité audit" },
        { id: "case-studies", title: language === "en" ? "Success Stories" : "Nos Succès", keywords: "case study success client projet réussite" },
        { id: "services-overview", title: language === "en" ? "Services" : "Nos Services", keywords: "services soc audit cloud compliance conformité" },
        { id: "compliance", title: language === "en" ? "Compliance" : "Conformité & Risques", keywords: "compliance iso gdpr pci conformité rgpd norme" },
        { id: "about", title: language === "en" ? "About Us" : "À Propos", keywords: "about company team expertise équipe entreprise" },
        { id: "contact", title: language === "en" ? "Contact" : "Nous Contacter", keywords: "contact email phone form formulaire" },
      ];

      sections.forEach((section) => {
        if (
          section.title.toLowerCase().includes(searchTerms) ||
          section.keywords.toLowerCase().includes(searchTerms)
        ) {
          matches.push({
            id: section.id,
            title: section.title,
            snippet: section.keywords.split(" ").slice(0, 5).join(" ") + "...",
          });
        }
      });

      setResults(matches.slice(0, 5));
    };

    const debounce = setTimeout(searchContent, 200);
    return () => clearTimeout(debounce);
  }, [query, language]);

  const handleResultClick = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={language === "en" ? "Search" : "Rechercher"}
        className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "en" ? "Search..." : "Rechercher..."}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.trim() === "" ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {language === "en" ? "Type to search..." : "Tapez pour rechercher..."}
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.id)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {result.snippet}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {language === "en" ? "No results found" : "Aucun résultat trouvé"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
