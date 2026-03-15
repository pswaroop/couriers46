import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  ChevronRight,
  Phone,
} from "lucide-react";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const apiUrl = import.meta.env.VITE_API_URL;
const BASE_URL = "https://couriers.foursix46.com";

export default function LocationServicePage() {
  const { locationSlug, serviceSlug } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchedFaqs, setFetchedFaqs] = useState<any[]>([]);

  useEffect(() => {
    if (!page) return;

    // If backend already embeds full FAQ objects (with .question), use them directly
    if (
      page.faqs?.length &&
      typeof page.faqs[0] === "object" &&
      page.faqs[0].question
    ) {
      setFetchedFaqs(page.faqs);
      return;
    }

    // Otherwise resolve from faqIds array
    if (!page.faqIds?.length) return;

    (async () => {
      try {
        const res = await fetch(`${apiUrl}/api/faqs`);
        if (!res.ok) return;
        const data = await res.json();
        const all: any[] = data.data || data;
        setFetchedFaqs(all.filter((f: any) => page.faqIds.includes(f.id)));
      } catch {
        /* silent */
      }
    })();
  }, [page]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!locationSlug || !serviceSlug) return;

    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await fetch(
          `${apiUrl}/api/location-services/${locationSlug}/${serviceSlug}`,
        );

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) throw new Error("Request failed");

        const json = await res.json();
        setPage(json.data || json);
      } catch (err) {
        console.error("Landing page error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [locationSlug, serviceSlug]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Skeleton Hero */}
          <div className="w-full h-72 bg-gradient-to-r from-[#134467]/10 via-[#48AEDD]/10 to-[#134467]/10 animate-pulse" />
          <div className="max-w-4xl w-full mx-auto px-6 space-y-4 mt-8">
            <div className="h-6 bg-slate-200 animate-pulse rounded w-2/3" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !page || page.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center gap-4 px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#E53935] uppercase tracking-widest mb-2">
              404 — Page Not Found
            </p>
            <h1 className="text-5xl font-extrabold text-[#134467] mb-3">
              Oops!
            </h1>
            <p className="text-[#134467]/60 text-lg max-w-sm mx-auto mb-8">
              This location–service page doesn't exist yet or hasn't been
              published.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate(`/locations/${locationSlug}`)}
                className="flex items-center gap-2 px-6 py-3 bg-[#134467] text-white rounded-full font-semibold hover:bg-[#0d2f4a] transition text-sm"
              >
                <ArrowLeft size={14} />
                Back to {locationSlug?.replace(/-/g, " ")}
              </button>
              <button
                onClick={() => navigate(`/services/${serviceSlug}`)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#134467] text-[#134467] rounded-full font-semibold hover:bg-[#134467]/5 transition text-sm"
              >
                View Service
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= DERIVED DATA ================= */

  const heroImage = page.heroImage || "/FourSix_truckimage.jpg";
  const canonicalUrl =
    page.canonicalUrl || `${BASE_URL}/locations/${locationSlug}/${serviceSlug}`;

  const proofPoints = page.localProofPoints || [];
  const contentBlocks = page.contentBlocks || [];
  const coverageAreas = page.coverageAreasOverride || [];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:mr-72">
      {/* ── SEO ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>{page.seoTitle || page.heroTitle}</title>
        <meta name="description" content={page.seoDescription || ""} />
        <link rel="canonical" href={canonicalUrl} />
        {page.noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* OpenGraph */}
        <meta property="og:title" content={page.seoTitle || page.heroTitle} />
        <meta property="og:description" content={page.seoDescription || ""} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        {/* ✅ FIX 2: Always render og:image with fallback */}
        <meta
          property="og:image"
          content={page.ogImage || `${BASE_URL}/og-default.jpg`}
        />

        {/* ✅ Service Schema (existing — unchanged) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": canonicalUrl,
            name: page.heroTitle,
            description: page.seoDescription,
            provider: {
              "@type": "CourierService",
              name: "FourSix46®",
              url: BASE_URL,
            },
            areaServed: {
              "@type": "Place",
              name: page.location?.name || locationSlug,
            },
          })}
        </script>

        {/* ✅ FIX 1: LocalBusiness Schema (new) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${BASE_URL}/#business`,
            name: "FourSix46® Couriers",
            url: BASE_URL,
            telephone: "+447393363802",
            image: `${BASE_URL}/og-default.jpg`,
            description: page.seoDescription || "",
            address: {
              "@type": "PostalAddress",
              addressCountry: "GB",
              addressRegion: page.location?.country || "England",
            },
            areaServed: {
              "@type": "Place",
              name: page.location?.name || locationSlug,
            },
            sameAs: [
              "https://www.instagram.com/foursix46hq/",
              "https://www.facebook.com/share/1A15gqnztd/",
              "https://www.linkedin.com/company/foursix46-couriers/",
            ],
          })}
        </script>

        {/* ✅ Breadcrumb Schema (existing — unchanged) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: BASE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Locations",
                item: `${BASE_URL}/locations`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.location?.name || locationSlug,
                item: `${BASE_URL}/locations/${locationSlug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: page.service?.name || serviceSlug,
                item: canonicalUrl,
              },
            ],
          })}
        </script>

        {/* ✅ FAQ Schema (existing — but now uses fetchedFaqs) */}
        {fetchedFaqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: fetchedFaqs.map((faq: any) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            })}
          </script>
        )}
      </Helmet>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-36 pb-28 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#134467]/80 via-black/55 to-black/70" />

        {/* Back button */}
        <button
          onClick={() => navigate(`/locations/${locationSlug}`)}
          className="absolute left-6 top-28 z-20 flex items-center gap-2 text-white/80 hover:text-[#48AEDD] transition text-sm font-medium"
        >
          <ArrowLeft size={15} />
          <span className="capitalize">
            {page.location?.name || locationSlug?.replace(/-/g, " ")}
          </span>
        </button>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Service badge */}
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#48AEDD]/20 border border-[#48AEDD]/40 text-[#48AEDD] text-xs font-bold uppercase tracking-widest">
            {page.service?.name || serviceSlug?.replace(/-/g, " ")}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
            {page.heroTitle}
          </h1>

          {page.heroSubtitle && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {page.heroSubtitle}
            </p>
          )}

          {/* Hero CTA */}
          <div className="mt-8">
            <button
              onClick={() => navigate(page.ctaPrimaryLink || "/quick-quote")}
              className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#c0392b] text-white font-bold px-8 py-4 rounded-full text-base transition shadow-lg shadow-red-800/30"
            >
              {page.ctaPrimaryText || "Get a Quote"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── BREADCRUMB ──────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 py-3">
          <ol className="flex items-center gap-1.5 text-xs text-[#134467]/50 flex-wrap">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-[#134467] transition"
            >
              Home
            </li>
            <ChevronRight size={11} />
            <li
              onClick={() => navigate("/locations")}
              className="cursor-pointer hover:text-[#134467] transition"
            >
              Locations
            </li>
            <ChevronRight size={11} />
            <li
              onClick={() => navigate(`/locations/${locationSlug}`)}
              className="cursor-pointer hover:text-[#134467] capitalize transition"
            >
              {page.location?.name || locationSlug?.replace(/-/g, " ")}
            </li>
            <ChevronRight size={11} />
            <li className="text-[#134467] font-semibold capitalize">
              {page.service?.name || serviceSlug?.replace(/-/g, " ")}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── INTRO ───────────────────────────────────────────────────────── */}
      {page.intro && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div
              dangerouslySetInnerHTML={{ __html: page.intro }}
              className="text-[#134467]/80 prose prose-lg max-w-none
                prose-headings:text-[#134467] prose-headings:font-extrabold
                prose-a:text-[#48AEDD] prose-strong:text-[#134467]"
            />
          </div>
        </section>
      )}

      {/* ── PROOF POINTS ────────────────────────────────────────────────── */}
      {proofPoints.length > 0 && (
        <section className="bg-[#134467] py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#48AEDD] mb-2">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Our Service Guarantee
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {proofPoints.map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
                >
                  <CheckCircle
                    className="text-[#48AEDD] flex-shrink-0 mt-0.5"
                    size={22}
                  />
                  <div>
                    <h3 className="font-bold text-white mb-1 text-base">
                      {p.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COVERAGE AREAS ──────────────────────────────────────────────── */}
      {coverageAreas.length > 0 && (
        <section className="py-14 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-64 flex-shrink-0">
                <span className="block text-xs font-bold uppercase tracking-widest text-[#E53935] mb-1">
                  Coverage
                </span>
                <h2 className="text-2xl font-extrabold text-[#134467]">
                  Areas We Serve
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {coverageAreas.map((area: string, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#48AEDD]/30 text-[#134467] rounded-full text-sm font-medium shadow-sm hover:border-[#48AEDD] hover:bg-[#48AEDD]/5 transition"
                  >
                    <MapPin size={12} className="text-[#E53935]" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICE DETAILS OVERRIDE ────────────────────────────────────── */}
      {page.serviceDetailsOverride && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div
              dangerouslySetInnerHTML={{ __html: page.serviceDetailsOverride }}
              className="prose prose-lg max-w-none text-[#134467]/80
                prose-headings:text-[#134467] prose-headings:font-extrabold
                prose-a:text-[#48AEDD] prose-strong:text-[#134467]
                prose-li:marker:text-[#E53935]"
            />
          </div>
        </section>
      )}

      {/* ── FLEXIBLE CONTENT BLOCKS ─────────────────────────────────────── */}
      {contentBlocks.length > 0 && (
        <section className="py-16 px-6">
          <BlockRenderer blocks={contentBlocks} />
        </section>
      )}

      {/* ── FAQs ────────────────────────────────────────────────────────── */}
      {fetchedFaqs.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-100 py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E53935] mb-2">
                Got Questions?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#134467]">
                {page.faqHeading || "Frequently Asked Questions"}
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {fetchedFaqs.map((faq: any, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white border border-slate-200 rounded-xl px-2 shadow-sm data-[state=open]:border-[#48AEDD]/40 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-[#134467] font-semibold text-left px-4 py-4 hover:no-underline hover:text-[#E53935] transition">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                      className="prose prose-sm max-w-none text-[#134467]/70
                        prose-a:text-[#48AEDD] prose-strong:text-[#134467]"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#134467] to-[#0d2f4a] py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#48AEDD] mb-3">
            Ready to Book?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Need{" "}
            <span className="text-[#48AEDD]">
              {page.service?.name || serviceSlug?.replace(/-/g, " ")}
            </span>{" "}
            in{" "}
            <span className="text-[#F5EB18]">
              {page.location?.name || locationSlug?.replace(/-/g, " ")}
            </span>
            ?
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Get a fast, no-obligation quote from FourSix46® couriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(page.ctaPrimaryLink || "/quick-quote")}
              className="inline-flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#c0392b] text-white font-bold px-10 py-4 rounded-full text-lg transition shadow-lg shadow-red-900/40"
            >
              {page.ctaPrimaryText || "Get a Free Quote"}
              <ChevronRight size={20} />
            </button>
            <a
              href="tel:+447393363802"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-bold px-10 py-4 rounded-full text-lg transition"
            >
              <Phone size={18} />
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
