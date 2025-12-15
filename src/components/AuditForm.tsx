"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import { SECTOR_OPTIONS, getSectorLabel } from "@/lib/sectors";

interface AuditFormProps {
  language?: "en" | "fr";
}

export const AuditForm = ({ language: languageProp }: AuditFormProps) => {
  const { language: languageFromContext } = useLanguage();
  const language = languageProp || languageFromContext;
  const t = translations[language];
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const sectorOptions = SECTOR_OPTIONS.map((option) => ({
    value: option.key,
    label: language === "en" ? option.en : option.fr,
  }));

  const handleSectorToggle = (value: string) => {
    setSectors((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate email
    if (!email) {
      setMessage({
        type: "error",
        text: t.audit_form_email_required,
      });
      return;
    }

    // Validate sectors
    if (sectors.length === 0) {
      setMessage({
        type: "error",
        text: t.audit_form_sector_required,
      });
      return;
    }

    setLoading(true);

    // Map sector keys to labels
    const sectorLabels = sectors.map((key) => {
      const option = sectorOptions.find((opt) => opt.value === key);
      return option ? option.label : key;
    });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          company: company || undefined,
          sectors: sectorLabels,
          language,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: t.audit_form_success,
        });
        setName("");
        setCompany("");
        setEmail("");
        setSectors([]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        setMessage({
          type: "error",
          text: t.audit_form_error + (errorData.details ? ` (${errorData.details})` : ""),
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({
        type: "error",
        text: t.audit_form_error + " (Erreur réseau ou serveur)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="group animate-[fadeInUp_0.7s_ease-out]" style={{ animationFillMode: "backwards" }}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.audit_form_name_label} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder={t.audit_form_name_placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group-hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        {/* Company Field */}
        <div className="group animate-[fadeInUp_0.75s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.05s" }}>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.audit_form_company_label} <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder={t.audit_form_company_placeholder}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group-hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        {/* Email Field */}
        <div className="group animate-[fadeInUp_0.8s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.1s" }}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.audit_form_email_label} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder={t.audit_form_email_placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group-hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
          />
        </div>

        {/* Sector Field */}
        <div className="animate-[fadeInUp_0.85s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.15s" }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.audit_form_sector_label} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sectorOptions.map((option, idx) => {
              const selected = sectors.includes(option.value);
              return (
                <label
                  key={option.value}
                  htmlFor={`sector-${option.value}`}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-all duration-200 ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-400/80 dark:bg-blue-900/30 dark:text-blue-100 shadow-sm scale-[1.01]"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-blue-300/80 hover:shadow-sm"
                  } animate-[fadeInUp_0.9s_ease-out] hover:-translate-y-0.5`}
                  style={{ animationFillMode: "backwards", animationDelay: `${0.18 + idx * 0.03}s` }}
                >
                  <input
                    id={`sector-${option.value}`}
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleSectorToggle(option.value)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="animate-[fadeInUp_0.95s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.22s" }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] active:shadow-lg text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            style={{ animation: loading ? "none" : "pulseGlow 2.8s ease-in-out infinite" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.audit_form_sending}
              </span>
            ) : (
              t.audit_form_submit
            )}
          </button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          } animate-[fadeInUp_0.6s_ease-out]`}
          style={{ animationFillMode: "backwards" }}
        >
          {message.text}
        </div>
      )}
    </>
  );
};
