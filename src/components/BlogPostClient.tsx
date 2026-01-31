"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostData } from "@/lib/blog";
import React from "react";
import { translateHtmlContent, translateArticleMetadata, getUIString } from "@/lib/translateArticle";

export function BlogPostClient({ post }: { post: PostData }) {
  const { language } = useLanguage();
  const [metadata, setMetadata] = React.useState(post.metadata);
  const [content, setContent] = React.useState(post.content);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const articleRef = React.useRef<HTMLDivElement | null>(null);
  const translateAbortRef = React.useRef<AbortController | null>(null);
  const [activeHeadingId, setActiveHeadingId] = React.useState<string | null>(null);

  const shouldAllowCopyOrContextMenu = React.useCallback((target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (!el) return false;
    // Allow copy/context menu in code blocks (useful for readers) and inputs.
    return Boolean(el.closest("pre, code, input, textarea"));
  }, []);
  
  // Handle language change using pre-translated content
  React.useEffect(() => {
    // Cancel any in-flight translation when switching language/article
    translateAbortRef.current?.abort();
    translateAbortRef.current = null;

    if (language === "en") {
      // Reset to original content
      setMetadata(post.metadata);
      setContent(post.content);
      setIsTranslating(false);
    } else if (language === "fr") {
      const hasPretranslated = Boolean(post.translatedMetadata?.fr || post.translatedContent?.fr);

      if (hasPretranslated) {
        // Use build-time translation when available (fast and cached)
        if (post.translatedMetadata?.fr) {
          // Merge so optional fields (e.g. coverImage/coverAlt) don't disappear
          setMetadata({ ...post.metadata, ...post.translatedMetadata.fr });
        } else {
          setMetadata(post.metadata);
        }
        setContent(post.translatedContent?.fr ?? post.content);
        setIsTranslating(false);
        return;
      }

      // Fallback: translate on demand via /api/translate (Google first)
      const controller = new AbortController();
      translateAbortRef.current = controller;

      setIsTranslating(true);
      (async () => {
        try {
          const [translatedMeta, translatedHtml] = await Promise.all([
            translateArticleMetadata(post.metadata, "fr"),
            translateHtmlContent(post.content, "fr"),
          ]);

          if (controller.signal.aborted) return;

          setMetadata({ ...post.metadata, ...translatedMeta });
          setContent(translatedHtml);
        } catch {
          if (controller.signal.aborted) return;
          // Keep EN content on failure
          setMetadata(post.metadata);
          setContent(post.content);
        } finally {
          if (!controller.signal.aborted) setIsTranslating(false);
        }
      })();
    }
  }, [language, post]);
  
  // Calculate reading time
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  React.useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
      setIsScrolled(scrollTop > 100);
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
    // Extract headings from the HTML content.
    // Regex is too fragile here (headings may contain nested HTML like <code>/<a>,
    // or have extra attributes), so we parse and read textContent.
    try {
      const doc = new DOMParser().parseFromString(content, "text/html");
      const els = Array.from(doc.querySelectorAll("h2[id], h3[id]"));

      const items = els
        .map((el) => {
          const id = el.getAttribute("id")?.trim() ?? "";
          const level = Number.parseInt(el.tagName.slice(1), 10);
          const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
          return { id, text, level };
        })
        .filter((h) => (h.level === 2 || h.level === 3) && Boolean(h.id) && Boolean(h.text));

      setHeadings(items);
    } catch {
      setHeadings([]);
    }
  }, [content]);

  // Scroll spy: highlight current section in TOC
  React.useEffect(() => {
    if (!headings.length) {
      setActiveHeadingId(null);
      return;
    }

    const container = articleRef.current;
    if (!container) return;

    // Best-effort CSS.escape for querySelector
    const escapeId = (id: string) => {
      const cssAny = (globalThis as unknown as { CSS?: { escape?: (value: string) => string } }).CSS;
      if (cssAny?.escape) return cssAny.escape(id);
      return id.replace(/([ #;?%&,.+*~\\:'"!^$\[\]()=>|\/])/g, "\\$1");
    };

    const elements = headings
      .map((h) => container.querySelector(`#${escapeId(h.id)}`) as HTMLElement | null)
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) {
      setActiveHeadingId(headings[0]?.id ?? null);
      return;
    }

    const visible = new Set<string>();
    let raf: number | null = null;

    const pickActive = () => {
      // Choose the last visible heading in document order
      for (let i = headings.length - 1; i >= 0; i--) {
        const id = headings[i]?.id;
        if (id && visible.has(id)) {
          setActiveHeadingId(id);
          return;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const id = target.id;
          if (!id) continue;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }

        // Batch state updates to animation frames to avoid jitter
        if (raf != null) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(pickActive);
      },
      {
        // Activate slightly below the top so it matches scroll-margin-top / sticky UI
        root: null,
        rootMargin: "-120px 0px -70% 0px",
        threshold: 0,
      }
    );

    for (const el of elements) observer.observe(el);

    // Default active: first heading
    setActiveHeadingId((prev) => prev ?? headings[0]?.id ?? null);

    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [headings]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Subtle background effects (light mode) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_86%_8%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_55%_92%,rgba(99,102,241,0.10),transparent_40%)] dark:hidden" />
        <div className="absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl dark:hidden" />
        <div className="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl dark:hidden" />
        <div className="absolute inset-0 opacity-[0.18] dark:opacity-0 [background-image:linear-gradient(to_right,rgba(59,130,246,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_78%)]" />
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className={`h-full bg-gradient-to-r ${pillarColors[metadata.pillar]} transition-all duration-150`}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Translation in progress overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-spin" style={{maskImage: 'radial-gradient(circle, transparent 30%, black 70%)', WebkitMaskImage: 'radial-gradient(circle, transparent 30%, black 70%)'}} />
            </div>
            <p className="text-gray-900 dark:text-white font-semibold">
              {language === "en" ? "Translating article..." : "Traduction en cours..."}
            </p>
          </div>
        </div>
      )}

      <div className="relative transition-opacity duration-300" style={{opacity: isTranslating ? 0.5 : 1}}>
        <Container className="relative py-16 sm:py-20 lg:py-24">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-8 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {getUIString("Back to Blog", language)}
          </Link>

          <article className="max-w-4xl mx-auto">
          {/* Hero cover image */}
          {metadata.coverImage && (
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl bg-gray-100 dark:bg-gray-800">
              <div className="relative aspect-[16/9] sm:aspect-[16/8]">
                {/* Blurred background fill */}
                <Image
                  src={metadata.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover scale-110 blur-2xl opacity-60"
                  priority
                />

                {/* Foreground image (minimal crop) */}
                <div className="absolute inset-0 p-4 sm:p-6">
                  <div className="relative h-full w-full">
                    <Image
                      src={metadata.coverImage}
                      alt={metadata.coverAlt ?? "Article cover"}
                      fill
                      sizes="(min-width: 1024px) 896px, 100vw"
                      className="object-contain drop-shadow-[0_30px_90px_rgba(0,0,0,0.40)]"
                      priority
                    />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
              </div>
            </div>
          )}
          
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {/* Pillar Badge */}
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-md ring-2 ${pillarRings[metadata.pillar]} uppercase tracking-wide`}>
                {metadata.pillar}
              </span>
              
              {/* Date */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
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
              
              {/* Reading Time */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} {getUIString("min read", language)}</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-950 dark:text-white mb-6 leading-tight tracking-tight">
              {metadata.title}
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium max-w-3xl">
              {metadata.description}
            </p>

            {/* Tags */}
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {metadata.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Divider */}
            <div className="mt-8 h-0.5 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          </header>

          {/* Article Content */}
          {/* Table of contents - Professional Design */}
          {headings.length > 0 && (
            <div className="mb-12 sticky top-20 z-10">
              <div className="relative overflow-hidden rounded-xl border border-blue-200/70 shadow-[0_18px_70px_-42px_rgba(59,130,246,0.45)] hover:shadow-[0_26px_90px_-44px_rgba(59,130,246,0.55)] transition-shadow duration-300 dark:border-blue-500/30 dark:shadow-[0_20px_50px_-30px_rgba(59,130,246,0.55)] dark:hover:shadow-[0_24px_60px_-30px_rgba(59,130,246,0.7)]">
                {/* Light-mode glow */}
                <div className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/25 via-cyan-400/20 to-indigo-500/20 blur-2xl opacity-60 dark:hidden" aria-hidden />

                {/* Gradient background with blue accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-white to-cyan-50/70 dark:from-blue-900/35 dark:via-slate-900 dark:to-slate-950 opacity-95" />

                {/* Top accent line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-80 dark:opacity-60" aria-hidden />
                
                {/* Content */}
                <div className="relative p-8 backdrop-blur-xl bg-white/80 dark:bg-slate-900/90 border-2 border-white/60 dark:border-blue-500/30 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.10)] dark:shadow-none">
                  {/* Header with icon and blue accent bar */}
                  <div className="relative mb-6 pl-4 border-l-4 border-blue-600 dark:border-blue-400 bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-transparent dark:from-blue-900/35 dark:to-transparent py-3 -ml-4 pr-4 rounded-r shadow-[0_10px_30px_-18px_rgba(59,130,246,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 blur opacity-35 dark:opacity-0" aria-hidden />
                        <div className="relative bg-blue-500 dark:bg-blue-600 p-2.5 rounded-lg shadow-md">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 text-xl">
                          {getUIString("Contents", language)}
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider with gradient */}
                  <div className="h-px bg-gradient-to-r from-blue-300 via-blue-200 to-transparent dark:from-blue-400/80 dark:via-blue-600/60 dark:to-transparent mb-5" />
                  
                  {/* TOC List - Clean Professional */}
                  <nav className="space-y-2">
                    {headings.map((h) => {
                      const isActive = activeHeadingId === h.id;
                      const isH2 = h.level === 2;
                      const isH3 = h.level === 3;

                      return (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          aria-current={isActive ? "true" : undefined}
                          className={`
                            group flex items-center gap-2.5 rounded-lg
                            transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
                            ${isActive ? 'bg-blue-100/70 shadow-[0_10px_24px_-18px_rgba(59,130,246,0.55)] dark:bg-transparent dark:shadow-none' : ''}
                            ${isH2
                              ? 'px-3 py-2.5 text-slate-900 dark:text-slate-200 font-semibold text-base hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50/80 dark:hover:bg-blue-900/25 hover:pl-4 hover:shadow-[0_10px_24px_-18px_rgba(59,130,246,0.55)]'
                              : 'px-3 py-2 text-slate-800 dark:text-slate-400 font-medium text-sm hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-blue-900/15'}
                            ${isH3 ? 'pl-8' : ''}
                          `}
                          onClick={() => setActiveHeadingId(h.id)}
                        >
                          {isH2 && (
                            <span
                              className={`flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-sm ${isActive ? 'ring-2 ring-blue-500/20 dark:ring-0' : ''}`}
                            />
                          )}

                          {isH3 && (
                            <span className="flex items-center gap-2">
                              <span className="flex-shrink-0 w-4 h-px bg-blue-300/90 dark:bg-blue-500/40" />
                              <span
                                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500 ${isActive ? 'ring-2 ring-blue-500/15 dark:ring-0' : ''}`}
                              />
                            </span>
                          )}

                          <span className="line-clamp-2">{h.text}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          <style>{`
            .blog-content {
              font-size: 1.0625rem;
              line-height: 1.8;
              color: #374151;
              -webkit-user-select: none;
              user-select: none;
            }
            .dark .blog-content {
              color: #e5e7eb;
            }

            .blog-content pre,
            .blog-content code {
              -webkit-user-select: text;
              user-select: text;
            }

            /* Headings */
            .blog-content h1 {
              font-size: 2rem;
              font-weight: 800;
              margin: 2rem 0 2.5rem;
              line-height: 1.3;
              letter-spacing: -0.02em;
              scroll-margin-top: 100px;
              color: #111827;
              padding-bottom: 1.5rem;
              border-bottom: 2px solid #e5e7eb;
              position: relative;
            }
            .blog-content h1::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 100px;
              height: 2px;
              background: linear-gradient(90deg, #3b82f6, transparent);
              border-radius: 1px;
            }
            .dark .blog-content h1 {
              color: #f9fafb;
              border-bottom-color: #374151;
            }

            .blog-content h2 {
              font-size: 2rem;
              font-weight: 700;
              margin: 3rem 0 1.5rem;
              padding-left: 1rem;
              padding-bottom: 1rem;
              border-left: 4px solid #3b82f6;
              border-bottom: 0;
              line-height: 1.2;
              letter-spacing: -0.01em;
              scroll-margin-top: 100px;
              color: #111827;
              background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
              transition: all 0.3s ease;
              position: relative;
            }
            .blog-content h2::after {
              content: '';
              position: absolute;
              bottom: -1rem;
              left: 0;
              width: min(520px, 100%);
              height: 4px;
              background: linear-gradient(90deg, #2563eb 0%, #06b6d4 45%, rgba(6,182,212,0.0) 100%);
              border-radius: 999px;
              opacity: 0.95;
            }
            .dark .blog-content h2 {
              color: #f9fafb;
              border-left-color: #60a5fa;
              border-bottom-color: #374151;
              background: linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%);
            }
            .dark .blog-content h2:hover {
              border-left-color: #93c5fd;
              background: linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, transparent 100%);
            }

            .blog-content h3 {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 2.5rem 0 1.25rem;
              padding-bottom: 0.75rem;
              line-height: 1.3;
              scroll-margin-top: 100px;
              color: #1e40af;
              border-bottom: 0;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              position: relative;
            }
            .blog-content h3::after {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 0;
              width: min(360px, 100%);
              height: 3px;
              background: linear-gradient(90deg, #3b82f6 0%, #22d3ee 55%, rgba(34,211,238,0.0) 100%);
              border-radius: 999px;
              opacity: 0.95;
            }
            .dark .blog-content h3 {
              color: #93c5fd;
              border-bottom: 0;
            }
            .dark .blog-content h3::after {
              opacity: 0.55;
              background: linear-gradient(90deg, rgba(96,165,250,0.9) 0%, rgba(34,211,238,0.55) 55%, rgba(34,211,238,0.0) 100%);
            }

            /* Paragraphs */
            .blog-content p {
              margin-bottom: 1.5rem;
              color: inherit;
              line-height: 1.8;
              text-align: justify;
            }
            .blog-content p:first-of-type {
              font-size: 1.0625rem;
              color: #1f2937;
              font-weight: 500;
              border-left: 3px solid #0ea5e9;
              padding-left: 1.25rem;
              margin-left: -1.25rem;
              background: linear-gradient(90deg, rgba(6, 182, 212, 0.03) 0%, transparent 100%);
              padding-top: 1rem;
              padding-bottom: 1rem;
              padding-right: 1rem;
              border-radius: 0 8px 8px 0;
            }
            .dark .blog-content p:first-of-type {
              color: #e5e7eb;
              border-left-color: #06b6d4;
              background: linear-gradient(90deg, rgba(6, 182, 212, 0.08) 0%, transparent 100%);
            }

            /* Links */
            .blog-content a {
              color: #2563eb;
              font-weight: 600;
              text-decoration: none;
              border-bottom: 2px solid transparent;
              transition: all 0.2s ease;
              position: relative;
            }
            .blog-content a::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background: linear-gradient(90deg, #2563eb, #0ea5e9);
              transition: width 0.3s ease;
            }
            .blog-content a:hover::after {
              width: 100%;
            }
            .dark .blog-content a {
              color: #60a5fa;
            }
            .dark .blog-content a::after {
              background: linear-gradient(90deg, #60a5fa, #06b6d4);
            }

            /* Strong and em */
            .blog-content strong {
              font-weight: 700;
              color: #1e40af;
              text-decoration: underline;
              text-decoration-color: #3b82f6;
              text-decoration-thickness: 2px;
              text-underline-offset: 3px;
              transition: all 0.2s ease;
            }
            .dark .blog-content strong {
              color: #93c5fd;
              text-decoration-color: #60a5fa;
            }
            .dark .blog-content strong:hover {
              color: #dbeafe;
              text-decoration-color: #93c5fd;
            }

            .blog-content em {
              font-style: italic;
              color: #1f2937;
            }
            .dark .blog-content em {
              color: #e5e7eb;
            }

            .blog-content del {
              text-decoration: line-through;
              color: #9ca3af;
            }
            .dark .blog-content del {
              color: #6b7280;
            }

            /* Lists */
            .blog-content ul,
            .blog-content ol {
              margin: 1.75rem 0;
              padding-left: 0;
            }

            .blog-content ul {
              list-style: none;
            }

            .blog-content ul li {
              margin-bottom: 1rem;
              padding-left: 1.75rem;
              position: relative;
              color: inherit;
              line-height: 1.7;
            }
            
            .blog-content ul li::before {
              content: '▪';
              position: absolute;
              left: 0;
              top: 0.25rem;
              color: #3b82f6;
              font-size: 1rem;
              transition: all 0.3s ease;
            }
            
            .blog-content ul li:hover::before {
              color: #2563eb;
              transform: translateX(2px);
            }

            .blog-content ol {
              list-style: none;
              counter-reset: item;
            }

            .blog-content ol li {
              margin-bottom: 1rem;
              padding-left: 2.5rem;
              position: relative;
              color: inherit;
              line-height: 1.7;
            }
            
            .blog-content ol li::before {
              content: counter(item);
              counter-increment: item;
              position: absolute;
              left: 0;
              top: 0.125rem;
              width: 1.75rem;
              height: 1.75rem;
              background: #3b82f6;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 0.875rem;
              transition: all 0.3s ease;
            }
            
            .blog-content ol li:hover::before {
              background: #2563eb;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
              transform: scale(1.08);
            }

            .blog-content li {
              margin-bottom: 0.75rem;
              color: inherit;
              line-height: 1.8;
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
              background: #eff6ff;
              color: #1e40af;
              padding: 0.25rem 0.5rem;
              border-radius: 0.375rem;
              border: 1px solid #bfdbfe;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
              font-size: 0.95rem;
              font-weight: 500;
              transition: all 0.2s ease;
            }
            .dark .blog-content code {
              background: #0f172a;
              color: #60a5fa;
              border-color: #1e3a8a;
            }
            .dark .blog-content code:hover {
              background: #1e293b;
              color: #93c5fd;
              border-color: #3b82f6;
            }

            /* Code blocks */
            .blog-content pre {
              background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
              color: #f3f4f6;
              padding: 1.5rem;
              border-radius: 0.75rem;
              margin: 2rem 0;
              overflow-x: auto;
              border: 1px solid #374151;
              line-height: 1.6;
              box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1);
            }

            .blog-content pre code {
              background: none;
              color: inherit;
              padding: 0;
              font-size: 0.95rem;
              font-weight: 400;
            }

            .dark .blog-content pre {
              background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
              border-color: #1e293b;
              box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
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
              border-radius: 1rem;
              margin: 2.5rem 0;
              box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.15);
              display: block;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .article-img:hover {
              transform: translateY(-4px);
              box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.2);
            }

            .dark .article-img {
              box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.4);
            }

            .dark .article-img:hover {
              box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.5);
            }

            /* Horizontal rules */
            .blog-content hr {
              border: none;
              height: 3px;
              background: linear-gradient(to right, transparent, #3b82f6, transparent);
              margin: 3.5rem 0;
              border-radius: 2px;
            }
            .dark .blog-content hr {
              background: linear-gradient(to right, transparent, #60a5fa, transparent);
            }
          `}</style>
          <div
            ref={articleRef}
            className="blog-content max-w-none"
            onCopy={(e) => {
              if (shouldAllowCopyOrContextMenu(e.target)) return;
              e.preventDefault();
            }}
            onCut={(e) => {
              if (shouldAllowCopyOrContextMenu(e.target)) return;
              e.preventDefault();
            }}
            onContextMenu={(e) => {
              if (shouldAllowCopyOrContextMenu(e.target)) return;
              e.preventDefault();
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Back to Top Button */}
          {isScrolled && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-40"
              title={language === "en" ? "Back to top" : "Retour en haut"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </button>
          )}

          {/* Share Section */}
          <div className="mt-20 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {getUIString("Found this article valuable?", language)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getUIString("Share it with your network", language)}
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
                        alert(getUIString("Link copied!", language));
                      }
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    title={getUIString("Share", language)}
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
          <div className="mt-24 p-8 sm:p-12 rounded-3xl border-2 border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-indigo-900/20 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {getUIString("Download the Cybersecurity Checklist", language)}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                {getUIString("Leave your email to receive our practical checklist to strengthen your cyber posture.", language)}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-lg font-bold hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60"
              >
                {getUIString("Get the Checklist", language)}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
        </Container>
      </div>
    </main>
  );
}
