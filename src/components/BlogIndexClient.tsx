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
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent mb-6">
            {language === "en" ? "Skynet Consulting Blog" : "Blog Skynet Consulting"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {language === "en"
              ? "Concrete insights on cybersecurity, Law 18-07, and managed SOCs for Algeria and the region."
              : "Analyses concrètes sur la cybersécurité, la loi 18‑07 et les SOC gérés pour l'Algérie et la région."}
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

        {/* Pillar Filters */}
        {pillars.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setFilterPillar(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filterPillar === null
                  ? "bg-gray-800 dark:bg-gray-700 text-white border-gray-600"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {language === "en" ? "All Pillars" : "Tous les piliers"}
            </button>
            {pillars.map((pillar) => (
              <button
                key={pillar}
                type="button"
                onClick={() => setFilterPillar(pillar)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filterPillar === pillar
                    ? `bg-gradient-to-r ${pillarColors[pillar]} text-white border-transparent`
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {pillar}
              </button>
            ))}
          </div>
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setFilterTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                filterTag === null
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800"
              }`}
            >
              {language === "en" ? "All" : "Tous"}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  filterTag === tag
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
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
