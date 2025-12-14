"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[640px] bg-gray-900 text-white rounded-lg shadow-xl border border-gray-800 p-4 z-[60]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-200 leading-relaxed">
          Nous utilisons des cookies pour améliorer votre expérience et analyser l&apos;usage du site. En continuant, vous acceptez l&apos;utilisation des cookies. Voir <a href="/privacy" className="underline hover:text-blue-200">Privacy</a>.
        </div>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
