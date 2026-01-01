"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostData } from "@/lib/blog";
import React from "react";

export function BlogPostClient({ post }: { post: PostData }) {
  const { language } = useLanguage();
  const { metadata, content } = post;
  const [readingProgress, setReadingProgress] = React.useState(0);
  const articleRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  const pillarColors: Record<string, string> = {
    SOC: "from-blue-600 to-cyan-500",
    AUDIT: "from-purple-600 to-pink-500",
    CLOUD: "from-green-600 to-teal-500",
  };

  const pillarRings: Record<string, string> = {
    SOC: "ring-blue-500/20",
    AUDIT: "ring-purple-500/20",
    CLOUD: "ring-green-500/20",
  };

  const [headings, setHeadings] = React.useState<Array<{ id: string; text: string; level: number }>>([]);

  React.useEffect(() => {
    // Extract headings from the HTML content using regex instead of DOM
    const headingRegex = /<h([23])\s+id="([^"]+)">([^<]+)<\/h\1>/g;
    const items: Array<{ id: string; text: string; level: number }> = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3];
      items.push({ id, text, level });
    }
    
    setHeadings(items);
  }, [content]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className={`h-full bg-gradient-to-r ${pillarColors[metadata.pillar]} transition-all duration-150`}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Container className="py-16 sm:py-20 lg:py-24">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === "en" ? "Back to Blog" : "Retour au Blog"}
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Hero cover image */}
          {metadata.coverImage && (
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 h-64">
              <Image
                src={metadata.coverImage}
                alt={metadata.coverAlt ?? "Article cover"}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-lg ring-4 ${pillarRings[metadata.pillar]}`}>
                {metadata.pillar}
              </span>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time className="font-medium">
                  {new Date(metadata.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
              {metadata.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {metadata.description}
            </p>

            {/* Tags */}
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Divider */}
            <div className="mt-8 h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          </header>

          {/* Article Content */}
          {/* Table of contents */}
          {headings.length > 0 && (
            <div className="mb-10 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="font-bold text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'On this page' : 'Sur cette page'}
              </div>
              <div className="flex flex-col gap-2">
                {headings.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className={`text-sm ${h.level === 2 ? 'font-semibold' : ''} text-blue-700 dark:text-blue-300 hover:underline`}>{h.text}</a>
                ))}
              </div>
            </div>
          )}

          <style>{`
            .blog-content h1 {
              font-size: 2.25rem;
              font-weight: 700;
              margin-top: 2.5rem;
              margin-bottom: 1.5rem;
              line-height: 1.2;
              scroll-margin-top: 100px;
            }
            .blog-content h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              padding-bottom: 0.75rem;
              border-bottom: 2px solid #e5e7eb;
              scroll-margin-top: 100px;
            }
            .dark .blog-content h2 {
              border-bottom-color: #374151;
            }
            .blog-content h3 {
              font-size: 1.5rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              scroll-margin-top: 100px;
            }
            .blog-content h1, 
            .blog-content h2, 
            .blog-content h3 {
              color: #111827;
            }
            .dark .blog-content h1,
            .dark .blog-content h2,
            .dark .blog-content h3 {
              color: #f3f4f6;
            }
            .blog-content p {
              color: #374151;
              font-size: 1.0625rem;
              line-height: 1.75;
              margin-bottom: 1.5rem;
            }
            .dark .blog-content p {
              color: #d1d5db;
            }
            .blog-content ul {
              list-style: disc;
              margin: 1.5rem 0;
              padding-left: 2rem;
            }
            .blog-content ol {
              list-style: decimal;
              margin: 1.5rem 0;
              padding-left: 2rem;
            }
            .blog-content li {
              color: #374151;
              margin-bottom: 0.5rem;
              line-height: 1.75;
            }
            .dark .blog-content li {
              color: #d1d5db;
            }
            .blog-content strong {
              font-weight: 700;
              color: #111827;
            }
            .dark .blog-content strong {
              color: #f3f4f6;
            }
            .blog-content em {
              font-style: italic;
            }
            .blog-content code {
              background-color: #f3f4f6;
              color: #1e40af;
              padding: 0.25rem 0.5rem;
              border-radius: 0.375rem;
              font-family: ui-monospace, monospace;
              font-size: 0.875rem;
            }
            .dark .blog-content code {
              background-color: #1f2937;
              color: #60a5fa;
            }
            .blog-content a {
              color: #2563eb;
              text-decoration: none;
              font-weight: 600;
            }
            .blog-content a:hover {
              text-decoration: underline;
            }
            .dark .blog-content a {
              color: #60a5fa;
            }
          `}</style>
          <div
            ref={articleRef}
            className="blog-content max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {language === "en" ? "Share this article:" : "Partager cet article :"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: metadata.title,
                          text: metadata.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert(language === "en" ? "Link copied!" : "Lien copié !");
                      }
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    title={language === "en" ? "Share" : "Partager"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(metadata.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
                    title="Twitter / X"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2 group"
              >
                {language === "en" ? "Read more articles" : "Lire plus d'articles"}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-8 sm:p-12 rounded-2xl border-2 border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-indigo-900/20 shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "en" ? "Download the Cybersecurity Checklist" : "Télécharger la checklist cybersécurité"}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">
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
