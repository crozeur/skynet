"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostData } from "@/lib/blog";

export function BlogPostClient({ post }: { post: PostData }) {
  const { language } = useLanguage();
  const { metadata, Content } = post;

  const pillarColors: Record<string, string> = {
    SOC: "from-blue-600 to-cyan-500",
    AUDIT: "from-purple-600 to-pink-500",
    CLOUD: "from-green-600 to-teal-500",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Container className="py-16 sm:py-20 lg:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === "en" ? "Back to Blog" : "Retour au Blog"}
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="mb-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-lg`}>
                {metadata.pillar}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent mb-4">
              {metadata.title}
            </h1>
            <time className="text-gray-500 dark:text-gray-400 font-medium">
              {new Date(metadata.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:my-6 prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
          >
            <Content />
          </div>

          <div className="mt-16 p-8 sm:p-12 rounded-2xl border-2 border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-indigo-900/20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "en" ? "Download the Cybersecurity Checklist" : "Télécharger la checklist cybersécurité"}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {language === "en"
                  ? "Leave your email to receive our practical checklist to strengthen your cyber posture."
                  : "Laissez votre email pour recevoir notre checklist pratique pour renforcer votre posture cyber."}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-lg font-bold hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60"
              >
                {language === "en" ? "Get the Checklist" : "Obtenir la Checklist"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
