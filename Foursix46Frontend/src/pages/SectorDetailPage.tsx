import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin, Layers } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const apiUrl = import.meta.env.VITE_API_URL;
const fadeUp =
  "animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out";

export default function SectorDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sector, setSector] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoading(true);

        // 1) Fetch sector
        const sectorRes = await fetch(`${apiUrl}/api/sectors/${slug}`);
        if (!sectorRes.ok) throw new Error("Not found");
        const sectorJson = await sectorRes.json();
        const sectorData = sectorJson.data || sectorJson;
        setSector(sectorData);

        // 2) Fetch FAQs and filter for this sector
        try {
          const faqRes = await fetch(`${apiUrl}/api/faqs`);
          if (faqRes.ok) {
            const allFaqs = await faqRes.json();

            // Adjust this to your actual schema:
            // Example A: each FAQ has sectorSlug
            const allFaqsArray: any[] = allFaqs.data || allFaqs || [];
            const sectorFaqs = sectorData.faqIds?.length
              ? allFaqsArray.filter((faq: any) =>
                  sectorData.faqIds.includes(faq.id),
                )
              : [];

            // Example B (alternative): tag-based
            // const sectorFaqs = (allFaqs || []).filter(
            //   (faq: any) =>
            //     faq.status === "published" &&
            //     (faq.tags?.includes(sectorData.slug) ||
            //       faq.tags?.includes(sectorData.name))
            // );

            setFaqs(sectorFaqs);
          } else {
            setFaqs([]);
          }
        } catch {
          setFaqs([]);
        }
      } catch {
        setSector(null);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

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
  if (!sector || sector.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
        <div className="text-7xl sm:text-8xl font-black text-[#48AEDD]">
          404
        </div>
        <p className="text-lg sm:text-xl text-[#134467]/60 font-medium">
          Sector not found
        </p>
        <button
          onClick={() => navigate("/sectors")}
          className="mt-4 flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#134467]/90 transition"
        >
          <ArrowLeft size={18} /> Back to Sectors
        </button>
      </div>
    );
  }

  const heroImage =
    !imgError && sector.heroImage
      ? sector.heroImage
      : "/FourSix_truckimage.jpg";
  const canonicalUrl =
    sector.canonicalUrl ||
    `https://couriers.foursix46.com/sectors/${sector.slug}`;

  const recommendedServices: any[] = sector.recommendedServices || [];
  const featuredLocations: any[] = sector.featuredLocations || [];

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white">
      {/* ── SEO ── */}
      <Helmet>
        <title>{sector.seoTitle || sector.name} | FourSix46®</title>
        <meta name="description" content={sector.seoDescription || ""} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={sector.seoTitle || sector.name} />
        <meta property="og:description" content={sector.seoDescription || ""} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            sector.ogImage || "https://couriers.foursix46.com/og-default.jpg"
          }
        />
        {sector.noindex && <meta name="robots" content="noindex,nofollow" />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: sector.name,
            description: sector.seoDescription,
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
                name: "Industry Sectors",
                item: "https://couriers.foursix46.com/sectors",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: sector.name,
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
              sector.ogImage || "https://couriers.foursix46.com/og-default.jpg",
            description: sector.seoDescription || "",
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
        {/* Hero image */}
        <img
          src={heroImage}
          alt={sector.heroTitle || sector.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/60 to-[#0d2d47]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/sectors")}
          className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
            text-white/90 hover:text-[#F5EB18] text-sm font-semibold
            bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full
            border border-white/20 transition-all hover:bg-white/15"
        >
          <ArrowLeft size={15} />
          <span className="hidden xs:inline">All Sectors</span>
          <span className="xs:hidden">Back</span>
        </button>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20 pt-36 sm:pt-32">
          {/* Badge */}
          <div className={cn("mb-4", fadeUp)}>
            <span
              className="inline-block bg-[#F5EB18] text-[#134467] text-xs font-black
              uppercase tracking-widest px-4 py-1.5 rounded-full"
            >
              Industry Sector
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
            {sector.heroTitle || sector.name}
          </h1>

          {/* Subtitle */}
          {sector.heroSubtitle && (
            <p
              className={cn(
                "text-base sm:text-lg text-white/75 max-w-2xl mb-8 sm:mb-10 leading-relaxed",
                fadeUp,
              )}
            >
              {sector.heroSubtitle}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate("/quick-quote")}
            className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
              active:scale-95 text-white font-black uppercase tracking-wide
              px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
              shadow-xl shadow-red-900/40 transition-all hover:scale-105
              w-full sm:w-auto justify-center"
          >
            Get a Quote
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
      {sector.intro && (
        <section className="max-w-3xl mx-auto py-14 sm:py-20 px-5 sm:px-6 text-center">
          <div
            dangerouslySetInnerHTML={{ __html: sector.intro }}
            className="text-lg sm:text-xl text-[#134467]/75 leading-relaxed
              prose prose-lg max-w-none prose-p:text-[#134467]/75"
          />
        </section>
      )}

      {/* ══════════════════════
          CONTENT BLOCKS
      ══════════════════════ */}
      {sector.contentBlocks?.length > 0 && (
        <section>
          <BlockRenderer blocks={sector.contentBlocks} />
        </section>
      )}

      {/* ══════════════════════
          RECOMMENDED SERVICES
      ══════════════════════ */}
      {recommendedServices.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border
                border-[#134467]/10 mb-4"
              >
                Our Services
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]">
                Recommended Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {recommendedServices.map((service: any, i: number) => {
                const svcSlug =
                  typeof service === "string" ? service : (service?.slug ?? "");
                const name =
                  typeof service === "string"
                    ? service.replace(/-/g, " ")
                    : (service?.name ?? svcSlug);
                const subtitle =
                  typeof service !== "string" ? service?.heroSubtitle : null;

                return (
                  <div
                    key={svcSlug || i}
                    onClick={() => navigate(`/services/${svcSlug}`)}
                    className="group cursor-pointer bg-white rounded-2xl p-6 sm:p-8
                      border border-slate-100 hover:border-[#48AEDD]
                      hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                      border-l-4 border-l-[#48AEDD]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base sm:text-lg font-black text-[#134467]
                          capitalize group-hover:text-[#48AEDD] transition-colors leading-snug"
                        >
                          {name}
                        </h3>
                        {subtitle && (
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                            {subtitle}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        className="w-5 h-5 text-slate-300 group-hover:text-[#48AEDD]
                        flex-shrink-0 mt-0.5 transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════
          FEATURED LOCATIONS
      ══════════════════════ */}
      {featuredLocations.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border
                border-[#134467]/10 mb-4"
              >
                Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]">
                Popular Locations
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {featuredLocations.map((loc: any, i: number) => {
                const locSlug =
                  typeof loc === "string" ? loc : (loc?.slug ?? "");
                const name =
                  typeof loc === "string"
                    ? loc.replace(/-/g, " ")
                    : (loc?.name ?? locSlug);

                return (
                  <div
                    key={locSlug || i}
                    onClick={() => navigate(`/locations/${locSlug}`)}
                    className="group cursor-pointer bg-white border border-slate-100
                      p-4 sm:p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1
                      transition-all capitalize font-bold text-[#134467]
                      flex items-center justify-between
                      border-l-4 border-l-[#134467]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin className="w-4 h-4 text-[#48AEDD] flex-shrink-0" />
                      <span className="truncate group-hover:underline underline-offset-2">
                        {name}
                      </span>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-slate-300
                      group-hover:text-slate-500 flex-shrink-0 transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════
          FAQs
      ══════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border
                border-[#134467]/10 mb-5"
              >
                FAQs
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#134467]">
                {sector.faqHeading || "Sector FAQs"}
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
          <div className="flex items-center justify-center gap-2 mb-5">
            <Layers className="w-5 h-5 text-[#48AEDD]" />
            <span className="text-[#48AEDD] text-sm font-bold uppercase tracking-widest">
              {sector.name}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Need a courier for your sector?
          </h2>
          <p className="text-white/65 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Get an instant quote — same-day dispatch available across the UK
            mainland.
          </p>
          <button
            onClick={() => navigate("/quick-quote")}
            className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
              active:scale-95 text-white font-black uppercase tracking-wide
              px-10 sm:px-14 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
              shadow-2xl shadow-red-900/40 transition-all hover:scale-105
              w-full sm:w-auto justify-center"
          >
            Get a Quote
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
