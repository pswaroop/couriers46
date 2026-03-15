import React, { useEffect, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
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

export default function LocationsPage() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH LOCATIONS ================= */

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch(`${apiUrl}/api/locations`);
        if (!res.ok) throw new Error("Failed to fetch locations");
        const json = await res.json();
        const data = json.data || json || [];
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Location fetch error:", err);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading locations...
      </div>
    );
  }

  /* ================= FILTER + GROUP BY COUNTRY ================= */

  const publishedLocations = locations
    .filter((loc) => loc.status === "published")
    .filter((loc) =>
      search
        ? loc.name?.toLowerCase().includes(search.toLowerCase()) ||
          loc.postcodeCoverage?.toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Group by country for organised display
  const countryOrder = ["England", "Wales", "Scotland", "Northern Ireland"];
  const groupedByCountry = countryOrder.reduce(
    (acc, country) => {
      const locs = publishedLocations.filter((loc) => loc.country === country);
      if (locs.length > 0) acc[country] = locs;
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Locations with no country set — show in "Other"
  const uncategorised = publishedLocations.filter(
    (loc) => !loc.country || !countryOrder.includes(loc.country),
  );
  if (uncategorised.length > 0) groupedByCountry["Other"] = uncategorised;

  const hasGroups = Object.keys(groupedByCountry).length > 0;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* SEO */}
      <Helmet>
        <title>Locations We Serve | FourSix46®</title>
        <meta
          name="description"
          content="Explore cities and regions where FourSix46® provides reliable courier services."
        />
        <link rel="canonical" href="https://couriers.foursix46.com/locations" />
        <meta property="og:title" content="Locations We Serve | FourSix46®" />
        <meta
          property="og:description"
          content="Explore cities and regions where FourSix46® provides reliable courier services."
        />
        <meta
          property="og:url"
          content="https://couriers.foursix46.com/locations"
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
                name: "Locations",
                item: "https://couriers.foursix46.com/locations",
              },
            ],
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="pt-24 pb-16 text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <span
            className={cn(
              "inline-block py-1.5 px-4 rounded-full bg-[#48AEDD]/10 text-[#134467] font-bold text-xs uppercase mb-6",
              fadeInUp,
            )}
          >
            Where We Serve
          </span>
          <h1
            className={cn(
              "text-5xl sm:text-6xl font-extrabold text-[#48AEDD] mb-6",
              fadeInUp,
            )}
          >
            Our <span className="text-[#E53935]">Locations</span>
          </h1>
          <p className="text-lg text-[#134467]/80 max-w-3xl mx-auto">
            Discover courier services available in your city.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="container mx-auto px-6 pb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city or postcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50
        focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/40 text-sm"
          />
        </div>
      </section>

      {/* LOCATIONS GRID — grouped by country */}
      <section className="container mx-auto px-6 pb-24">
        {!hasGroups ? (
          <div className="text-center text-gray-500">
            No locations available.
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-16">
            {Object.entries(groupedByCountry).map(([country, locs]) => (
              <div key={country}>
                {/* Country heading */}
                <h2 className="text-2xl font-bold text-[#134467] mb-6 pb-2 border-b-2 border-[#F1C40F]">
                  {country}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {locs.map((location, index) => {
                    // ✅ strip HTML before using as preview text
                    const previewText = location.intro
                      ? stripHtml(location.intro)
                      : location.seoDescription || "";

                    return (
                      <div
                        key={location.slug}
                        onClick={() => navigate(`/locations/${location.slug}`)}
                        className={cn(
                          "cursor-pointer group bg-white border border-slate-200 rounded-[2.5rem] p-8",
                          "hover:shadow-xl hover:-translate-y-1 transition-all duration-500",
                          fadeInUp,
                        )}
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="text-[#E53935]" size={20} />
                          <h3 className="text-2xl font-bold text-[#134467] group-hover:text-[#E53935] transition">
                            {location.name}
                          </h3>
                        </div>

                        {previewText && (
                          <p className="text-[#134467]/70 mb-5 line-clamp-3 text-sm">
                            {previewText}
                          </p>
                        )}

                        {location.postcodeCoverage && (
                          <p className="text-xs text-[#134467]/50 mb-4">
                            Postcodes: {location.postcodeCoverage}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[#E53935] font-semibold text-sm">
                          Explore Location
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    );
                  })}
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
