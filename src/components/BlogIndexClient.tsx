"use client";

import React from "react";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostSummary } from "@/lib/blog";

export function BlogIndexClient({ posts }: { posts: PostSummary[] }) {
  const { language } = useLanguage();
  const [filterTag, setFilterTag] = React.useState<string | null>(null);
  const [filterPillar, setFilterPillar] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

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
                  {language === "en" ? "Our Expertise Areas" : "Nos Domaines d'Expertise"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
                {language === "en" ? "Choose Your Focus" : "Choisissez Votre Focus"}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {language === "en" ? "Dive into specialized cybersecurity content tailored to your needs" : "Plongez dans du contenu spécialisé en cybersécurité adapté à vos besoins"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => setFilterPillar(null)}
                className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 ${
                  filterPillar === null
                    ? "bg-gray-900 dark:bg-gray-700 text-white shadow-2xl scale-105 ring-4 ring-gray-900/20 dark:ring-gray-700/50"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="relative z-10">
                  <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-lg font-bold">
                    {language === "en" ? "All" : "Tous"}
                  </span>
                </div>
              </button>
              {pillars.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => setFilterPillar(pillar)}
                  className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 ${
                    filterPillar === pillar
                      ? "text-white shadow-2xl scale-105 ring-4 ring-white/30"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
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
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                      filterPillar === pillar
                        ? "bg-white/20 backdrop-blur-sm"
                        : `bg-gradient-to-br ${pillarColors[pillar]} opacity-10 group-hover:opacity-20 transition-opacity`
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillarColors[pillar]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map(({ slug, metadata }) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500/50"
              >
                {/* Gradient overlay on top */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pillarColors[metadata.pillar]}`} />
                
                <div className="absolute top-6 right-4 z-10">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pillarColors[metadata.pillar]} shadow-lg ring-2 ring-white/20`}>
                    {metadata.pillar}
                  </span>
                </div>

                <div className="p-6 sm:p-8 pt-10">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(metadata.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                    {metadata.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-6">
                    {metadata.description}
                  </p>

                  {/* Tags */}
                  {metadata.tags && metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {metadata.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>{language === "en" ? "Read article" : "Lire l'article"}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
