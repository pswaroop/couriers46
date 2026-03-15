import React, { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";

const apiUrl = import.meta.env.VITE_API_URL;

const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out";

// Strip HTML tags for safe card preview text
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function SectorsPage() {
  const navigate = useNavigate();

  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH SECTORS ================= */

  useEffect(() => {
    async function fetchSectors() {
      try {
        const res = await fetch(`${apiUrl}/api/sectors`);
        if (!res.ok) throw new Error("Failed to fetch sectors");
        const json = await res.json();
        const data = json.data || json;

        const published = Array.isArray(data)
          ? data
              .filter((s) => s.status === "published")
              .filter((s) =>
                search
                  ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
                    s.seoDescription
                      ?.toLowerCase()
                      .includes(search.toLowerCase())
                  : true,
              )
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          : [];

        setSectors(published);
      } catch (error) {
        console.error("Sector fetch error:", error);
        setSectors([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSectors();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading sectors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* SEO */}
      <Helmet>
        <title>Industry Sectors | FourSix46®</title>
        <meta
          name="description"
          content="Specialist courier services for dental, aerospace, medical and more industries across the UK."
        />
        <link rel="canonical" href="https://couriers.foursix46.com/sectors" />
        <meta property="og:title" content="Industry Sectors | FourSix46®" />
        <meta
          property="og:description"
          content="Specialist courier services for dental, aerospace, medical and more industries across the UK."
        />
        <meta
          property="og:url"
          content="https://couriers.foursix46.com/sectors"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://couriers.foursix46.com/og-default.jpg"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://couriers.foursix46.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Industry Sectors",
                item: "https://couriers.foursix46.com/sectors",
              },
            ],
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="pt-24 pb-16 text-center">
        <h1 className="text-6xl font-extrabold text-[#48AEDD]">
          Industry <span className="text-[#E53935]">Sectors</span>
        </h1>
        <p className="mt-6 text-lg text-[#134467]/80 max-w-3xl mx-auto">
          Specialist courier knowledge for every industry we serve.
        </p>
      </section>

      {/* SEARCH */}
      <section className="container mx-auto px-6 pb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50
        focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/40 text-sm"
          />
        </div>
      </section>

      {/* SECTORS GRID */}
      <section className="container mx-auto px-6 pb-24">
        {sectors.length === 0 ? (
          <p className="text-center text-gray-500">No sectors available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <div
                key={sector.slug}
                onClick={() => navigate(`/sectors/${sector.slug}`)}
                className={cn(
                  "cursor-pointer bg-white border rounded-3xl p-8",
                  "hover:shadow-xl transition group",
                  fadeInUp,
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {sector.heroImage && (
                  <img
                    src={sector.heroImage}
                    alt={sector.name}
                    className="w-full h-36 object-cover rounded-2xl mb-5"
                  />
                )}

                <h2 className="text-2xl font-bold text-[#134467] mb-3 group-hover:text-[#E53935] transition">
                  {sector.name}
                </h2>

                {/* ✅ strip HTML before displaying as plain text */}
                {sector.intro && (
                  <p className="text-[#134467]/70 mb-5 line-clamp-3 text-sm">
                    {stripHtml(sector.intro)}
                  </p>
                )}

                {!sector.intro && sector.seoDescription && (
                  <p className="text-[#134467]/70 mb-5 line-clamp-3 text-sm">
                    {sector.seoDescription}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[#E53935] font-semibold text-sm">
                  Explore Sector
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
