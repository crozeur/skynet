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
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 h-80 shadow-2xl">
              <Image
                src={metadata.coverImage}
                alt={metadata.coverAlt ?? "Article cover"}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          
          {/* Article Header */}
          <header className="mb-16">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {/* Pillar Badge */}
              <span className={`inline-flex items-center px-4 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-lg ring-4 ${pillarRings[metadata.pillar]} uppercase tracking-wide`}>
                {metadata.pillar}
              </span>
              
              {/* Date */}
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time>
                  {new Date(metadata.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-100 dark:to-cyan-100 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
              {metadata.title}
            </h1>
            
            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-semibold">
              {metadata.description}
            </p>

            {/* Tags */}
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Divider */}
            <div className="mt-10 h-1 w-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full" />
          </header>

          {/* Article Content */}
          {/* Table of contents */}
          {headings.length > 0 && (
            <div className="mb-12 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50 sticky top-20 z-10">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {language === 'en' ? 'Contents' : 'Sommaire'}
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {headings.map((h) => (
                  <a 
                    key={h.id} 
                    href={`#${h.id}`} 
                    className={`
                      transition-all duration-200
                      ${h.level === 2 
                        ? 'text-blue-700 dark:text-blue-300 font-semibold text-base' 
                        : 'text-gray-600 dark:text-gray-400 text-sm ml-4'}
                      hover:text-blue-900 dark:hover:text-blue-200
                      border-l-2 pl-3 py-1
                      ${h.level === 2 
                        ? 'border-blue-600 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}
                    `}
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          <style>{`
            .blog-content {
              font-size: 1.0625rem;
              line-height: 1.8;
            }

            /* Headings */
            .blog-content h1 {
              font-size: 2.5rem;
              font-weight: 800;
              margin: 3rem 0 1.5rem;
              line-height: 1.1;
              letter-spacing: -0.02em;
              scroll-margin-top: 100px;
              color: #111827;
            }
            .dark .blog-content h1 {
              color: #f9fafb;
            }

            .blog-content h2 {
              font-size: 2rem;
              font-weight: 700;
              margin: 2.5rem 0 1.25rem;
              padding-bottom: 0.75rem;
              border-bottom: 3px solid #e5e7eb;
              line-height: 1.2;
              letter-spacing: -0.01em;
              scroll-margin-top: 100px;
              color: #111827;
            }
            .dark .blog-content h2 {
              color: #f9fafb;
              border-bottom-color: #374151;
            }

            .blog-content h3 {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 2rem 0 1rem;
              line-height: 1.3;
              scroll-margin-top: 100px;
              color: #111827;
            }
            .dark .blog-content h3 {
              color: #f3f4f6;
            }

            /* Paragraphs */
            .blog-content p {
              margin-bottom: 1.5rem;
              color: #374151;
              line-height: 1.8;
            }
            .dark .blog-content p {
              color: #d1d5db;
            }

            /* Links */
            .blog-content a {
              color: #2563eb;
              font-weight: 600;
              text-decoration: none;
              border-bottom: 2px solid transparent;
              transition: all 0.2s ease;
            }
            .blog-content a:hover {
              border-bottom-color: #2563eb;
            }
            .dark .blog-content a {
              color: #60a5fa;
            }
            .dark .blog-content a:hover {
              border-bottom-color: #60a5fa;
            }

            /* Strong and em */
            .blog-content strong {
              font-weight: 700;
              color: #111827;
            }
            .dark .blog-content strong {
              color: #f9fafb;
            }

            .blog-content em {
              font-style: italic;
              color: #1f2937;
            }
            .dark .blog-content em {
              color: #e5e7eb;
            }

            /* Lists */
            .blog-content ul,
            .blog-content ol {
              margin: 1.75rem 0;
              padding-left: 2rem;
            }

            .blog-content ul {
              list-style: disc;
            }

            .blog-content ol {
              list-style: decimal;
            }

            .blog-content li {
              margin-bottom: 0.75rem;
              color: #374151;
              line-height: 1.8;
            }
            .dark .blog-content li {
              color: #d1d5db;
            }

            .blog-content li strong {
              color: #111827;
              font-weight: 700;
            }
            .dark .blog-content li strong {
              color: #f9fafb;
            }

            /* Inline code */
            .blog-content code {
              background: #f3f4f6;
              color: #d946ef;
              padding: 0.2rem 0.5rem;
              border-radius: 0.375rem;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
              font-size: 0.95rem;
              font-weight: 500;
            }
            .dark .blog-content code {
              background: #1f2937;
              color: #f472b6;
            }

            /* Code blocks */
            .blog-content pre {
              background: #1f2937;
              color: #f3f4f6;
              padding: 1.5rem;
              border-radius: 0.75rem;
              margin: 2rem 0;
              overflow-x: auto;
              border: 1px solid #374151;
              line-height: 1.6;
            }

            .blog-content pre code {
              background: none;
              color: inherit;
              padding: 0;
              font-size: 0.95rem;
              font-weight: 400;
            }

            .dark .blog-content pre {
              background: #0f172a;
              border-color: #1e293b;
            }

            /* Blockquotes */
            .article-blockquote {
              border-left: 4px solid #2563eb;
              background: #eff6ff;
              padding: 1.25rem 1.5rem;
              margin: 2rem 0;
              border-radius: 0.5rem;
              font-style: italic;
              color: #1e40af;
            }

            .dark .article-blockquote {
              background: #0c2340;
              border-left-color: #60a5fa;
              color: #93c5fd;
            }

            /* Images */
            .article-img {
              max-width: 100%;
              height: auto;
              border-radius: 0.75rem;
              margin: 2rem 0;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
              display: block;
            }

            .dark .article-img {
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            }

            /* Horizontal rules */
            .blog-content hr {
              border: none;
              height: 2px;
              background: linear-gradient(to right, #e5e7eb, #9ca3af, #e5e7eb);
              margin: 3rem 0;
            }
            .dark .blog-content hr {
              background: linear-gradient(to right, #374151, #4b5563, #374151);
            }
          `}</style>
          <div
            ref={articleRef}
            className="blog-content max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Share Section */}
          <div className="mt-20 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {language === "en" ? "Found this article valuable?" : "Cet article vous a été utile ?"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "en" ? "Share it with your network" : "Partagez-le avec votre réseau"}
                </p>
              </div>
              
              <div className="flex gap-3">
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
            
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2 group justify-center"
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
