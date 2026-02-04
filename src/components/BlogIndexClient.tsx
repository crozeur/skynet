"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { PostSummary } from "@/lib/blog";
import { pillarToSlug, topicToSlug } from "@/lib/topicSlug";
import { getTopicLabel } from "@/lib/topicI18n";
import { polishFrenchITText } from "@/lib/polishFrenchIT";

interface TranslatedMetadata {
  title: string;
  description: string;
  tags: string[];
}

const PILLAR_COLORS: Record<string, string> = {
  SOC: "from-blue-600 to-cyan-500",
  AUDIT: "from-purple-600 to-pink-500",
  CLOUD: "from-green-600 to-teal-500",
};

export function BlogIndexClient({
  posts,
  initialPillar,
  initialTopic,
}: {
  posts: PostSummary[];
  initialPillar?: string | null;
  initialTopic?: string | null;
}) {
  const { language } = useLanguage();
  const router = useRouter();
  const [filterTag, setFilterTag] = React.useState<string | null>(null);
  const [filterPillar, setFilterPillar] = React.useState<string | null>(initialPillar ?? null);
  const [filterTopic, setFilterTopic] = React.useState<string | null>(initialTopic ?? null);
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
          title: polishFrenchITText(translatedMetadata.fr.title),
          description: polishFrenchITText(translatedMetadata.fr.description),
          tags: (translatedMetadata.fr.tags || []).map((t) => polishFrenchITText(t)),
        };
      }
    }

    setTranslatedPosts(translations);
    setIsTranslating(false);
  }, [language, posts]);

  const topicChipAccent = React.useMemo(() => {
    if (!filterPillar) {
      return {
        selected: "bg-gray-900 text-white border-gray-900 shadow",
        ring: "ring-gray-900/10 dark:ring-white/10",
        hoverBorder: "hover:border-gray-400 dark:hover:border-gray-500",
        softPanel:
          "bg-white/60 dark:bg-gray-900/40 border-gray-200/70 dark:border-gray-700/70",
      };
    }

    const gradient = `bg-gradient-to-r ${PILLAR_COLORS[filterPillar]}`;
    const ring =
      filterPillar === "SOC"
        ? "ring-blue-500/20 dark:ring-blue-400/20"
        : filterPillar === "AUDIT"
          ? "ring-purple-500/20 dark:ring-purple-400/20"
          : "ring-green-500/20 dark:ring-green-400/20";
    const hoverBorder =
      filterPillar === "SOC"
        ? "hover:border-blue-300 dark:hover:border-blue-600/60"
        : filterPillar === "AUDIT"
          ? "hover:border-purple-300 dark:hover:border-purple-600/60"
          : "hover:border-green-300 dark:hover:border-green-600/60";
    const softPanel =
      filterPillar === "SOC"
        ? "bg-gradient-to-br from-blue-50/70 via-white/60 to-cyan-50/40 dark:from-blue-950/30 dark:via-gray-950/40 dark:to-cyan-950/20 border-blue-200/50 dark:border-blue-700/40"
        : filterPillar === "AUDIT"
          ? "bg-gradient-to-br from-purple-50/70 via-white/60 to-pink-50/40 dark:from-purple-950/30 dark:via-gray-950/40 dark:to-pink-950/20 border-purple-200/50 dark:border-purple-700/40"
          : "bg-gradient-to-br from-green-50/70 via-white/60 to-teal-50/40 dark:from-green-950/30 dark:via-gray-950/40 dark:to-teal-950/20 border-green-200/50 dark:border-green-700/40";

    return {
      selected: `${gradient} text-white border-transparent shadow-lg`,
      ring,
      hoverBorder,
      softPanel,
    };
  }, [filterPillar]);

  const topicBadgeTone = React.useCallback(
    (pillar: string) => {
      if (pillar === "SOC") {
        return "bg-white/85 dark:bg-gray-950/65 text-blue-900 dark:text-blue-100 border-blue-200/70 dark:border-blue-700/50";
      }
      if (pillar === "AUDIT") {
        return "bg-white/85 dark:bg-gray-950/65 text-purple-900 dark:text-purple-100 border-purple-200/70 dark:border-purple-700/50";
      }
      return "bg-white/85 dark:bg-gray-950/65 text-green-900 dark:text-green-100 border-green-200/70 dark:border-green-700/50";
    },
    []
  );

  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(({ metadata }) => (metadata.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const basePostsForTopicCounts = React.useMemo(() => {
    let filtered = posts;
    if (filterPillar) {
      filtered = filtered.filter(({ metadata }) => metadata.pillar === filterPillar);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ({ metadata }) =>
          metadata.title.toLowerCase().includes(query) ||
          metadata.description.toLowerCase().includes(query) ||
          (metadata.tags || []).some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [posts, filterPillar, searchQuery]);

  const topicCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { metadata } of basePostsForTopicCounts) {
      const topic = metadata.topic?.trim();
      if (!topic) continue;
      counts[topic] = (counts[topic] ?? 0) + 1;
    }
    return counts;
  }, [basePostsForTopicCounts]);

  const availableTopics = React.useMemo(() => {
    const topics = new Set<string>();
    for (const { metadata } of basePostsForTopicCounts) {
      const topic = metadata.topic?.trim();
      if (topic) topics.add(topic);
    }
    return Array.from(topics).sort((a, b) => a.localeCompare(b));
  }, [basePostsForTopicCounts]);

  React.useEffect(() => {
    // If switching pillar/search makes the current topic invalid, clear it.
    if (!filterTopic) return;
    if (availableTopics.includes(filterTopic)) return;
    setFilterTopic(null);
  }, [availableTopics, filterTopic]);

  React.useEffect(() => {
    // Topics are a pillar-only concept in the UI.
    if (filterPillar === null && filterTopic !== null) {
      setFilterTopic(null);
    }
  }, [filterPillar, filterTopic]);

  const visiblePosts = React.useMemo(() => {
    let filtered = posts;
    if (filterPillar) {
      filtered = filtered.filter(({ metadata }) => metadata.pillar === filterPillar);
    }
    if (filterTopic) {
      filtered = filtered.filter(({ metadata }) => (metadata.topic || null) === filterTopic);
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
  }, [posts, filterPillar, filterTopic, filterTag, searchQuery]);

  const pillars = ["SOC", "AUDIT", "CLOUD"] as const;
  const pageSize = 9;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / pageSize));
  const pagedPosts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return visiblePosts.slice(start, start + pageSize);
  }, [visiblePosts, page]);

  const pagedStart = visiblePosts.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const pagedEnd = Math.min(page * pageSize, visiblePosts.length);
  React.useEffect(() => {
    // Reset to first page on filter/search change
    setPage(1);
  }, [filterPillar, filterTopic, filterTag, searchQuery]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Subtle background effects (light mode) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_45%_85%,rgba(99,102,241,0.10),transparent_40%)] dark:hidden" />

        {/* Soft blobs */}
        <div className="absolute -top-36 -right-36 h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-3xl dark:hidden" />
        <div className="absolute -bottom-44 -left-44 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl dark:hidden" />

        {/* Faint grid for depth (only really visible in light mode) */}
        <div className="absolute inset-0 opacity-[0.22] dark:opacity-0 [background-image:linear-gradient(to_right,rgba(59,130,246,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.10)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]" />
      </div>

      <Container className="relative py-8 sm:py-12 lg:py-16">
        {/* Modern Hero Section */}
        <div className="relative mb-16 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-white/5 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {language === "en" ? "Knowledge Hub" : "Centre de Ressources"}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {language === "en" ? "Cybersecurity" : "Cybersécurité"}
                </span>
              </span>
              <span className="block">
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
                  {language === "en" ? "Insights" : "& Expertise"}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
              {language === "en"
                ? "Expert knowledge on SOC, security audits & cloud security"
                : "Expertise en SOC, audits de sécurité et sécurité cloud"}
            </p>

            {/* Search Bar with enhanced design */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 rounded-xl backdrop-blur-sm group-focus-within:border-blue-500 dark:group-focus-within:border-blue-400 group-focus-within:shadow-2xl group-focus-within:shadow-blue-500/20 transition-all duration-300">
                  <svg 
                    className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors ml-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "en" ? "Search articles..." : "Rechercher des articles..."}
                    className="flex-1 px-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="pr-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise Section */}
        {pillars.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl sm:text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
                  {language === "en" ? "Explore Our Expertise" : "Découvrez notre Expertise"}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {language === "en"
                  ? "Browse our specialized content across three core areas"
                  : "Explorez nos contenus spécialisés dans trois domaines clés"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => {
                  setFilterPillar(null);
                  setFilterTopic(null);
                }}
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
                  onClick={() => {
                    setFilterPillar(pillar);
                    // Keep topic only if it exists for that pillar.
                  }}
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${PILLAR_COLORS[pillar]} opacity-0 group-hover:opacity-15 transition-opacity duration-300`} />
                  )}
                </button>
              ))}
            </div>

            {/* Topic chips (only after selecting a pillar) */}
            {filterPillar && (
              <div className="mt-7 max-w-5xl mx-auto">
                <div className="sticky top-4 z-30">
                  <div className={`relative overflow-hidden rounded-2xl border ${topicChipAccent.softPanel} backdrop-blur-sm shadow-[0_18px_70px_-50px_rgba(59,130,246,0.35)] dark:shadow-[0_18px_70px_-50px_rgba(0,0,0,0.55)]`}>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70" style={{
                    background:
                      filterPillar === 'SOC'
                        ? 'linear-gradient(90deg, rgb(37,99,235), rgb(6,182,212))'
                        : filterPillar === 'AUDIT'
                          ? 'linear-gradient(90deg, rgb(147,51,234), rgb(236,72,153))'
                          : 'linear-gradient(90deg, rgb(22,163,74), rgb(20,184,166))',
                  }} />

                  <div className="relative p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-sm font-bold tracking-wide text-gray-800 dark:text-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${PILLAR_COLORS[filterPillar]} shadow-sm`} aria-hidden />
                      {language === "en" ? "Topics" : "Sous-thèmes"}
                    </span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {filterPillar && filterTopic && (
                      <Link
                        href={`/blog/${pillarToSlug(filterPillar)}/${topicToSlug(filterTopic)}`}
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        title={language === "en" ? "Open topic page" : "Ouvrir la page du sous-thème"}
                      >
                        {language === "en" ? "Open page" : "Ouvrir"}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setFilterTopic(null);
                        setFilterTag(null);
                        setSearchQuery("");
                      }}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      {language === "en" ? "Reset" : "Réinitialiser"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto py-1 -mx-2 px-2 sm:flex-wrap sm:overflow-visible sm:px-0 sm:mx-0">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterTopic(null);
                    }}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                      filterTopic === null
                        ? `${topicChipAccent.selected} ring-2 ${topicChipAccent.ring}`
                        : `bg-white/80 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 ${topicChipAccent.hoverBorder}`
                    }`}
                  >
                    {filterTopic === null && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {language === "en" ? "All topics" : "Tous les sous-thèmes"}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${filterTopic === null ? "bg-white/15" : "bg-gray-100 dark:bg-gray-800"}`}>
                      {basePostsForTopicCounts.length}
                    </span>
                  </button>

                  {availableTopics.map((topic) => {
                    const selected = filterTopic === topic;
                    const count = topicCounts[topic] ?? 0;
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setFilterTopic(topic);
                        }}
                        aria-pressed={selected}
                        className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                          selected
                            ? `${topicChipAccent.selected} ring-2 ${topicChipAccent.ring}`
                            : `bg-white/80 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 ${topicChipAccent.hoverBorder} hover:shadow`
                        }`}
                      >
                        {selected && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span className="truncate max-w-[16rem]">{getTopicLabel(topic, language)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selected ? "bg-white/15" : "bg-gray-100 dark:bg-gray-800"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {language === "en" ? "Topics for" : "Sous-thèmes pour"} <span className="font-semibold text-gray-700 dark:text-gray-200">{filterPillar}</span>
                </p>
                  </div>
                  </div>
                </div>
              </div>
            )}
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
            {visiblePosts.length > 0 && totalPages > 1 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {language === "en"
                ? `Showing ${pagedStart}–${pagedEnd} (page ${page}/${totalPages})`
                : `Affichage ${pagedStart}–${pagedEnd} (page ${page}/${totalPages})`}
            </p>
          )}
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
            {pagedPosts.map(({ slug, slugEn, slugFr, metadata, readingTimeMinutes }) => (
              <Link
                key={slug}
                href={
                  language === "fr"
                    ? `/fr/blog/${slugFr || slug}`
                    : `/blog/${slugEn || slug}`
                }
                className="group relative h-full rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3"
              >
                {/* Background with gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${PILLAR_COLORS[metadata.pillar]} opacity-25 dark:opacity-0 group-hover:opacity-40 dark:group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                {/* Card container */}
                <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/70 to-cyan-50/60 dark:bg-none dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:border-transparent overflow-hidden">
                  
                  {/* Cover image/gradient section */}
                  {metadata.coverImage ? (
                    <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {/* Use a stable aspect ratio (less cropping than a short fixed height) */}
                      <div className="relative aspect-[16/9] sm:aspect-[16/8]">
                        {/* Blurred background so the image always looks full + premium */}
                        <Image
                          src={metadata.coverImage}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover scale-110 blur-2xl opacity-70 saturate-150 contrast-110 transition-transform duration-700 group-hover:scale-[1.15]"
                        />
                        {/* Foreground image (contain = minimal crop). No solid frame: leftover area shows blurred background. */}
                        <div className="absolute inset-0 p-3 sm:p-4">
                          <div className="relative h-full w-full">
                            <Image
                              src={metadata.coverImage}
                              alt={metadata.coverAlt ?? "Blog cover"}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-contain drop-shadow-[0_30px_90px_rgba(0,0,0,0.40)] transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        {/* Subtle vignette + contrast overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 group-hover:to-black/55 transition-colors duration-500" />
                        <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_60%)] opacity-70" />
                      </div>
                    </div>
                  ) : (
                    <div className={`h-48 sm:h-52 w-full bg-gradient-to-br ${PILLAR_COLORS[metadata.pillar]} relative overflow-hidden`}>
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
                  <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${PILLAR_COLORS[metadata.pillar]} shadow-lg ring-2 ring-white/30 backdrop-blur-sm group-hover:ring-white/50 transition-all duration-500`}>
                      {metadata.pillar}
                    </span>
                    {metadata.topic && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const url = `/blog/${pillarToSlug(metadata.pillar)}/${topicToSlug(metadata.topic ?? "")}`;
                          router.push(url);
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur shadow ${topicBadgeTone(metadata.pillar)} hover:shadow-md transition-shadow`}
                        title={language === "en" ? "View topic" : "Voir le sous-thème"}
                      >
                        {getTopicLabel(metadata.topic, language)}
                      </button>
                    )}
                  </div>

                  {/* Content section */}
                  <div className="flex-1 flex flex-col p-6 sm:p-7 bg-gradient-to-br from-slate-50/95 via-blue-50/75 to-cyan-50/60 dark:bg-none dark:bg-gray-900 group-hover:from-slate-50/95 group-hover:to-cyan-50/70 dark:group-hover:from-gray-900/95 dark:group-hover:to-gray-800/95 transition-all duration-500">
                    
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
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-45 dark:opacity-0 group-hover:opacity-70 dark:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
