// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import {
//   ArrowLeft,
//   CheckCircle,
//   MapPin,
//   ChevronRight,
//   Phone,
// } from "lucide-react";
// import Footer from "@/components/Footer";
// import BlockRenderer from "@/components/BlockRenderer";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";

// const apiUrl = import.meta.env.VITE_API_URL;
// const BASE_URL = "https://couriers.foursix46.com";

// export default function LocationServicePage() {
//   const { locationSlug, serviceSlug } = useParams();
//   const navigate = useNavigate();

//   const [page, setPage] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);
//   const [fetchedFaqs, setFetchedFaqs] = useState<any[]>([]);

//   useEffect(() => {
//     if (!page) return;

//     // If backend already embeds full FAQ objects (with .question), use them directly
//     if (
//       page.faqs?.length &&
//       typeof page.faqs[0] === "object" &&
//       page.faqs[0].question
//     ) {
//       setFetchedFaqs(page.faqs);
//       return;
//     }

//     // Otherwise resolve from faqIds array
//     if (!page.faqIds?.length) return;

//     (async () => {
//       try {
//         const res = await fetch(`${apiUrl}/api/faqs`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const all: any[] = data.data || data;
//         setFetchedFaqs(all.filter((f: any) => page.faqIds.includes(f.id)));
//       } catch {
//         /* silent */
//       }
//     })();
//   }, [page]);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (!locationSlug || !serviceSlug) return;

//     const fetchLandingPage = async () => {
//       try {
//         setLoading(true);
//         setNotFound(false);

//         const res = await fetch(
//           `${apiUrl}/api/location-services/${locationSlug}/${serviceSlug}`,
//         );

//         if (res.status === 404) {
//           setNotFound(true);
//           return;
//         }

//         if (!res.ok) throw new Error("Request failed");

//         const json = await res.json();
//         setPage(json.data || json);
//       } catch (err) {
//         console.error("Landing page error:", err);
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLandingPage();
//   }, [locationSlug, serviceSlug]);

//   /* ================= STATES ================= */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div className="flex-1 flex flex-col items-center justify-center gap-4">
//           {/* Skeleton Hero */}
//           <div className="w-full h-72 bg-gradient-to-r from-[#134467]/10 via-[#48AEDD]/10 to-[#134467]/10 animate-pulse" />
//           <div className="max-w-4xl w-full mx-auto px-6 space-y-4 mt-8">
//             <div className="h-6 bg-slate-200 animate-pulse rounded w-2/3" />
//             <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
//             <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (notFound || !page || page.status !== "published") {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div className="flex-1 flex flex-col justify-center items-center gap-4 px-6">
//           <div className="text-center">
//             <p className="text-sm font-semibold text-[#E53935] uppercase tracking-widest mb-2">
//               404 — Page Not Found
//             </p>
//             <h1 className="text-5xl font-extrabold text-[#134467] mb-3">
//               Oops!
//             </h1>
//             <p className="text-[#134467]/60 text-lg max-w-sm mx-auto mb-8">
//               This location–service page doesn't exist yet or hasn't been
//               published.
//             </p>
//             <div className="flex flex-wrap gap-3 justify-center">
//               <button
//                 onClick={() => navigate(`/locations/${locationSlug}`)}
//                 className="flex items-center gap-2 px-6 py-3 bg-[#134467] text-white rounded-full font-semibold hover:bg-[#0d2f4a] transition text-sm"
//               >
//                 <ArrowLeft size={14} />
//                 Back to {locationSlug?.replace(/-/g, " ")}
//               </button>
//               <button
//                 onClick={() => navigate(`/services/${serviceSlug}`)}
//                 className="flex items-center gap-2 px-6 py-3 border-2 border-[#134467] text-[#134467] rounded-full font-semibold hover:bg-[#134467]/5 transition text-sm"
//               >
//                 View Service
//                 <ChevronRight size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   /* ================= DERIVED DATA ================= */

//   const heroImage = page.heroImage || "/FourSix_truckimage.jpg";
//   const canonicalUrl =
//     page.canonicalUrl || `${BASE_URL}/locations/${locationSlug}/${serviceSlug}`;

