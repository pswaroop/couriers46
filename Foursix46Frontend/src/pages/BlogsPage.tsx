import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ArrowRight, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

const apiUrl = import.meta.env.VITE_API_URL;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  publishedDate?: string;
  featuredImage?: string;
  isFeatured?: boolean;
  status: string;
}

export default function BlogsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${apiUrl}/api/blog`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ] as string[];

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filtered.find((p) => p.isFeatured);
  const regularPosts = filtered.filter(
    (p) => !p.isFeatured || p !== featuredPost,
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative bg-[#134467] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F5EB18] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#48AEDD]/20 text-[#48AEDD] text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              Insights & News
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              The Route46 <span className="text-[#F5EB18]">Blogs</span>
            </h1>
            <p className="text-[#48AEDD]/80 text-xl max-w-2xl mx-auto">
              Industry insights, courier tips, and company updates from the
              Route46 team.
            </p>
          </motion.div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-[#134467] text-white border-[#134467]"
                    : "bg-white text-[#134467] border-slate-200 hover:border-[#134467]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* ── Loading ──────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#134467]" />
          </div>
        )}

        {/* ── Empty ────────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-medium">
              No posts found.
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Try a different search or category.
            </p>
          </div>
        )}

        {/* ── Featured Post ────────────────────────────── */}
        {!loading && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            className="group cursor-pointer mb-12 rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-shadow grid md:grid-cols-2"
          >
            {/* Image */}
            <div className="relative h-64 md:h-auto bg-slate-100 overflow-hidden">
              {featuredPost.featuredImage ? (
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#134467] to-[#48AEDD] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/30" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#F5EB18] text-[#134467] font-bold text-xs px-3">
                  ★ Featured
                </Badge>
              </div>
            </div>
            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
              {featuredPost.category && (
                <Badge
                  variant="outline"
                  className="w-fit text-xs text-[#134467] border-[#134467]/30 mb-4"
                >
                  {featuredPost.category}
                </Badge>
              )}
              <h2 className="text-2xl md:text-3xl font-black text-[#134467] mb-3 group-hover:text-[#E53935] transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              {featuredPost.excerpt && (
                <p className="text-slate-500 text-base mb-6 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-slate-400">
                  {featuredPost.authorName && (
                    <span className="font-semibold text-[#134467]">
                      {featuredPost.authorName}
                    </span>
                  )}
                  {featuredPost.publishedDate && (
                    <span className="ml-2">
                      ·{" "}
                      {new Date(featuredPost.publishedDate).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-[#E53935] group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Post Grid ────────────────────────────────── */}
        {!loading && regularPosts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group cursor-pointer rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#134467]/10 to-[#48AEDD]/20 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-[#134467]/20" />
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 text-[#134467] text-xs font-bold px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>
                {/* Body */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#134467] mb-2 group-hover:text-[#E53935] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
                    <span className="font-medium text-[#134467]/70">
                      {post.authorName ?? "FourSix46® Team"}
                    </span>
                    {post.publishedDate && (
                      <span>
                        {new Date(post.publishedDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
