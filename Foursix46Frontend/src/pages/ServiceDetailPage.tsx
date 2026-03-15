import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Truck,
  Package,
  ChevronRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const apiUrl = import.meta.env.VITE_API_URL;
const fadeUp =
  "animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  /* ── Fetch service ── */
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/services/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setService(json.data || json);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── Fetch FAQs by faqIds ── */
  useEffect(() => {
    if (!service?.faqIds?.length) return;
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/api/faqs`);
        if (!res.ok) return;
        const data = await res.json();
        const all: any[] = data.data || data;
        setFaqs(all.filter((f) => service.faqIds.includes(f.id)));
      } catch {
        /* silent */
      }
    })();
  }, [service]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[60vh] sm:h-[75vh] bg-slate-200 animate-pulse" />
        <div className="max-w-3xl mx-auto px-5 py-14 space-y-4">
          {[80, 65, 50].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-slate-100 rounded animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!service || service.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
        <div className="text-7xl sm:text-8xl font-black text-[#48AEDD]">
          404
        </div>
        <p className="text-lg sm:text-xl text-[#134467]/60 font-medium">
          Service not found
        </p>
        <button
          onClick={() => navigate("/services")}
          className="mt-4 flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#134467]/90 transition"
        >
          <ArrowLeft size={18} /> Back to Services
        </button>
      </div>
    );
  }

  const heroImage =
    !imgError && service.heroImage
      ? service.heroImage
      : "/FourSix_truckimage.jpg";

  const canonicalUrl =
    service.canonicalUrl ||
    `https://couriers.foursix46.com/services/${service.slug}`;

  const vehicleTypes: string[] = Array.isArray(service.vehicleTypes)
    ? service.vehicleTypes
    : [];
  const whatWeCarry: string[] = Array.isArray(service.whatWeCarry)
    ? service.whatWeCarry
    : [];
  const relatedSectors: any[] = service.relatedSectors || [];
  const featuredLocations: any[] = service.featuredLocations || [];

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white">
      {/* ── SEO ── */}
      <Helmet>
        <title>{service.seoTitle || service.name} | FourSix46®</title>
        <meta name="description" content={service.seoDescription || ""} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={service.seoTitle || service.name} />
        <meta
          property="og:description"
          content={service.seoDescription || ""}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            service.ogImage || "https://couriers.foursix46.com/og-default.jpg"
          }
        />
        {service.noindex && <meta name="robots" content="noindex,nofollow" />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.seoDescription,
            provider: {
              "@type": "Organization",
              name: "FourSix46®",
              url: "https://couriers.foursix46.com",
            },
            areaServed: "United Kingdom",
          })}
        </script>
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
              {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: canonicalUrl,
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://couriers.foursix46.com/#business",
            name: "FourSix46® Couriers",
            url: "https://couriers.foursix46.com",
            telephone: "+447393363802",
            image:
              service.ogImage ||
              "https://couriers.foursix46.com/og-default.jpg",
            description: service.seoDescription || "",
            address: {
              "@type": "PostalAddress",
              addressCountry: "GB",
            },
            areaServed: "United Kingdom",
            sameAs: [
              "https://www.instagram.com/foursix46hq/",
              "https://www.facebook.com/share/1A15gqnztd/",
              "https://www.linkedin.com/company/foursix46-couriers/",
            ],
          })}
        </script>

        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq: any) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            })}
          </script>
        )}
      </Helmet>

      {/* ══════════════════════
          HERO
      ══════════════════════ */}
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-end overflow-hidden bg-[#0d2d47]">
        {/* Hero image — ✅ <img> tag, NOT background-image */}
        <img
          src={heroImage}
          alt={service.heroTitle || service.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/60 to-[#0d2d47]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/80 via-transparent to-transparent" />

        {/* ✅ Back button — top-20 so it's tighter under the navbar */}
        <button
          onClick={() => navigate("/services")}
          className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
            text-white/90 hover:text-[#F5EB18] text-sm font-semibold
            bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full
            border border-white/20 transition-all hover:bg-white/15"
        >
          <ArrowLeft size={15} />
          <span className="hidden xs:inline">All Services</span>
          <span className="xs:hidden">Back</span>
        </button>

        {/* Hero content — sits above wave */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20 pt-36 sm:pt-32">
          {/* Service badge */}
          <div className={cn("mb-4", fadeUp)}>
            <span
              className="inline-block bg-[#F5EB18] text-[#134467] text-xs font-black
              uppercase tracking-widest px-4 py-1.5 rounded-full"
            >
              {service.serviceCoverage
                ? `${service.serviceCoverage} service`
                : "Courier Service"}
            </span>
          </div>

          {/* Title */}
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-7xl font-black text-white",
              "leading-[1.05] mb-4 max-w-3xl",
              fadeUp,
            )}
          >
            {service.heroTitle || service.name}
          </h1>

          {/* Subtitle */}
          {service.heroSubtitle && (
            <p
              className={cn(
                "text-base sm:text-lg text-white/75 max-w-2xl mb-8 leading-relaxed",
                fadeUp,
              )}
            >
              {service.heroSubtitle}
            </p>
          )}

          {/* Quick-stat chips */}
          <div
            className={cn(
              "flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10",
              fadeUp,
            )}
          >
            {service.collectionTimePromise && (
              <Chip
                icon={<Clock className="w-4 h-4 text-[#F5EB18]" />}
                label={service.collectionTimePromise}
              />
            )}
            {service.serviceCoverage && (
              <Chip
                icon={<MapPin className="w-4 h-4 text-[#48AEDD]" />}
                label={`${service.serviceCoverage} Coverage`}
                capitalize
              />
            )}
            {vehicleTypes.length > 0 && (
              <Chip
                icon={<Truck className="w-4 h-4 text-[#E53935]" />}
                label={`${vehicleTypes.length} Vehicle Type${vehicleTypes.length > 1 ? "s" : ""}`}
              />
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate(service.ctaPrimaryLink || "/quick-quote")}
            className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
              active:scale-95 text-white font-black uppercase tracking-wide
              px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
              shadow-xl shadow-red-900/40 transition-all hover:scale-105
              w-full sm:w-auto justify-center"
          >
            {service.ctaPrimaryText || "Get a Quote"}
          </button>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 56"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-14"
          >
            <path
              d="M0 56L1440 56L1440 20C1200 56 960 0 720 20C480 40 240 0 0 20Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════
          INTRO
      ══════════════════════ */}
      {service.intro && (
        <section className="max-w-3xl mx-auto py-14 sm:py-20 px-5 sm:px-6 text-center">
          <div
            dangerouslySetInnerHTML={{ __html: service.intro }}
            className="text-lg sm:text-xl text-[#134467]/75 leading-relaxed
              prose prose-lg max-w-none prose-p:text-[#134467]/75"
          />
        </section>
      )}

      {/* ══════════════════════
          VEHICLE TYPES & WHAT WE CARRY
      ══════════════════════ */}
      {(vehicleTypes.length > 0 || whatWeCarry.length > 0) && (
        <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {vehicleTypes.length > 0 && (
              <TagBlock
                title="Vehicle Types"
                icon={<Truck className="w-5 h-5 text-[#48AEDD]" />}
                items={vehicleTypes}
                scheme="blue"
              />
            )}
            {whatWeCarry.length > 0 && (
              <TagBlock
                title="What We Carry"
                icon={<Package className="w-5 h-5 text-[#E53935]" />}
                items={whatWeCarry}
                scheme="red"
              />
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════
          CONTENT BLOCKS
      ══════════════════════ */}
      {service.contentBlocks?.length > 0 && (
        <section>
          <BlockRenderer blocks={service.contentBlocks} />
        </section>
      )}

      {/* ══════════════════════
          RELATED SECTORS
      ══════════════════════ */}
      {relatedSectors.length > 0 && (
        <RelationSection
          title="Related Sectors"
          subtitle="Industries we serve with this service"
          items={relatedSectors}
          path="/sectors"
          navigate={navigate}
          accent="#48AEDD"
        />
      )}

      {/* ══════════════════════
          FEATURED LOCATIONS
      ══════════════════════ */}
      {featuredLocations.length > 0 && (
        <RelationSection
          title="Available Locations"
          subtitle="Areas covered by this service"
          items={featuredLocations}
          path="/locations"
          navigate={navigate}
          accent="#134467"
          bg="bg-slate-50"
        />
      )}

      {/* ══════════════════════
          FAQs
      ══════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#134467]/10 mb-5"
              >
                FAQs
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#134467]">
                {service.faqHeading || "Frequently Asked Questions"}
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <AccordionItem
                  key={faq.id || i}
                  value={`faq-${i}`}
                  className={cn(
                    "border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white transition-all",
                    "data-[state=open]:border-[#48AEDD] data-[state=open]:shadow-md",
                    "data-[state=open]:ring-1 data-[state=open]:ring-[#48AEDD]/20",
                  )}
                >
                  <AccordionTrigger
                    className="px-5 sm:px-6 py-5 text-left font-bold
                    text-[#134467] hover:no-underline text-[15px] sm:text-base"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="px-5 sm:px-6 pb-6 text-slate-600
                    leading-relaxed border-t border-slate-50 pt-4"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                      className="prose prose-sm max-w-none"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ══════════════════════
          FINAL CTA BANNER
      ══════════════════════ */}
      <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 sm:w-[500px] h-80 sm:h-[500px]
          bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none"
        />
        <div
          className="absolute bottom-0 left-0 w-64 sm:w-[400px] h-64 sm:h-[400px]
          bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-5 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Ready to get started?
          </h2>
          <p className="text-white/65 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Get an instant quote — same-day dispatch available across the UK
            mainland.
          </p>
          <button
            onClick={() => navigate(service.ctaPrimaryLink || "/quick-quote")}
            className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
              active:scale-95 text-white font-black uppercase tracking-wide
              px-10 sm:px-14 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
              shadow-2xl shadow-red-900/40 transition-all hover:scale-105
              w-full sm:w-auto justify-center"
          >
            {service.ctaPrimaryText || "Get a Quote"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ══════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════ */

function Chip({
  icon,
  label,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  capitalize?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm
      border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5"
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={cn(
          "text-white font-semibold text-xs sm:text-sm",
          capitalize && "capitalize",
        )}
      >
        {label}
      </span>
    </div>
  );
}

const TagBlock = ({
  title,
  icon,
  items,
  scheme,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  scheme: "blue" | "red";
}) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-bold text-sm text-[#134467] uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={cn(
            "px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border",
            scheme === "red"
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-blue-50 text-blue-700 border-blue-100",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const RelationSection = ({
  title,
  subtitle,
  items,
  path,
  navigate,
  accent,
  bg = "bg-white",
}: {
  title: string;
  subtitle?: string;
  items: any[];
  path: string;
  navigate: (to: string) => void;
  accent: string;
  bg?: string;
}) => (
  <section className={cn("py-16 sm:py-20", bg)}>
    <div className="max-w-6xl mx-auto px-5 sm:px-6">
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-black text-[#134467]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-500 mt-2 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item: any, i: number) => {
          const itemSlug = typeof item === "string" ? item : item.slug;
          const name =
            typeof item === "string" ? item.replace(/-/g, " ") : item.name;
          return (
            <div
              key={`${itemSlug}-${i}`}
              onClick={() => navigate(`${path}/${itemSlug}`)}
              className="group cursor-pointer bg-white border border-slate-100
                p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all
                capitalize font-bold text-[#134467] flex items-center justify-between"
              style={{ borderLeft: `4px solid ${accent}` }}
            >
              <span className="group-hover:underline underline-offset-2">
                {name}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