//   const proofPoints = page.localProofPoints || [];
//   const contentBlocks = page.contentBlocks || [];
//   const coverageAreas = page.coverageAreasOverride || [];

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:mr-72">
//       {/* ── SEO ─────────────────────────────────────────────────────────── */}
//       <Helmet>
//         <title>{page.seoTitle || page.heroTitle}</title>
//         <meta name="description" content={page.seoDescription || ""} />
//         <link rel="canonical" href={canonicalUrl} />
//         {page.noindex && <meta name="robots" content="noindex,nofollow" />}

//         {/* OpenGraph */}
//         <meta property="og:title" content={page.seoTitle || page.heroTitle} />
//         <meta property="og:description" content={page.seoDescription || ""} />
//         <meta property="og:url" content={canonicalUrl} />
//         <meta property="og:type" content="website" />
//         {/* ✅ FIX 2: Always render og:image with fallback */}
//         <meta
//           property="og:image"
//           content={page.ogImage || `${BASE_URL}/og-default.jpg`}
//         />

//         {/* ✅ Service Schema (existing — unchanged) */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Service",
//             "@id": canonicalUrl,
//             name: page.heroTitle,
//             description: page.seoDescription,
//             provider: {
//               "@type": "CourierService",
//               name: "FourSix46®",
//               url: BASE_URL,
//             },
//             areaServed: {
//               "@type": "Place",
//               name: page.location?.name || locationSlug,
//             },
//           })}
//         </script>

//         {/* ✅ FIX 1: LocalBusiness Schema (new) */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "LocalBusiness",
//             "@id": `${BASE_URL}/#business`,
//             name: "FourSix46® Couriers",
//             url: BASE_URL,
//             telephone: "+447393363802",
//             image: `${BASE_URL}/og-default.jpg`,
//             description: page.seoDescription || "",
//             address: {
//               "@type": "PostalAddress",
//               addressCountry: "GB",
//               addressRegion: page.location?.country || "England",
//             },
//             areaServed: {
//               "@type": "Place",
//               name: page.location?.name || locationSlug,
//             },
//             sameAs: [
//               "https://www.instagram.com/foursix46hq/",
//               "https://www.facebook.com/share/1A15gqnztd/",
//               "https://www.linkedin.com/company/foursix46-couriers/",
//             ],
//           })}
//         </script>

//         {/* ✅ Breadcrumb Schema (existing — unchanged) */}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               {
//                 "@type": "ListItem",
//                 position: 1,
//                 name: "Home",
//                 item: BASE_URL,
//               },
//               {
//                 "@type": "ListItem",
//                 position: 2,
//                 name: "Locations",
//                 item: `${BASE_URL}/locations`,
//               },
//               {
//                 "@type": "ListItem",
//                 position: 3,
//                 name: page.location?.name || locationSlug,
//                 item: `${BASE_URL}/locations/${locationSlug}`,
//               },
//               {
//                 "@type": "ListItem",
//                 position: 4,
//                 name: page.service?.name || serviceSlug,
//                 item: canonicalUrl,
//               },
//             ],
//           })}
//         </script>

//         {/* ✅ FAQ Schema (existing — but now uses fetchedFaqs) */}
//         {fetchedFaqs.length > 0 && (
//           <script type="application/ld+json">
//             {JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: fetchedFaqs.map((faq: any) => ({
//                 "@type": "Question",
//                 name: faq.question,
//                 acceptedAnswer: { "@type": "Answer", text: faq.answer },
//               })),
//             })}
//           </script>
//         )}
//       </Helmet>

//       {/* ── NAVBAR ──────────────────────────────────────────────────────── */}

//       {/* ── HERO ────────────────────────────────────────────────────────── */}
//       <section
//         className="relative pt-36 pb-28 text-white text-center bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImage})` }}
//       >
//         {/* Gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-[#134467]/80 via-black/55 to-black/70" />

//         {/* Back button */}
//         <button
//           onClick={() => navigate(`/locations/${locationSlug}`)}
//           className="absolute left-6 top-28 z-20 flex items-center gap-2 text-white/80 hover:text-[#48AEDD] transition text-sm font-medium"
//         >
//           <ArrowLeft size={15} />
//           <span className="capitalize">
//             {page.location?.name || locationSlug?.replace(/-/g, " ")}
//           </span>
//         </button>

