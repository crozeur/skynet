"use client";

import { useLanguage } from "./LanguageProvider";
import { usePathname, useRouter } from "next/navigation";
import { getBlogSlugIndexClient } from "@/lib/blogSlugIndexClient";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = async (target: "en" | "fr") => {
    if (target === language) return;

    const path = pathname || "";
    const isBlogIndex = path === "/blog" || path === "/fr/blog" || path === "/en/blog";

    const blogEn = path.match(/^\/blog\/([^/]+)$/);
    const blogFr = path.match(/^\/(?:fr|en)\/blog\/([^/]+)$/);

    try {
      if (isBlogIndex) {
        router.push(target === "fr" ? "/fr/blog" : "/blog");
      } else if (blogEn || blogFr) {
        const currentSlug = (blogEn?.[1] || blogFr?.[1] || "").trim();
        if (currentSlug) {
          const index = await getBlogSlugIndexClient();

          if (target === "fr") {
            const match = index.find((e) => e.slugEn === currentSlug);
            const slugFr = match?.slugFr || currentSlug;
            router.push(`/fr/blog/${slugFr}`);
          } else {
            // target EN
            const match = index.find((e) => e.slugFr === currentSlug) || index.find((e) => e.slugEn === currentSlug);
            const slugEn = match?.slugEn || currentSlug;
            router.push(`/blog/${slugEn}`);
          }
        }
      }
    } finally {
      // Always switch UI language even if route change isn't applicable.
      setLanguage(target);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}>
        EN
      </button>
      <button
        onClick={() => switchLanguage("fr")}
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
