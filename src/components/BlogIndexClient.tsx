"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostSummary } from "@/lib/blog";

interface TranslatedMetadata {
  title: string;
  description: string;
  tags: string[];
}

export function BlogIndexClient({ posts }: { posts: PostSummary[] }) {
  const { language } = useLanguage();
  const [filterTag, setFilterTag] = React.useState<string | null>(null);
  const [filterPillar, setFilterPillar] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [translatedPosts, setTranslatedPosts] = React.useState<Record<string, TranslatedMetadata>>({});
  const [isTranslating, setIsTranslating] = React.useState(false);

  // Highlight matches in titles/descriptions for better search UX
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlight = React.useCallback(
    (text: string): React.ReactNode => {
      if (!searchQuery || !text) return text;
      const pattern = new RegExp(`(${escapeRegExp(searchQuery)})`, "ig");
      const parts = text.split(pattern);
      return parts.map((part, i) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200/70 dark:bg-yellow-600/40 rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    },
    [searchQuery]
  );

  // Translate posts when language changes
  React.useEffect(() => {
    if (language === "en") {
      // Reset to original when switching to English
      setTranslatedPosts({});
      return;
    }

    // Use pre-translated metadata from build time
    const translations: Record<string, TranslatedMetadata> = {};

    for (const { slug, translatedMetadata } of posts) {
      if (translatedMetadata?.fr) {
        translations[slug] = {
          title: translatedMetadata.fr.title,
          description: translatedMetadata.fr.description,
          tags: translatedMetadata.fr.tags || [],
        };
      }
    }

    setTranslatedPosts(translations);
    setIsTranslating(false);
  }, [language, posts]);

  const pillarColors: Record<string, string> = {
    SOC: "from-blue-600 to-cyan-500",
    AUDIT: "from-purple-600 to-pink-500",
    CLOUD: "from-green-600 to-teal-500",
  };

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(({ metadata }) => (metadata.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const visiblePosts = React.useMemo(() => {
    let filtered = posts;
    if (filterPillar) {
      filtered = filtered.filter(({ metadata }) => metadata.pillar === filterPillar);
    }
    if (filterTag) {
      filtered = filtered.filter(({ metadata }) => (metadata.tags || []).includes(filterTag));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(({ metadata }) => 
        metadata.title.toLowerCase().includes(query) ||
        metadata.description.toLowerCase().includes(query) ||
        (metadata.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [posts, filterPillar, filterTag, searchQuery]);

  const pillars = ["SOC", "AUDIT", "CLOUD"] as const;
  const pageSize = 9;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / pageSize));
  const pagedPosts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return visiblePosts.slice(start, start + pageSize);
  }, [visiblePosts, page]);
  React.useEffect(() => {
    // Reset to first page on filter/search change
    setPage(1);
  }, [filterPillar, filterTag, searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Container className="py-16 sm:py-20 lg:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {language === "en" ? "Knowledge Base" : "Base de Connaissances"}
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
            <span className="block bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
              {language === "en" ? "Cybersecurity" : "Cybersécurité"}
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              {language === "en" ? "Insights" : "& Expertise"}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto font-light">
            {language === "en"
              ? "Managed SOC, security audits, and cloud security. Operational best practices and real-world experience."
              : "SOC managés, audits de sécurité et sécurisation cloud. Retours d'expérience et bonnes pratiques opérationnelles."}
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "en" ? "Search articles..." : "Rechercher des articles..."}
                className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all shadow-lg"
              />
              <svg 
                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterPillar(null);
                  setFilterTag(null);
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {language === "en" ? "Clear filters" : "Réinitialiser les filtres"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.836 0H20V4M4 20v-5h.582m15.836 0H20v5M10 10l4 4m0-4l-4 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Expertise Filters */}
        {pillars.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700 mb-4">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {language === "en" ? "Our Expertise" : "Notre expertise"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
                {language === "en" ? "Explore Our Expertise" : "Découvrez notre expertise"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "en"
                  ? "Access specialized content on managed SOC, security audits, and cloud security"
                  : "Accédez à des contenus spécialisés sur le SOC managé, l'audit de sécurité et le cloud"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => setFilterPillar(null)}
                className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 ${
                  filterPillar === null
                    ? "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white shadow-2xl shadow-slate-500/50 scale-105 ring-4 ring-slate-500/30"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-2xl hover:shadow-gray-400/20 dark:hover:shadow-black/40 hover:scale-105 border-2 border-gray-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div className="relative z-10">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    filterPillar === null
                      ? "bg-white/20 backdrop-blur-sm"
                      : "bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800/30 dark:to-gray-800/30 group-hover:from-slate-200 group-hover:to-gray-300 dark:group-hover:from-slate-700/50 dark:group-hover:to-gray-700/50 transition-all"
                  }`}>
                    <svg className={`w-6 h-6 ${filterPillar === null ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold">
                    {language === "en" ? "All" : "Tous"}
                  </span>
                </div>
                {filterPillar !== null && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 via-gray-500/0 to-slate-500/0 group-hover:from-slate-500/10 group-hover:via-gray-500/10 group-hover:to-slate-500/10 transition-all duration-300" />
                )}
              </button>
              {pillars.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => setFilterPillar(pillar)}
                  className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 ${
                    filterPillar === pillar
                      ? "text-white shadow-2xl scale-105 ring-4 ring-white/30"
                      : "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-2xl hover:scale-105 border-2 transition-all"
                  } ${
                    pillar === 'SOC' && filterPillar !== pillar ? "border-blue-200 dark:border-blue-800/50 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-blue-400/30 dark:hover:shadow-blue-500/20" :
                    pillar === 'AUDIT' && filterPillar !== pillar ? "border-purple-200 dark:border-purple-800/50 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-purple-400/30 dark:hover:shadow-purple-500/20" :
                    pillar === 'CLOUD' && filterPillar !== pillar ? "border-green-200 dark:border-green-800/50 hover:border-green-400 dark:hover:border-green-600 hover:shadow-green-400/30 dark:hover:shadow-green-500/20" :
                    ""
                  }`}
                  style={
                    filterPillar === pillar
                      ? {
                          background: `linear-gradient(135deg, ${pillar === 'SOC' ? 'rgb(37, 99, 235), rgb(6, 182, 212)' : pillar === 'AUDIT' ? 'rgb(147, 51, 234), rgb(236, 72, 153)' : 'rgb(22, 163, 74), rgb(20, 184, 166)'})`,
                        }
                      : undefined
                  }
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center transition-all ${
                      filterPillar === pillar
                        ? "bg-white/20 backdrop-blur-sm"
                        : pillar === 'SOC' ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-cyan-800/50" :
                          pillar === 'AUDIT' ? "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-800/50 dark:group-hover:to-pink-800/50" :
                          "bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 group-hover:from-green-200 group-hover:to-teal-200 dark:group-hover:from-green-800/50 dark:group-hover:to-teal-800/50"
                    }`}>
                      {pillar === 'SOC' && (
                        <svg className={`w-6 h-6 ${filterPillar === pillar ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      {pillar === 'AUDIT' && (
                        <svg className={`w-6 h-6 ${filterPillar === pillar ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      )}
                      {pillar === 'CLOUD' && (
                        <svg className={`w-6 h-6 ${filterPillar === pillar ? 'text-white' : 'text-green-600 dark:text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg font-bold block mb-1">
                      {pillar}
                    </span>
                    <span className={`text-xs ${
                      filterPillar === pillar ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {pillar === 'SOC' ? (language === "en" ? "Operations" : "Opérations") :
                       pillar === 'AUDIT' ? (language === "en" ? "Assessment" : "Évaluation") :
                       (language === "en" ? "Infrastructure" : "Infrastructure")}
                    </span>
                  </div>
                  {filterPillar !== pillar && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillarColors[pillar]} opacity-0 group-hover:opacity-15 transition-opacity duration-300`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}



        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {visiblePosts.length} {visiblePosts.length === 1 ? 
              (language === "en" ? "article found" : "article trouvé") : 
              (language === "en" ? "articles found" : "articles trouvés")
            }
          </p>
        </div>

        {visiblePosts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === "en" ? "No articles found" : "Aucun article trouvé"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "en" ? "Try adjusting your filters or search query" : "Essayez d'ajuster vos filtres ou votre recherche"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pagedPosts.map(({ slug, metadata, readingTimeMinutes }) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3"
              >
                {/* Background with gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillarColors[metadata.pillar]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Card container */}
                <div className="relative h-full flex flex-col bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:border-transparent overflow-hidden">
                  
                  {/* Cover image/gradient section */}
                  {metadata.coverImage ? (
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image 
                        src={metadata.coverImage} 
                        alt={metadata.coverAlt ?? 'Blog cover'} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/50 transition-colors duration-500" />
                    </div>
                  ) : (
                    <div className={`h-48 sm:h-52 w-full bg-gradient-to-br ${pillarColors[metadata.pillar]} relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-3xl" />
                      </div>
                      <div className="relative h-full flex items-center justify-center">
                        <div className="text-white/40 group-hover:text-white/60 transition-colors duration-500">
                          {metadata.pillar === 'SOC' && (
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                          {metadata.pillar === 'AUDIT' && (
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          )}
                          {metadata.pillar === 'CLOUD' && (
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Pillar badge */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-lg ring-2 ring-white/30 backdrop-blur-sm group-hover:ring-white/50 transition-all duration-500`}>
                      {metadata.pillar}
                    </span>
                  </div>

                  {/* Content section */}
                  <div className="flex-1 flex flex-col p-6 sm:p-7 bg-white dark:bg-gray-900 group-hover:bg-gradient-to-br group-hover:from-white/95 group-hover:to-gray-50 dark:group-hover:from-gray-900/95 dark:group-hover:to-gray-800/95 transition-all duration-500">
                    
                    {/* Date and reading time */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time className="font-medium">
                          {new Date(metadata.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      {readingTimeMinutes && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                          </svg>
                          <span className="font-medium">{readingTimeMinutes} min</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-500">
                      {highlight(translatedPosts[slug]?.title || metadata.title)}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-5 flex-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-500">
                      {highlight(translatedPosts[slug]?.description || metadata.description)}
                    </p>

                    {/* Tags */}
                    {(translatedPosts[slug]?.tags || metadata.tags) && (translatedPosts[slug]?.tags || metadata.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {(translatedPosts[slug]?.tags || metadata.tags).slice(0, 2).map((tag) => (
                          <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 group-hover:from-blue-100 group-hover:to-cyan-50 dark:group-hover:from-blue-900/40 dark:group-hover:to-cyan-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-500 border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600/50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read more link */}
                    <div className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-500">
                      <span>{language === "en" ? "Read article" : "Lire l'article"}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Glossy overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-2 rounded-lg border text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} border-gray-300 dark:border-gray-700`}
            >
              {language === 'en' ? 'Previous' : 'Précédent'}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-semibold ${page === i + 1 ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'} border-gray-300 dark:border-gray-700`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-2 rounded-lg border text-sm ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} border-gray-300 dark:border-gray-700`}
            >
              {language === 'en' ? 'Next' : 'Suivant'}
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