//         <div className="relative z-10 max-w-4xl mx-auto px-6">
//           {/* Service badge */}
//           <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#48AEDD]/20 border border-[#48AEDD]/40 text-[#48AEDD] text-xs font-bold uppercase tracking-widest">
//             {page.service?.name || serviceSlug?.replace(/-/g, " ")}
//           </span>

//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
//             {page.heroTitle}
//           </h1>

//           {page.heroSubtitle && (
//             <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
//               {page.heroSubtitle}
//             </p>
//           )}

//           {/* Hero CTA */}
//           <div className="mt-8">
//             <button
//               onClick={() => navigate(page.ctaPrimaryLink || "/quick-quote")}
//               className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#c0392b] text-white font-bold px-8 py-4 rounded-full text-base transition shadow-lg shadow-red-800/30"
//             >
//               {page.ctaPrimaryText || "Get a Quote"}
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ── BREADCRUMB ──────────────────────────────────────────────────── */}
//       <nav className="border-b border-slate-100 bg-slate-50">
//         <div className="container mx-auto px-6 py-3">
//           <ol className="flex items-center gap-1.5 text-xs text-[#134467]/50 flex-wrap">
//             <li
//               onClick={() => navigate("/")}
//               className="cursor-pointer hover:text-[#134467] transition"
//             >
//               Home
//             </li>
//             <ChevronRight size={11} />
//             <li
//               onClick={() => navigate("/locations")}
//               className="cursor-pointer hover:text-[#134467] transition"
//             >
//               Locations
//             </li>
//             <ChevronRight size={11} />
//             <li
//               onClick={() => navigate(`/locations/${locationSlug}`)}
//               className="cursor-pointer hover:text-[#134467] capitalize transition"
//             >
//               {page.location?.name || locationSlug?.replace(/-/g, " ")}
//             </li>
//             <ChevronRight size={11} />
//             <li className="text-[#134467] font-semibold capitalize">
//               {page.service?.name || serviceSlug?.replace(/-/g, " ")}
//             </li>
//           </ol>
//         </div>
//       </nav>

//       {/* ── INTRO ───────────────────────────────────────────────────────── */}
//       {page.intro && (
//         <section className="py-16 md:py-20">
//           <div className="container mx-auto px-6 max-w-4xl">
//             <div
//               dangerouslySetInnerHTML={{ __html: page.intro }}
//               className="text-[#134467]/80 prose prose-lg max-w-none
//                 prose-headings:text-[#134467] prose-headings:font-extrabold
//                 prose-a:text-[#48AEDD] prose-strong:text-[#134467]"
//             />
//           </div>
//         </section>
//       )}

//       {/* ── PROOF POINTS ────────────────────────────────────────────────── */}
//       {proofPoints.length > 0 && (
//         <section className="bg-[#134467] py-16 md:py-20">
//           <div className="container mx-auto px-6 max-w-5xl">
//             <div className="text-center mb-12">
//               <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#48AEDD] mb-2">
//                 Why Choose Us
//               </span>
//               <h2 className="text-3xl md:text-4xl font-extrabold text-white">
//                 Our Service Guarantee
//               </h2>
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
//               {proofPoints.map((p: any, i: number) => (
//                 <div
//                   key={i}
//                   className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
//                 >
//                   <CheckCircle
//                     className="text-[#48AEDD] flex-shrink-0 mt-0.5"
//                     size={22}
//                   />
//                   <div>
//                     <h3 className="font-bold text-white mb-1 text-base">
//                       {p.title}
//                     </h3>
//                     <p className="text-white/60 text-sm leading-relaxed">
//                       {p.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── COVERAGE AREAS ──────────────────────────────────────────────── */}
//       {coverageAreas.length > 0 && (
//         <section className="py-14 bg-slate-50 border-y border-slate-100">
//           <div className="container mx-auto px-6 max-w-5xl">
//             <div className="flex flex-col md:flex-row md:items-center gap-6">
//               <div className="md:w-64 flex-shrink-0">
//                 <span className="block text-xs font-bold uppercase tracking-widest text-[#E53935] mb-1">
//                   Coverage
//                 </span>
//                 <h2 className="text-2xl font-extrabold text-[#134467]">
//                   Areas We Serve
//                 </h2>
//               </div>
//               <div className="flex flex-wrap gap-2.5">
//                 {coverageAreas.map((area: string, i: number) => (
//                   <span
//                     key={i}
//                     className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#48AEDD]/30 text-[#134467] rounded-full text-sm font-medium shadow-sm hover:border-[#48AEDD] hover:bg-[#48AEDD]/5 transition"
//                   >
//                     <MapPin size={12} className="text-[#E53935]" />
//                     {area}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── SERVICE DETAILS OVERRIDE ────────────────────────────────────── */}
//       {page.serviceDetailsOverride && (
//         <section className="py-16 md:py-20">
//           <div className="container mx-auto px-6 max-w-4xl">
//             <div
//               dangerouslySetInnerHTML={{ __html: page.serviceDetailsOverride }}
//               className="prose prose-lg max-w-none text-[#134467]/80
//                 prose-headings:text-[#134467] prose-headings:font-extrabold
//                 prose-a:text-[#48AEDD] prose-strong:text-[#134467]
//                 prose-li:marker:text-[#E53935]"
//             />
//           </div>
//         </section>
//       )}

