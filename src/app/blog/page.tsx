"use client";

import { Container } from "@/components/Container";
import { getAllBlogPosts } from "@/lib/blog";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

export default function BlogPage() {
  const { language } = useLanguage();
  const posts = getAllBlogPosts();

  const pillarColors = {
    SOC: "from-blue-600 to-cyan-500",
    AUDIT: "from-purple-600 to-pink-500",
    CLOUD: "from-green-600 to-teal-500",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Container className="py-16 sm:py-20 lg:py-24">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent mb-6">
            {language === "en" ? "Skynet Consulting Blog" : "Blog Skynet Consulting"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {language === "en" 
              ? "Concrete insights on cybersecurity, Law 18-07, and managed SOCs for Algeria and the region."
              : "Analyses concrètes sur la cybersécurité, la loi 18‑07 et les SOC gérés pour l'Algérie et la région."}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Pillar Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pillarColors[post.pillar]} shadow-lg`}
                >
                  {post.pillar}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-8">
                {/* Date */}
                <time className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {new Date(post.date).toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>

                {/* Title */}
                <h2 className="mt-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{language === "en" ? "Read article" : "Lire l'article"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
