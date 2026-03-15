import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin } from "lucide-react";
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

export default function LocationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [location, setLocation] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  /* ── FETCH ── */
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoading(true);

        // 1) Fetch location
        const res = await fetch(`${apiUrl}/api/locations/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        const locationData = json.data || json;
        setLocation(locationData);

        // 2) Fetch FAQs
        try {
          const faqRes = await fetch(`${apiUrl}/api/faqs`);
          if (faqRes.ok) {
            const allFaqs = await faqRes.json();
            // TEMP: show all published FAQs — add locationSlug filter later
            const allFaqsArray: any[] = allFaqs.data || allFaqs || [];
            setFaqs(
              locationData.faqIds?.length
                ? allFaqsArray.filter((faq: any) =>
                    locationData.faqIds.includes(faq.id),
                  )
                : [], // show no FAQs if none linked to this location
            );
          }
        } catch {
          setFaqs([]);
        }
      } catch {
        setLocation(null);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── LOADING SKELETON ── */
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
  if (!location || location.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
        <div className="text-7xl sm:text-8xl font-black text-[#48AEDD]">
          404
        </div>
        <p className="text-lg sm:text-xl text-[#134467]/60 font-medium">
          Location not found
        </p>
        <button
          onClick={() => navigate("/locations")}
          className="mt-4 flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#134467]/90 transition"
        >
          <ArrowLeft size={18} /> Back to Locations
        </button>
      </div>
    );
  }

  const heroImage =
    !imgError && location.heroImage
      ? location.heroImage
      : "/FourSix_truckimage.jpg";

  const canonicalUrl =
    location.canonicalUrl ||
    `https://couriers.foursix46.com/locations/${location.slug}`;
  const baseUrl = "https://couriers.foursix46.com";

  /* ── POSTCODE NORMALIZATION ── */
  let postcodes: string[] = [];
  if (Array.isArray(location.postcodeCoverage)) {
    postcodes = location.postcodeCoverage
      .map((p: string) => p.trim())
      .filter(Boolean);
  } else if (typeof location.postcodeCoverage === "string") {
    postcodes = location.postcodeCoverage
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  }

  const recommendedServices: any[] = location.recommendedServices || [];
  const nearbyAreas: string[] = location.nearbyAreas || [];

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white">
      {/* ── SEO ── */}
      <Helmet>
        <title>{location.seoTitle || location.name} | FourSix46®</title>
        <meta name="description" content={location.seoDescription || ""} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content={location.seoTitle || location.name}
        />
        <meta
          property="og:description"
          content={location.seoDescription || ""}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            location.ogImage || "https://couriers.foursix46.com/og-default.jpg"
          }
        />
        {location.noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* CourierService Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CourierService",
            "@id": canonicalUrl,
            name: `FourSix46® ${location.name}`,
            description: location.seoDescription,
            url: canonicalUrl,
            image: location.ogImage || heroImage,
            areaServed: {
              "@type": "Place",
              name: location.name,
              address: {
                "@type": "PostalAddress",
                addressLocality: location.name,
                addressCountry: "GB",
              },
            },
            provider: {
              "@type": "Organization",
              name: "FourSix46®",
              url: baseUrl,
            },
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://couriers.foursix46.com/#business`,
            name: "FourSix46® Couriers",
            url: "https://couriers.foursix46.com",
            telephone: "+447393363802",
            image:
              location.ogImage ||
              "https://couriers.foursix46.com/og-default.jpg",
            description: location.seoDescription || "",
            address: {
              "@type": "PostalAddress",
              addressLocality: location.name,
              addressCountry: "GB",
              addressRegion: location.country || "England",
            },
            areaServed: {
              "@type": "Place",
              name: location.name,
            },
            sameAs: [
              "https://www.instagram.com/foursix46hq/",
              "https://www.facebook.com/share/1A15gqnztd/",
              "https://www.linkedin.com/company/foursix46-couriers/",
            ],
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: "Locations",
                item: `${baseUrl}/locations`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: location.name,
                item: canonicalUrl,
              },
            ],
          })}
        </script>

        {/* FAQ Schema */}
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
          alt={location.heroTitle || location.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/60 to-[#0d2d47]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/locations")}
          className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
            text-white/90 hover:text-[#F5EB18] text-sm font-semibold
            bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full
            border border-white/20 transition-all hover:bg-white/15"
        >
          <ArrowLeft size={15} />
          <span className="hidden xs:inline">All Locations</span>
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
              Service Location
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
            {location.heroTitle || location.name}
          </h1>

          {/* Subtitle */}
          {location.heroSubtitle && (
            <p
              className={cn(
                "text-base sm:text-lg text-white/75 max-w-2xl mb-8 sm:mb-10 leading-relaxed",
                fadeUp,
              )}
            >
              {location.heroSubtitle}
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
      {location.intro && (
        <section className="max-w-3xl mx-auto py-14 sm:py-20 px-5 sm:px-6 text-center">
          <div
            dangerouslySetInnerHTML={{ __html: location.intro }}
            className="text-lg sm:text-xl text-[#134467]/75 leading-relaxed
              prose prose-lg max-w-none prose-p:text-[#134467]/75"
          />
        </section>
      )}

      {/* ══════════════════════
          CONTENT BLOCKS
      ══════════════════════ */}
      {location.contentBlocks?.length > 0 && (
        <section>
          <BlockRenderer blocks={location.contentBlocks} />
        </section>
      )}

      {/* ══════════════════════
          POSTCODE COVERAGE
      ══════════════════════ */}
      {postcodes.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
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
                Postcode Coverage
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {postcodes.map((code, i) => (
                <div
                  key={i}
                  className="group cursor-default bg-white border border-slate-100
                    hover:border-[#48AEDD] p-4 sm:p-5 rounded-2xl
                    hover:shadow-lg hover:-translate-y-1 transition-all
                    font-mono font-bold text-[#134467] text-center
                    border-l-4 border-l-[#48AEDD]"
                >
                  <span className="block text-sm sm:text-base uppercase tracking-wide">
                    {code}
                  </span>
                </div>
              ))}
            </div>

            {location.serviceRadiusMiles && (
              <p className="text-center mt-8 text-sm text-[#134467]/60 font-medium">
                Service radius: approximately {location.serviceRadiusMiles}{" "}
                miles
              </p>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════
          NEARBY AREAS
      ══════════════════════ */}
      {nearbyAreas.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border
                border-[#134467]/10 mb-4"
              >
                Nearby Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]">
                We Also Serve
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {nearbyAreas.map((area, i) => (
                <div
                  key={i}
                  className="group cursor-default bg-white border border-slate-100
                    hover:border-[#48AEDD] p-4 sm:p-5 rounded-2xl
                    hover:shadow-lg hover:-translate-y-1 transition-all
                    font-bold text-[#134467] flex items-center gap-3
                    border-l-4 border-l-[#134467]"
                >
                  <MapPin className="w-4 h-4 text-[#48AEDD] flex-shrink-0" />
                  <span className="truncate capitalize">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════
          MAP EMBED
      ══════════════════════ */}
      {location.mapEmbedUrl && (
        <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <span
                className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
                uppercase tracking-widest px-4 py-1.5 rounded-full border
                border-[#134467]/10 mb-4"
              >
                Service Area
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]">
                Coverage Map
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/50">
              <iframe
                src={location.mapEmbedUrl}
                width="100%"
                height="450"
                loading="lazy"
                title={`${location.name} courier service area`}
                className="w-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════
          RECOMMENDED SERVICES
      ══════════════════════ */}
      {recommendedServices.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-y border-slate-100">
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
                Popular Services in {location.name}
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
                    onClick={() => navigate(`/locations/${slug}/${svcSlug}`)}
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
                {location.faqHeading || `${location.name} FAQs`}
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
          FINAL CTA
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
            <MapPin className="w-5 h-5 text-[#48AEDD]" />
            <span className="text-[#48AEDD] text-sm font-bold uppercase tracking-widest">
              {location.name}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Need a courier in {location.name}?
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
