import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Truck,
  Timer,
  CreditCard,
  Handshake,
  Users,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";

const apiUrl = import.meta.env.VITE_API_URL;

const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out";

export default function ServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${apiUrl}/api/services`);
        const json = await res.json();
        const data = json.data || json;

        const sorted = [...data]
          .filter((s) => s.status === "published")
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        setServices(sorted);
      } catch (err) {
        console.error("Services fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = services.filter((s) =>
    search
      ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.seoDescription?.toLowerCase().includes(search.toLowerCase()) ||
        s.heroSubtitle?.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  /* ================= FEATURES ================= */

  const features = [
    {
      icon: Truck,
      title: "Nationwide Reach",
      description:
        "Next day delivery across the UK wherever your customers are.",
    },
    {
      icon: Timer,
      title: "Book in Minutes",
      description: "Online booking lets you quote, book and track instantly.",
    },
    {
      icon: CreditCard,
      title: "Cost Effective",
      description:
        "Flexible delivery options designed to reduce logistics cost.",
    },
    {
      icon: Handshake,
      title: "Flexible Solutions",
      description: "Custom delivery solutions tailored to your deadlines.",
    },
    {
      icon: Users,
      title: "Dedicated Team",
      description: "24/7 logistics support whenever you need help.",
    },
  ];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading services...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* SEO */}
      <Helmet>
        <title>Our Services | FourSix46®</title>
        <meta
          name="description"
          content="Explore FourSix46® courier services — same day, next day, nationwide and more."
        />
        <link rel="canonical" href="https://couriers.foursix46.com/services" />
        <meta property="og:title" content="Our Services | FourSix46®" />
        <meta
          property="og:description"
          content="Explore FourSix46® courier services — same day, next day, nationwide and more."
        />
        <meta
          property="og:url"
          content="https://couriers.foursix46.com/services"
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
                name: "Our Services",
                item: "https://couriers.foursix46.com/services",
              },
            ],
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="pt-24 pb-16 text-center">
        <h1 className="text-6xl font-extrabold text-[#48AEDD]">
          Our <span className="text-[#E53935]">Services</span>
        </h1>
        <p className="mt-6 text-lg text-[#134467]/80 max-w-3xl mx-auto">
          Comprehensive courier solutions designed to meet all delivery needs.
        </p>
      </section>

      {/* SEARCH */}
      <section className="container mx-auto px-6 pb-8 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50
        focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/40 text-sm"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={cn(
                "bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition",
                fadeInUp,
              )}
            >
              <f.icon className="w-8 h-8 text-[#48AEDD] mb-4" />
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-[#134467]/80">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto grid gap-8">
          {filteredServices.length === 0 && (
            <div className="text-center text-gray-500">
              {search
                ? `No services found for "${search}"`
                : "No services available"}
            </div>
          )}

          {filteredServices.map((service, index) => (
            <div
              key={service.slug}
              onClick={() => navigate(`/services/${service.slug}`)}
              className={cn(
                "cursor-pointer bg-white border rounded-[2rem] p-10",
                "hover:shadow-xl transition group",
                fadeInUp,
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h2 className="text-3xl font-bold text-[#134467] flex items-center gap-3 group-hover:text-[#E53935]">
                {service.name}
                <ArrowRight className="text-[#E53935]" />
              </h2>

              <p className="mt-4 text-[#134467]/80 text-lg">
                {service.heroSubtitle ||
                  service.seoDescription ||
                  "Click to view service details"}
              </p>

              {/* Operational badges if present */}
              {(service.serviceCoverage || service.collectionTimePromise) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.serviceCoverage && (
                    <span className="px-3 py-1 bg-blue-50 text-[#134467] text-xs font-semibold rounded-full capitalize">
                      {service.serviceCoverage}
                    </span>
                  )}
                  {service.collectionTimePromise && (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-800 text-xs font-semibold rounded-full">
                      {service.collectionTimePromise}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-24">
        <button
          onClick={() => navigate("/quick-quote")}
          className="bg-[#E53935] text-white px-10 py-5 rounded-full font-bold text-xl"
        >
          Book a Delivery Now
        </button>
      </section>

      <Footer />
    </div>
  );
}