//       {/* ── FLEXIBLE CONTENT BLOCKS ─────────────────────────────────────── */}
//       {contentBlocks.length > 0 && (
//         <section className="py-16 px-6">
//           <BlockRenderer blocks={contentBlocks} />
//         </section>
//       )}

//       {/* ── FAQs ────────────────────────────────────────────────────────── */}
//       {fetchedFaqs.length > 0 && (
//         <section className="bg-slate-50 border-t border-slate-100 py-20">
//           <div className="container mx-auto px-6 max-w-4xl">
//             <div className="text-center mb-12">
//               <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E53935] mb-2">
//                 Got Questions?
//               </span>
//               <h2 className="text-3xl md:text-4xl font-extrabold text-[#134467]">
//                 {page.faqHeading || "Frequently Asked Questions"}
//               </h2>
//             </div>

//             <Accordion type="single" collapsible className="space-y-3">
//               {fetchedFaqs.map((faq: any, i: number) => (
//                 <AccordionItem
//                   key={i}
//                   value={`faq-${i}`}
//                   className="bg-white border border-slate-200 rounded-xl px-2 shadow-sm data-[state=open]:border-[#48AEDD]/40 data-[state=open]:shadow-md transition-all"
//                 >
//                   <AccordionTrigger className="text-[#134467] font-semibold text-left px-4 py-4 hover:no-underline hover:text-[#E53935] transition">
//                     {faq.question}
//                   </AccordionTrigger>
//                   <AccordionContent className="px-4 pb-4">
//                     <div
//                       dangerouslySetInnerHTML={{ __html: faq.answer }}
//                       className="prose prose-sm max-w-none text-[#134467]/70
//                         prose-a:text-[#48AEDD] prose-strong:text-[#134467]"
//                     />
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </section>
//       )}

