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
          <label htmlFor="name" className="block text-xs font-mono tracking-wider text-cyan-400/80 mb-2 uppercase">
            {t.audit_form_name_label} <span className="text-cyan-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder={t.audit_form_name_placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A1122]/80 border border-cyan-900/60 rounded-[2px] shadow-[inset_0_0_20px_rgba(8,145,178,0.02)] text-white placeholder-cyan-900/60 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-700/80 font-mono text-sm"
          />
        </div>

        {/* Company Field */}
        <div className="group animate-[fadeInUp_0.75s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.05s" }}>
          <label htmlFor="company" className="block text-xs font-mono tracking-wider text-cyan-400/80 mb-2 uppercase">
            {t.audit_form_company_label} <span className="text-cyan-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder={t.audit_form_company_placeholder}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A1122]/80 border border-cyan-900/60 rounded-[2px] shadow-[inset_0_0_20px_rgba(8,145,178,0.02)] text-white placeholder-cyan-900/60 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-700/80 font-mono text-sm"
          />
        </div>

        {/* Email Field */}
        <div className="group animate-[fadeInUp_0.8s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.1s" }}>
          <label htmlFor="email" className="block text-xs font-mono tracking-wider text-cyan-400/80 mb-2 uppercase">
            {t.audit_form_email_label} <span className="text-cyan-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder={t.audit_form_email_placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full px-4 py-3 bg-[#0A1122]/80 border border-cyan-900/60 rounded-[2px] shadow-[inset_0_0_20px_rgba(8,145,178,0.02)] text-white placeholder-cyan-900/60 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-700/80 font-mono text-sm"
          />
        </div>

        {/* Sector Field */}
        <div className="animate-[fadeInUp_0.85s_ease-out]" style={{ animationFillMode: "backwards", animationDelay: "0.15s" }}>
          <label className="block text-xs font-mono tracking-wider text-cyan-400/80 mb-3 uppercase">
            {t.audit_form_sector_label} <span className="text-cyan-500">*</span>
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
                        ? "border-cyan-400/80 bg-cyan-950/40 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.01]"
                        : "border-cyan-900/40 bg-[#0A1122]/50 text-cyan-600/70 hover:border-cyan-700/60 hover:text-cyan-400 hover:bg-cyan-950/20"
                  } animate-[fadeInUp_0.9s_ease-out] hover:-translate-y-0.5`}
                  style={{ animationFillMode: "backwards", animationDelay: `${0.18 + idx * 0.03}s` }}
                >
                  <input
                    id={`sector-${option.value}`}
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleSectorToggle(option.value)}
                    disabled={loading}
                    className="w-4 h-4 text-cyan-500 bg-[#0A1122] border-cyan-800 rounded-sm focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                  <span className="text-[13px] font-mono tracking-wide">{option.label}</span>
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
            className="w-full px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 active:scale-[0.99] text-[#050A15] font-mono font-bold tracking-widest uppercase rounded-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 focus:ring-offset-[#050A15] shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
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
              ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/50 font-mono text-sm"
              : "bg-red-950/40 text-red-400 border border-red-500/50 font-mono text-sm"
          } animate-[fadeInUp_0.6s_ease-out]`}
          style={{ animationFillMode: "backwards" }}
        >
          {message.text}
        </div>
      )}
    </>
  );
};