//       {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
//       <section className="bg-gradient-to-br from-[#134467] to-[#0d2f4a] py-20">
//         <div className="container mx-auto px-6 max-w-3xl text-center">
//           <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#48AEDD] mb-3">
//             Ready to Book?
//           </span>
//           <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
//             Need{" "}
//             <span className="text-[#48AEDD]">
//               {page.service?.name || serviceSlug?.replace(/-/g, " ")}
//             </span>{" "}
//             in{" "}
//             <span className="text-[#F5EB18]">
//               {page.location?.name || locationSlug?.replace(/-/g, " ")}
//             </span>
//             ?
//           </h2>
//           <p className="text-white/60 mb-8 text-lg">
//             Get a fast, no-obligation quote from FourSix46® couriers.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate(page.ctaPrimaryLink || "/quick-quote")}
//               className="inline-flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#c0392b] text-white font-bold px-10 py-4 rounded-full text-lg transition shadow-lg shadow-red-900/40"
//             >
//               {page.ctaPrimaryText || "Get a Free Quote"}
//               <ChevronRight size={20} />
//             </button>
//             <a
//               href="tel:+447393363802"
//               className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-bold px-10 py-4 rounded-full text-lg transition"
//             >
//               <Phone size={18} />
//               Call Us Now
//             </a>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  ChevronRight,
  Phone,
  Clock,
  Zap,
  Globe,
  Timer,
  Navigation,
  Network,
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANT SECTIONS — identical across Services / Sectors / Locations / Landing
// TODO: move to @/components/shared/CmsConstantSections.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── ① Stats Trust Bar ────────────────────────────────────────────
const StatsTrustBar = () => (
  <div className="bg-[#0e3352] border-b border-[#48AEDD]/20">
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-12">
        {[
          {
            icon: <Timer className="w-4 h-4" />,
            text: "Collection Within 60 Mins",
          },
          { icon: <Globe className="w-4 h-4" />, text: "UK Mainland Coverage" },
          { icon: <Zap className="w-4 h-4" />, text: "Same Day Delivery" },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-white/90 text-sm font-bold"
          >
            <span className="text-[#F5EB18]">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── ② How Our Courier Network Works ──────────────────────────────
const HOW_IT_WORKS_STEPS = [
  {
    n: 1,
    title: "Request a Quote",
    desc: "Submit pickup and delivery details online.",
  },
  {
    n: 2,
    title: "Courier Assigned",
    desc: "A professional driver is dispatched quickly.",
  },
  {
    n: 3,
    title: "Collection",
    desc: "Goods or documents are collected securely.",
  },
  {
    n: 4,
    title: "Direct Delivery",
    desc: "Items are transported directly to the destination.",
  },
  {
    n: 5,
    title: "Confirmation",
    desc: "Delivery confirmation and proof of delivery provided.",
  },
];

const HowOurNetworkWorks = () => (
  <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
    <div className="max-w-5xl mx-auto px-5 sm:px-6">
      <div className="text-center mb-12">
        <span
          className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
          uppercase tracking-widest px-4 py-1.5 rounded-full border
          border-[#134467]/10 mb-4"
        >
          Our Process
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]">
          How Our Courier Network Works
        </h2>
      </div>

      <div className="relative">
        {/* Connecting line — desktop only */}
        <div
          className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5
          bg-gradient-to-r from-[#48AEDD]/20 via-[#48AEDD]/60 to-[#48AEDD]/20"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {HOW_IT_WORKS_STEPS.map(({ n, title, desc }) => (
            <div
              key={n}
              className="flex flex-col items-center text-center relative"
            >
              <div
                className="w-16 h-16 rounded-full bg-[#134467] text-white font-black
                text-xl flex items-center justify-center mb-4 shadow-lg
                ring-4 ring-white relative z-10 flex-shrink-0"
              >
                {n}
              </div>
              <h3 className="font-black text-[#134467] text-sm sm:text-base mb-2">
                {title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── ③ Why Choose Route46 Couriers — constant 6-card set ──────────
const WHY_CHOOSE_CARDS = [
  {
    Icon: Clock,
    label: "Available 24/7",
    title: "24/7 Courier Support",
    desc: "Our courier operations run 24 hours a day, 7 days a week to handle urgent deliveries whenever they arise. Whether you need late-night document transport or early morning collections, our dedicated courier network is always ready to respond.",
  },
  {
    Icon: Zap,
    label: "Same Day Transport",
    title: "Same Day Courier Delivery",
    desc: "Route46 Couriers provides reliable same day courier services across the UK. Our dedicated drivers collect your shipment and transport it directly to the destination without unnecessary stops or hub delays.",
  },
  {
    Icon: Globe,
    label: "Nationwide Coverage",
    title: "Across the UK Mainland",
    desc: "Our courier network covers cities, towns, and business districts across the UK mainland. From London and Birmingham to Cardiff, Manchester, and beyond, we ensure dependable transport wherever your delivery needs to go.",
  },
  {
    Icon: Timer,
    label: "Rapid Dispatch",
    title: "Collection Within 60 Minutes",
    desc: "For urgent deliveries, our courier drivers can often collect shipments within 60 minutes depending on location and availability. This rapid response ensures time-sensitive documents, parcels, or goods move immediately.",
  },
  {
    Icon: Navigation,
    label: "Real-Time Visibility",
    title: "Live GPS Delivery Tracking",
    desc: "Every delivery is supported by real-time tracking and delivery confirmation. Our system provides visibility from collection to delivery, ensuring transparency and confidence for both businesses and individual customers.",
  },
  {
    Icon: Network,
    label: "Specialist Deliveries",
    title: "Industries & Courier Services",
    desc: "Route46 Couriers supports a wide range of industries including legal, medical, corporate, aviation, and e-commerce. From passport deliveries and legal documents to urgent parcels and specialist freight, our services are designed to meet diverse business needs.",
  },
];

const WhyChooseSection = () => (
  <section className="py-16 sm:py-20 bg-white">
    <div className="max-w-6xl mx-auto px-5 sm:px-6">
      <div className="text-center mb-10 sm:mb-14">
        <span
          className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black
          uppercase tracking-widest px-4 py-1.5 rounded-full border
          border-[#134467]/10 mb-4"
        >
          Why Route46
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467] mb-3">
          Why Choose Route46 Couriers
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Fast, secure and professional courier solutions across the UK mainland
          for urgent documents, parcels, pallets and specialist deliveries.
        </p>
      </div>

      {/* Row 1 — 3 cards · Row 2 — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {WHY_CHOOSE_CARDS.map(({ Icon, label, title, desc }) => (
          <div
            key={title}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-6
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl bg-[#134467] flex items-center
                justify-center flex-shrink-0"
              >
                <Icon className="w-5 h-5 text-[#F5EB18]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#48AEDD]">
                {label}
              </span>
            </div>
            <h3 className="font-black text-[#134467] text-base mb-2">
              {title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── ④ Dedicated Courier Network — constant message ────────────────
const DedicatedCourierNetwork = () => (
  <div className="bg-[#134467]/5 border-y border-[#134467]/10 py-8 sm:py-10">
    <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
      <p className="text-[#134467] font-semibold text-base sm:text-lg leading-relaxed">
        Route46 Couriers provides reliable same-day transport across the UK with
        professional drivers, secure handling, and real-time delivery updates.
      </p>
    </div>
  </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function LocationServicePage() {
  const { locationSlug, serviceSlug } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchedFaqs, setFetchedFaqs] = useState<any[]>([]);

  /* ── Resolve FAQs ── */
  useEffect(() => {
    if (!page) return;

    if (
      page.faqs?.length &&
      typeof page.faqs[0] === "object" &&
      page.faqs[0].question
    ) {
      setFetchedFaqs(page.faqs);
      return;
    }

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

  /* ── Fetch page ── */
  useEffect(() => {
    if (!locationSlug || !serviceSlug) return;

    (async () => {
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
    })();
  }, [locationSlug, serviceSlug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
          </div>
          <p className="text-[#134467]/50 text-sm font-semibold tracking-widest uppercase">
            Loading location services details...
          </p>
        </div>
      </div>
    );
  }

  /* ── 404 ── */
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

  /* ── Derived data ── */
  const heroImage = page.heroImage || "/route462.jpeg";
  const canonicalUrl =
    page.canonicalUrl || `${BASE_URL}/locations/${locationSlug}/${serviceSlug}`;
  const proofPoints = page.localProofPoints || [];
  const contentBlocks = page.contentBlocks || [];
  const coverageAreas = page.coverageAreasOverride || [];

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:mr-72">
      {/* ── SEO ── */}
      <Helmet>
        <title>{page.seoTitle || page.heroTitle}</title>
        <meta name="description" content={page.seoDescription || ""} />
        <link rel="canonical" href={canonicalUrl} />
        {page.noindex && <meta name="robots" content="noindex,nofollow" />}

        <meta property="og:title" content={page.seoTitle || page.heroTitle} />
        <meta property="og:description" content={page.seoDescription || ""} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={page.ogImage || `${BASE_URL}/og-default.jpg`}
        />

        {/* Service Schema */}
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

        {/* LocalBusiness Schema */}
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
              "https://www.instagram.com/route46couriers/",
              "https://www.facebook.com/route46couriers/",
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

        {/* FAQ Schema */}
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

      {/* ══════════════════════════════════════════════
          ① HERO
      ══════════════════════════════════════════════ */}
      <section
        className="relative pt-36 pb-28 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#134467]/80 via-black/55 to-black/70" />

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
          {/* ✅ Badge — "TRUSTED UK COURIER NETWORK" constant for all 4 CMS pages */}
          <span
            className="inline-block mb-4 px-4 py-1.5 rounded-full
            bg-[#F5EB18] text-[#134467] text-xs font-black uppercase tracking-widest"
          >
            Trusted UK Courier Network
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
            {page.heroTitle}
          </h1>

          {page.heroSubtitle && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {page.heroSubtitle}
            </p>
          )}

          <div className="mt-8">
            <button
              onClick={() => navigate(page.ctaPrimaryLink || "/quick-quote")}
              className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#c0392b]
                text-white font-bold px-8 py-4 rounded-full text-base transition
                shadow-lg shadow-red-800/30"
            >
              {page.ctaPrimaryText || "Get a Quote"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ② STATS TRUST BAR
          Collection within 60 mins / UK Mainland / Same Day
      ══════════════════════════════════════════════ */}
      <StatsTrustBar />

      {/* ══════════════════════════════════════════════
          ③ BREADCRUMB
      ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
          ④ INTRO
      ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
          ⑤ FLEXIBLE CONTENT BLOCKS
      ══════════════════════════════════════════════ */}
      {contentBlocks.length > 0 && (
        <section className="py-16 px-6">
          <BlockRenderer blocks={contentBlocks} />
        </section>
      )}

      {/* ══════════════════════════════════════════════
          ⑥ HOW OUR COURIER NETWORK WORKS
          After rich text — constant on all 4 CMS pages
      ══════════════════════════════════════════════ */}
      <HowOurNetworkWorks />

      {/* ══════════════════════════════════════════════
          ⑦ WHY CHOOSE ROUTE46 COURIERS — 6-card set
          Constant across all 4 CMS pages
      ══════════════════════════════════════════════ */}
      <WhyChooseSection />

      {/* ══════════════════════════════════════════════
          ⑧ LOCAL PROOF POINTS — page-specific
      ══════════════════════════════════════════════ */}
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

            <div className="grid sm:grid-cols-2 gap-6">
              {proofPoints.map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-white/5 border border-white/10
                    rounded-2xl p-6 hover:bg-white/10 transition"
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

      {/* ══════════════════════════════════════════════
          ⑨ COVERAGE AREAS — page-specific
      ══════════════════════════════════════════════ */}
      {coverageAreas.length > 0 && (
        <section className="py-14 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-64 flex-shrink-0">
                {/* ✅ Location Links Hub eyebrow spec */}
                <span className="block text-xs font-bold uppercase tracking-widest text-[#E53935] mb-1">
                  Nationwide Courier Coverage
                </span>
                <h2 className="text-2xl font-extrabold text-[#134467]">
                  Popular UK Courier Locations
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {coverageAreas.map((area: string, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border
                      border-[#48AEDD]/30 text-[#134467] rounded-full text-sm font-medium
                      shadow-sm hover:border-[#48AEDD] hover:bg-[#48AEDD]/5 transition"
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

      {/* ══════════════════════════════════════════════
          ⑩ SERVICE DETAILS OVERRIDE — page-specific
      ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
          ⑪ FAQs
      ══════════════════════════════════════════════ */}
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
                  className="bg-white border border-slate-200 rounded-xl px-2 shadow-sm
                    data-[state=open]:border-[#48AEDD]/40 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger
                    className="text-[#134467] font-semibold text-left px-4 py-4
                    hover:no-underline hover:text-[#E53935] transition"
                  >
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

      {/* ══════════════════════════════════════════════
          ⑫ DEDICATED COURIER NETWORK — constant message
          Shown before final CTA on all 4 CMS pages
      ══════════════════════════════════════════════ */}
      <DedicatedCourierNetwork />

      {/* ══════════════════════════════════════════════
          ⑬ FINAL CTA BANNER
      ══════════════════════════════════════════════ */}
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
              className="inline-flex items-center justify-center gap-2 bg-[#E53935]
                hover:bg-[#c0392b] text-white font-bold px-10 py-4 rounded-full
                text-lg transition shadow-lg shadow-red-900/40"
            >
              {page.ctaPrimaryText || "Get a Free Quote"}
              <ChevronRight size={20} />
            </button>
            <a
              href="tel:+447393363802"
              className="inline-flex items-center justify-center gap-2 border-2
                border-white/30 hover:border-white text-white font-bold px-10 py-4
                rounded-full text-lg transition"
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
