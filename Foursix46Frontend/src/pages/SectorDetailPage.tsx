// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   ArrowRight,
//   MapPin,
//   Layers,
//   Clock,
//   Zap,
//   Globe,
//   Timer,
//   Navigation,
//   Network,
//   CheckCircle2,
//   Truck,
//   ChevronRight,
// } from "lucide-react";
// import { Helmet } from "react-helmet-async";
// import { cn } from "@/lib/utils";
// import Footer from "@/components/Footer";
// import BlockRenderer from "@/components/BlockRenderer";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";

// const apiUrl = import.meta.env.VITE_API_URL;
// const fadeUp =
//   "animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out";

// /* ─────────────────────────────────────────────────────────────────────────────
//    CONSTANT SECTIONS
// ───────────────────────────────────────────────────────────────────────────── */

// // const StatsTrustBar = () => (
// //   <div className="bg-[#0e3352] border-b border-[#48AEDD]/20">
// //     <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4">
// //       <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-12">
// //         {[
// //           {
// //             icon: <Timer className="w-4 h-4" />,
// //             text: "Collection Within 60 Mins",
// //           },
// //           { icon: <Globe className="w-4 h-4" />, text: "UK Mainland Coverage" },
// //           { icon: <Zap className="w-4 h-4" />, text: "Same Day Delivery" },
// //         ].map(({ icon, text }) => (
// //           <div
// //             key={text}
// //             className="flex items-center gap-2 text-white/90 text-sm font-bold tracking-wide"
// //           >
// //             <span className="text-[#F5EB18]">{icon}</span>
// //             {text}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   </div>
// // );

// const HOW_IT_WORKS_STEPS = [
//   {
//     n: 1,
//     title: "Request a Quote",
//     desc: "Submit pickup and delivery details online.",
//   },
//   {
//     n: 2,
//     title: "Courier Assigned",
//     desc: "A professional driver is dispatched quickly.",
//   },
//   {
//     n: 3,
//     title: "Collection",
//     desc: "Goods or documents are collected securely.",
//   },
//   {
//     n: 4,
//     title: "Direct Delivery",
//     desc: "Items are transported directly to the destination.",
//   },
//   {
//     n: 5,
//     title: "Confirmation",
//     desc: "Delivery confirmation and proof of delivery provided.",
//   },
// ];

// const HowOurNetworkWorks = () => (
//   <section className="py-20 sm:py-24 bg-[#134467] relative overflow-hidden">
//     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
//     <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
//     <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
//       <div className="text-center mb-14">
//         <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-4 shadow-sm">
//           Our Process
//         </span>
//         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
//           How Our Courier Network Works
//         </h2>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4">
//         {HOW_IT_WORKS_STEPS.map(({ n, title, desc }, i) => (
//           <div key={n} className="relative group">
//             {i < HOW_IT_WORKS_STEPS.length - 1 && (
//               <div className="hidden lg:block absolute top-7 left-[65%] w-full h-px bg-gradient-to-r from-white/25 to-transparent z-0" />
//             )}
//             <div className="relative z-10 flex flex-col items-center text-center gap-3">
//               <div className="w-14 h-14 rounded-full bg-[#E53935] flex items-center justify-center shadow-xl shadow-red-900/40 group-hover:scale-110 group-hover:bg-[#c0392b] transition-all duration-300">
//                 <span className="text-white font-black text-sm tracking-wide">
//                   0{n}
//                 </span>
//               </div>
//               <h3 className="text-white font-black text-sm leading-snug tracking-wide">
//                 {title}
//               </h3>
//               <p className="text-white/50 text-xs leading-relaxed font-medium">
//                 {desc}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// const WHY_CHOOSE_CARDS = [
//   {
//     Icon: Clock,
//     label: "Available 24/7",
//     title: "24/7 Courier Support",
//     desc: "Our courier operations run 24 hours a day, 7 days a week to handle urgent deliveries whenever they arise. Whether you need late-night document transport or early morning collections, our dedicated courier network is always ready to respond.",
//   },
//   {
//     Icon: Zap,
//     label: "Same Day Transport",
//     title: "Same Day Courier Delivery",
//     desc: "Route46 Couriers provides reliable same day courier services across the UK. Our dedicated drivers collect your shipment and transport it directly to the destination without unnecessary stops or hub delays.",
//   },
//   {
//     Icon: Globe,
//     label: "Nationwide Coverage",
//     title: "Across the UK Mainland",
//     desc: "Our courier network covers cities, towns, and business districts across the UK mainland. From London and Birmingham to Cardiff, Manchester, and beyond, we ensure dependable transport wherever your delivery needs to go.",
//   },
//   {
//     Icon: Timer,
//     label: "Rapid Dispatch",
//     title: "Collection Within 60 Minutes",
//     desc: "For urgent deliveries, our courier drivers can often collect shipments within 60 minutes depending on location and availability. This rapid response ensures time-sensitive documents, parcels, or goods move immediately.",
//   },
//   {
//     Icon: Navigation,
//     label: "Real-Time Visibility",
//     title: "Live GPS Delivery Tracking",
//     desc: "Every delivery is supported by real-time tracking and delivery confirmation. Our system provides visibility from collection to delivery, ensuring transparency and confidence for both businesses and individual customers.",
//   },
//   {
//     Icon: Network,
//     label: "Specialist Deliveries",
//     title: "Industries & Courier Services",
//     desc: "Route46 Couriers supports a wide range of industries including legal, medical, corporate, aviation, and e-commerce. From passport deliveries and legal documents to urgent parcels and specialist freight, our services are designed to meet diverse business needs.",
//   },
// ];

// const WhyChooseSection = () => (
//   <section className="bg-slate-50/80 py-20 sm:py-24 border-t border-slate-100">
//     <div className="max-w-6xl mx-auto px-5 sm:px-6">
//       <div className="text-center mb-14">
//         <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-5 shadow-sm">
//           Why Route46
//         </span>
//         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#134467] tracking-tight leading-tight mb-4">
//           Why Choose Route46 Couriers
//         </h2>
//         <p className="text-[#134467]/55 text-base font-medium max-w-2xl mx-auto leading-[1.85]">
//           Fast, secure and professional courier solutions across the UK mainland
//           for urgent documents, parcels, pallets and specialist deliveries.
//         </p>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {WHY_CHOOSE_CARDS.map(({ Icon, label, title, desc }, i) => (
//           <div
//             key={title}
//             className={cn(
//               "bg-white p-8 rounded-3xl border border-slate-100",
//               "hover:shadow-2xl hover:-translate-y-2 hover:border-[#48AEDD]/25 transition-all duration-300 group",
//               fadeUp,
//             )}
//             style={{ animationDelay: `${i * 80}ms` }}
//           >
//             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#134467]/5 to-[#48AEDD]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
//               <Icon className="w-6 h-6 text-[#48AEDD]" />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E53935] mb-2.5 block">
//               {label}
//             </span>
//             <h3 className="font-black text-[17px] text-[#134467] mb-3 leading-snug tracking-tight group-hover:text-[#E53935] transition-colors duration-200">
//               {title}
//             </h3>
//             <p className="text-[#134467]/58 text-[13.5px] leading-[1.85] font-medium">
//               {desc}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// const DedicatedCourierNetwork = () => (
//   <div className="bg-[#134467]/5 border-y border-[#134467]/10 py-8 sm:py-10">
//     <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
//       <p className="text-[#134467] font-semibold text-base sm:text-lg leading-[1.85]">
//         Route46 Couriers provides reliable same-day transport across the UK with
//         access to thousands of verified drivers and vehicles through our
//         extended courier network, ensuring fast collection, secure handling, and
//         true nationwide delivery coverage.
//       </p>
//     </div>
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────────────────────
//    MAIN PAGE
// ───────────────────────────────────────────────────────────────────────────── */
// export default function SectorDetailPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [sector, setSector] = useState<any>(null);
//   const [faqs, setFaqs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [imgError, setImgError] = useState(false);

//   useEffect(() => {
//     if (!slug) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${apiUrl}/api/sectors/${slug}`);
//         if (!res.ok) throw new Error("Not found");
//         const json = await res.json();
//         const data = json.data || json;
//         setSector(data);
//         try {
//           const faqRes = await fetch(`${apiUrl}/api/faqs`);
//           if (faqRes.ok) {
//             const all: any[] =
//               (await faqRes.json()).data || (await faqRes.json()) || [];
//             setFaqs(
//               data.faqIds?.length
//                 ? all.filter((f: any) => data.faqIds.includes(f.id))
//                 : [],
//             );
//           }
//         } catch {
//           setFaqs([]);
//         }
//       } catch {
//         setSector(null);
//         setFaqs([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [slug]);

//   /* ── Loading skeleton ── */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
//             <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
//           </div>
//           <p className="text-[#134467]/50 text-sm font-semibold tracking-widest uppercase">
//             Loading sector details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ── 404 ── */
//   if (!sector || sector.status !== "published") {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-5 text-center antialiased">
//         <div className="w-24 h-24 rounded-full bg-[#48AEDD]/10 flex items-center justify-center">
//           <span className="text-4xl font-black text-[#48AEDD] tracking-tight">
//             404
//           </span>
//         </div>
//         <div>
//           <h1 className="text-2xl font-black text-[#134467] tracking-tight">
//             Sector Not Found
//           </h1>
//           <p className="text-[#134467]/50 mt-2 font-medium text-sm">
//             This sector doesn't exist or may have been removed.
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/sectors")}
//           className="flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-black text-sm tracking-wide hover:bg-[#134467]/90 transition"
//         >
//           <ArrowLeft size={16} /> Back to Sectors
//         </button>
//       </div>
//     );
//   }

//   const heroImage =
//     !imgError && sector.heroImage ? sector.heroImage : "/route462.jpeg";
//   const canonicalUrl =
//     sector.canonicalUrl ||
//     `https://couriers.foursix46.com/sectors/${sector.slug}`;
//   const recommendedServices: any[] = sector.recommendedServices || [];
//   const featuredLocations: any[] = sector.featuredLocations || [];

//   return (
//     <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white antialiased">
//       {/* ══════════════════════════════════════════════════
//           SEO
//       ══════════════════════════════════════════════════ */}
//       <Helmet>
//         <title>{sector.seoTitle || sector.name} | FourSix46®</title>
//         <meta name="description" content={sector.seoDescription || ""} />
//         <link rel="canonical" href={canonicalUrl} />
//         <meta property="og:title" content={sector.seoTitle || sector.name} />
//         <meta property="og:description" content={sector.seoDescription || ""} />
//         <meta property="og:url" content={canonicalUrl} />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:image"
//           content={
//             sector.ogImage || "https://couriers.foursix46.com/og-default.jpg"
//           }
//         />
//         {sector.noindex && <meta name="robots" content="noindex,nofollow" />}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Service",
//             name: sector.name,
//             description: sector.seoDescription,
//             provider: {
//               "@type": "Organization",
//               name: "FourSix46®",
//               url: "https://couriers.foursix46.com",
//             },
//             areaServed: "United Kingdom",
//           })}
//         </script>
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "BreadcrumbList",
//             itemListElement: [
//               {
//                 "@type": "ListItem",
//                 position: 1,
//                 name: "Home",
//                 item: "https://couriers.foursix46.com",
//               },
//               {
//                 "@type": "ListItem",
//                 position: 2,
//                 name: "Industry Sectors",
//                 item: "https://couriers.foursix46.com/sectors",
//               },
//               {
//                 "@type": "ListItem",
//                 position: 3,
//                 name: sector.name,
//                 item: canonicalUrl,
//               },
//             ],
//           })}
//         </script>
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "LocalBusiness",
//             "@id": "https://couriers.foursix46.com/#business",
//             name: "FourSix46® Couriers",
//             url: "https://couriers.foursix46.com",
//             telephone: "+447393363802",
//             image:
//               sector.ogImage || "https://couriers.foursix46.com/og-default.jpg",
//             description: sector.seoDescription || "",
//             address: { "@type": "PostalAddress", addressCountry: "GB" },
//             areaServed: "United Kingdom",
//             sameAs: [
//               "https://www.instagram.com/route46couriers/",
//               "https://www.facebook.com/route46couriers/",
//               "https://www.linkedin.com/company/foursix46-couriers/",
//             ],
//           })}
//         </script>
//         {faqs.length > 0 && (
//           <script type="application/ld+json">
//             {JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: faqs.map((faq: any) => ({
//                 "@type": "Question",
//                 name: faq.question,
//                 acceptedAnswer: { "@type": "Answer", text: faq.answer },
//               })),
//             })}
//           </script>
//         )}
//       </Helmet>

//       {/* ══════════════════════════════════════════════════
//     HERO
// ══════════════════════════════════════════════════ */}
//       <section className="relative min-h-[70vh] sm:min-h-[88vh] flex items-end overflow-hidden bg-[#0d2d47]">
//         <img
//           src={heroImage}
//           alt={sector.heroTitle || sector.name}
//           referrerPolicy="no-referrer"
//           onError={() => setImgError(true)}
//           className="absolute inset-0 w-full h-full object-cover object-center"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/65 to-[#0d2d47]/15" />
//         <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/85 via-[#0d2d47]/30 to-transparent" />

//         {/* Back button */}
//         <button
//           onClick={() => navigate("/sectors")}
//           className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
//       text-white/90 hover:text-[#F5EB18] text-sm font-bold tracking-wide
//       bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full
//       border border-white/20 transition-all hover:bg-white/20"
//         >
//           <ArrowLeft size={15} />
//           <span>All Sectors</span>
//         </button>

//         {/* Hero content */}
//         <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 pt-36 sm:pt-32">
//           {/* Badge */}
//           <div className={cn("mb-5", fadeUp)}>
//             <span className="inline-block bg-[#F5EB18] text-[#134467] text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-sm">
//               Trusted UK Courier Network
//             </span>
//           </div>

//           {/* Title */}
//           <h1
//             className={cn(
//               "text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white",
//               "leading-[1.04] tracking-tight mb-5 max-w-3xl",
//               fadeUp,
//             )}
//           >
//             {sector.heroTitle || sector.name}
//           </h1>

//           {/* Subtitle */}
//           {sector.heroSubtitle && (
//             <p
//               className={cn(
//                 "text-base sm:text-lg text-white/75 max-w-2xl mb-8 leading-[1.85] font-medium",
//                 fadeUp,
//               )}
//             >
//               {sector.heroSubtitle}
//             </p>
//           )}

//           {/* Static chips — same as ServiceDetailPage */}
//           <div className={cn("flex flex-wrap gap-2 sm:gap-3 mb-9", fadeUp)}>
//             <HeroChip
//               icon={<Timer className="w-4 h-4 text-[#F5EB18]" />}
//               label="60 Min Collection"
//             />
//             <HeroChip
//               icon={<Globe className="w-4 h-4 text-[#48AEDD]" />}
//               label="UK Mainland Coverage"
//             />
//             <HeroChip
//               icon={<Zap className="w-4 h-4 text-[#E53935]" />}
//               label="Same Day Delivery"
//             />
//           </div>

//           {/* CTA */}
//           <button
//             onClick={() => navigate("/quick-quote")}
//             className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
//         active:scale-95 text-white font-black uppercase tracking-wide
//         px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
//         shadow-xl shadow-red-900/40 transition-all hover:scale-105
//         w-full sm:w-auto justify-center"
//           >
//             Get a Quote
//           </button>
//         </div>

//         {/* Bottom wave */}
//         <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
//           <svg
//             viewBox="0 0 1440 56"
//             xmlns="http://www.w3.org/2000/svg"
//             preserveAspectRatio="none"
//             className="w-full h-10 sm:h-14"
//           >
//             <path
//               d="M0 56L1440 56L1440 20C1200 56 960 0 720 20C480 40 240 0 0 20Z"
//               fill="white"
//             />
//           </svg>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           STATS TRUST BAR
//       ══════════════════════════════════════════════════ */}

//       {/* ══════════════════════════════════════════════════
//           INTRO
//       ══════════════════════════════════════════════════ */}
//       {sector.intro && (
//         <section className="max-w-3xl mx-auto py-16 sm:py-20 px-5 sm:px-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#E53935] to-[#48AEDD]" />
//             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#48AEDD]">
//               About This Sector
//             </span>
//           </div>
//           <div
//             dangerouslySetInnerHTML={{ __html: sector.intro }}
//             className="text-lg sm:text-xl text-[#134467]/80 leading-[1.85]
//               prose prose-lg max-w-none
//               prose-p:text-[#134467]/75 prose-p:leading-[1.85] prose-p:font-medium
//               prose-strong:text-[#134467] prose-strong:font-black
//               prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
//           />
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           CONTENT BLOCKS
//       ══════════════════════════════════════════════════ */}
//       {sector.contentBlocks?.length > 0 && (
//         <section>
//           <BlockRenderer blocks={sector.contentBlocks} />
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           HOW OUR COURIER NETWORK WORKS
//       ══════════════════════════════════════════════════ */}
//       <HowOurNetworkWorks />

//       {/* ══════════════════════════════════════════════════
//           WHY CHOOSE ROUTE46 COURIERS
//       ══════════════════════════════════════════════════ */}
//       <WhyChooseSection />

//       {/* ══════════════════════════════════════════════════
//           RECOMMENDED SERVICES
//       ══════════════════════════════════════════════════ */}
//       {recommendedServices.length > 0 && (
//         <CardsHub
//           eyebrow="Express Delivery Across the UK"
//           title="Specialist Courier Services"
//           subtitle="Explore our specialist courier services designed for urgent deliveries, confidential documents, and time-critical logistics across the UK."
//           items={recommendedServices}
//           basePath="/services"
//           navigate={navigate}
//           accentColor="#48AEDD"
//           badgeLabel="Courier Service"
//           FallbackIcon={Truck}
//           fallbackGradient="from-[#134467] via-[#1a5280] to-[#48AEDD]"
//           entityType="service"
//           bg="bg-white"
//         />
//       )}

//       {/* ══════════════════════════════════════════════════
//           FEATURED LOCATIONS
//       ══════════════════════════════════════════════════ */}
//       {featuredLocations.length > 0 && (
//         <CardsHub
//           eyebrow="Nationwide Courier Coverage"
//           title="Popular UK Courier Locations"
//           subtitle="Our courier network covers major cities and business hubs across the UK, providing reliable same-day and urgent delivery services."
//           items={featuredLocations}
//           basePath="/locations"
//           navigate={navigate}
//           accentColor="#134467"
//           badgeLabel="Courier Location"
//           FallbackIcon={MapPin}
//           fallbackGradient="from-[#134467] via-[#1a5280] to-[#0d2d47]"
//           entityType="location"
//           bg="bg-slate-50"
//         />
//       )}

//       {/* ══════════════════════════════════════════════════
//           FAQs
//       ══════════════════════════════════════════════════ */}
//       {faqs.length > 0 && (
//         <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-100">
//           <div className="max-w-3xl mx-auto px-5 sm:px-6">
//             <div className="text-center mb-12">
//               <span className="inline-block bg-[#134467]/5 text-[#134467] text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-[#134467]/10 mb-5">
//                 Got Questions?
//               </span>
//               <h2 className="text-3xl sm:text-4xl font-black text-[#134467] tracking-tight leading-tight">
//                 {sector.faqHeading || "Sector FAQs"}
//               </h2>
//               <p className="mt-3 text-[#134467]/50 text-sm font-medium">
//                 Everything you need to know about this sector.
//               </p>
//             </div>
//             <Accordion type="single" collapsible className="space-y-3">
//               {faqs.map((faq: any, i: number) => (
//                 <AccordionItem
//                   key={faq.id || i}
//                   value={`faq-${i}`}
//                   className={cn(
//                     "border border-slate-100 rounded-2xl overflow-hidden bg-white transition-all shadow-sm",
//                     "data-[state=open]:border-[#48AEDD] data-[state=open]:shadow-md data-[state=open]:ring-1 data-[state=open]:ring-[#48AEDD]/20",
//                   )}
//                 >
//                   <AccordionTrigger className="px-5 sm:px-6 py-5 text-left font-bold text-[#134467] hover:no-underline text-[15px] sm:text-base tracking-tight">
//                     <span className="flex items-center gap-3">
//                       <span className="w-7 h-7 rounded-full bg-[#48AEDD]/10 text-[#48AEDD] text-xs font-black flex items-center justify-center flex-shrink-0 tracking-wide">
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                       {faq.question}
//                     </span>
//                   </AccordionTrigger>
//                   <AccordionContent className="px-5 sm:px-6 pb-6 pt-4 border-t border-slate-50">
//                     <div
//                       dangerouslySetInnerHTML={{ __html: faq.answer }}
//                       className="prose prose-sm max-w-none
//                         prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:font-medium
//                         prose-strong:text-[#134467] prose-strong:font-black
//                         prose-ul:text-slate-600 prose-li:marker:text-[#E53935]
//                         prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
//                     />
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           DEDICATED COURIER NETWORK
//       ══════════════════════════════════════════════════ */}
//       <DedicatedCourierNetwork />

//       {/* ══════════════════════════════════════════════════
//           FINAL CTA BANNER
//       ══════════════════════════════════════════════════ */}
//       <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative z-10 max-w-4xl mx-auto text-center px-5 sm:px-6">
//           <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
//             {[
//               "Same Day Dispatch",
//               "UK Mainland Coverage",
//               "60 Min Collection",
//               "24/7 Support",
//             ].map((t) => (
//               <span
//                 key={t}
//                 className="flex items-center gap-1.5 text-white/70 text-sm font-semibold"
//               >
//                 <CheckCircle2 className="w-4 h-4 text-[#F5EB18] flex-shrink-0" />
//                 {t}
//               </span>
//             ))}
//           </div>
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <Layers className="w-5 h-5 text-[#48AEDD]" />
//             <span className="text-[#48AEDD] text-sm font-bold uppercase tracking-widest">
//               {sector.name}
//             </span>
//           </div>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
//             Need a courier for your sector?
//           </h2>
//           <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-[1.85] font-medium">
//             Get an instant quote — same-day dispatch available across the UK
//             mainland.
//           </p>
//           <button
//             onClick={() => navigate("/quick-quote")}
//             className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
//               active:scale-95 text-white font-black uppercase tracking-wide
//               px-10 sm:px-14 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
//               shadow-2xl shadow-red-900/40 transition-all hover:scale-105
//               w-full sm:w-auto justify-center"
//           >
//             Get a Quote
//             <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════
//    SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════ */

// /* ─── CardItem — fetches full data if no inline image ───────────────────── */
// const CardItem = ({
//   item,
//   basePath,
//   navigate,
//   accentColor,
//   badgeLabel,
//   FallbackIcon,
//   fallbackGradient,
//   index,
//   entityType,
// }: {
//   item: any;
//   basePath: string;
//   navigate: (to: string) => void;
//   accentColor: string;
//   badgeLabel: string;
//   FallbackIcon: React.ElementType;
//   fallbackGradient: string;
//   index: number;
//   entityType: "service" | "sector" | "location";
// }) => {
//   const [cardImgError, setCardImgError] = React.useState(false);
//   const [fullData, setFullData] = React.useState<any>(null);
//   const [fetching, setFetching] = React.useState(false);

//   const itemSlug = typeof item === "string" ? item : item.slug;
//   const name = typeof item === "string" ? item.replace(/-/g, " ") : item.name;
//   const hasInlineImage = !!(
//     item?.heroImage ||
//     item?.featuredImage ||
//     item?.image
//   );

//   /* Fetch full record when the related item has no image inline */
//   React.useEffect(() => {
//     if (hasInlineImage || !itemSlug || fetching) return;
//     setFetching(true);
//     const endpoint =
//       entityType === "sector"
//         ? `${apiUrl}/api/sectors/${itemSlug}`
//         : entityType === "location"
//           ? `${apiUrl}/api/locations/${itemSlug}`
//           : `${apiUrl}/api/services/${itemSlug}`;
//     fetch(endpoint)
//       .then((r) => (r.ok ? r.json() : null))
//       .then((data) => {
//         if (data) setFullData(data.data || data);
//       })
//       .catch(() => {})
//       .finally(() => setFetching(false));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [itemSlug]);

//   const src = fullData || item;
//   const rawImage = src?.heroImage || src?.featuredImage || src?.image || null;
//   const image = cardImgError ? null : rawImage;
//   const description =
//     src?.heroSubtitle || src?.seoDescription || src?.description || null;

//   const ctaLabel =
//     entityType === "sector"
//       ? "Explore Sector"
//       : entityType === "location"
//         ? "View Location"
//         : "View Service";

//   return (
//     <div
//       onClick={() => navigate(`${basePath}/${itemSlug}`)}
//       className={cn(
//         "cursor-pointer group bg-white border border-slate-100 rounded-2xl p-3",
//         "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
//         fadeUp,
//       )}
//       style={{ animationDelay: `${index * 60}ms` }}
//     >
//       {/* ── Image / Placeholder ── */}
//       <div className="relative rounded-xl overflow-hidden h-48">
//         {fetching && !image ? (
//           <div className="w-full h-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
//         ) : image ? (
//           <img
//             src={image}
//             alt={name}
//             className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
//             onError={() => setCardImgError(true)}
//           />
//         ) : (
//           <div
//             className={cn(
//               "w-full h-full bg-gradient-to-br flex items-center justify-center",
//               fallbackGradient,
//             )}
//           >
//             <FallbackIcon className="w-14 h-14 text-white/20" />
//           </div>
//         )}
//       </div>

//       {/* ── Text content ── */}
//       <div className="px-2 pt-4 pb-2">
//         <div className="flex items-center gap-2 mb-1.5">
//           <FallbackIcon
//             className="w-[18px] h-[18px] flex-shrink-0"
//             style={{ color: accentColor }}
//           />
//           <h3
//             className="font-black text-[15px] text-[#134467] leading-snug tracking-tight capitalize
//             group-hover:text-[#E53935] transition-colors duration-200"
//           >
//             {name}
//           </h3>
//         </div>
//         {description && (
//           <p className="text-[#134467]/55 text-[13px] font-medium leading-[1.7] line-clamp-2 mt-1 mb-3">
//             {description}
//           </p>
//         )}
//         <div
//           className="flex items-center gap-1.5 mt-2"
//           style={{ color: accentColor }}
//         >
//           <span className="text-[12px] font-black uppercase tracking-[0.1em]">
//             {ctaLabel}
//           </span>
//           <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── CardsHub — grid wrapper ───────────────────────────────────────────── */
// const CardsHub = ({
//   eyebrow,
//   title,
//   subtitle,
//   items,
//   basePath,
//   navigate,
//   accentColor,
//   badgeLabel,
//   FallbackIcon,
//   fallbackGradient,
//   entityType,
//   bg = "bg-white",
// }: {
//   eyebrow: string;
//   title: string;
//   subtitle: string;
//   items: any[];
//   basePath: string;
//   navigate: (to: string) => void;
//   accentColor: string;
//   badgeLabel: string;
//   FallbackIcon: React.ElementType;
//   fallbackGradient: string;
//   entityType: "service" | "sector" | "location";
//   bg?: string;
// }) => (
//   <section className={cn("py-16 sm:py-20 border-t border-slate-100", bg)}>
//     <div className="max-w-6xl mx-auto px-5 sm:px-6">
//       <div className="mb-10 sm:mb-12">
//         <span
//           className="inline-block text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-3 shadow-sm"
//           style={{ background: `${accentColor}18`, color: accentColor }}
//         >
//           {eyebrow}
//         </span>
//         <h2 className="text-2xl sm:text-3xl font-black text-[#134467] tracking-tight leading-tight mb-2">
//           {title}
//         </h2>
//         <p className="text-[#134467]/55 text-sm sm:text-base font-medium max-w-2xl leading-[1.85]">
//           {subtitle}
//         </p>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
//         {items.map((item: any, i: number) => (
//           <CardItem
//             key={`${typeof item === "string" ? item : item.slug}-${i}`}
//             item={item}
//             basePath={basePath}
//             navigate={navigate}
//             accentColor={accentColor}
//             badgeLabel={badgeLabel}
//             FallbackIcon={FallbackIcon}
//             fallbackGradient={fallbackGradient}
//             entityType={entityType}
//             index={i}
//           />
//         ))}
//       </div>
//     </div>
//   </section>
// );

// /* ─── HeroChip ──────────────────────────────────────────────────────────── */
// function HeroChip({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
//       <span className="flex-shrink-0">{icon}</span>
//       <span className="text-white font-bold text-xs sm:text-sm tracking-wide">
//         {label}
//       </span>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Layers,
  Clock,
  Zap,
  Globe,
  Timer,
  Navigation,
  Network,
  CheckCircle2,
  Truck,
} from "lucide-react";
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

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANT SECTIONS
───────────────────────────────────────────────────────────────────────────── */
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
  <section className="py-20 sm:py-24 bg-[#134467] relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
    <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
      <div className="text-center mb-14">
        <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-4 shadow-sm">
          Our Process
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          How Our Courier Network Works
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4">
        {HOW_IT_WORKS_STEPS.map(({ n, title, desc }, i) => (
          <div key={n} className="relative group">
            {i < HOW_IT_WORKS_STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-7 left-[65%] w-full h-px bg-gradient-to-r from-white/25 to-transparent z-0" />
            )}
            <div className="relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#E53935] flex items-center justify-center shadow-xl shadow-red-900/40 group-hover:scale-110 group-hover:bg-[#c0392b] transition-all duration-300">
                <span className="text-white font-black text-sm tracking-wide">
                  0{n}
                </span>
              </div>
              <h3 className="text-white font-black text-sm leading-snug tracking-wide">
                {title}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed font-medium">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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
  <section className="bg-slate-50/80 py-20 sm:py-24 border-t border-slate-100">
    <div className="max-w-6xl mx-auto px-5 sm:px-6">
      <div className="text-center mb-14">
        <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-5 shadow-sm">
          Why Route46
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#134467] tracking-tight leading-tight mb-4">
          Why Choose Route46 Couriers
        </h2>
        <p className="text-[#134467]/55 text-base font-medium max-w-2xl mx-auto leading-[1.85]">
          Fast, secure and professional courier solutions across the UK mainland
          for urgent documents, parcels, pallets and specialist deliveries.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_CARDS.map(({ Icon, label, title, desc }, i) => (
          <div
            key={title}
            className={cn(
              "bg-white p-8 rounded-3xl border border-slate-100",
              "hover:shadow-2xl hover:-translate-y-2 hover:border-[#48AEDD]/25 transition-all duration-300 group",
              fadeUp,
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#134467]/5 to-[#48AEDD]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-[#48AEDD]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E53935] mb-2.5 block">
              {label}
            </span>
            <h3 className="font-black text-[17px] text-[#134467] mb-3 leading-snug tracking-tight group-hover:text-[#E53935] transition-colors duration-200">
              {title}
            </h3>
            <p className="text-[#134467]/58 text-[13.5px] leading-[1.85] font-medium">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DedicatedCourierNetwork = () => (
  <div className="bg-[#134467]/5 border-y border-[#134467]/10 py-8 sm:py-10">
    <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
      <p className="text-[#134467] font-semibold text-base sm:text-lg leading-[1.85]">
        Route46 Couriers provides reliable same-day transport across the UK with
        access to thousands of verified drivers and vehicles through our
        extended courier network, ensuring fast collection, secure handling, and
        true nationwide delivery coverage.
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export async function entry(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${apiUrl}/api/sectors`);
    const data = await res.json();
    const items = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    return items.map((s: { slug: string }) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}
// Add this export to SectorDetailPage.tsx
export async function loader({ params }: { params: Record<string, string> }) {
  const slug = params.slug;
  if (!slug) return { sector: null, allFaqs: [] };
  try {
    const [sectorRes, faqsRes] = await Promise.all([
      fetch(`${apiUrl}/api/sectors/${slug}`),
      fetch(`${apiUrl}/api/faqs`),
    ]);
    const sectorData = sectorRes.ok ? await sectorRes.json() : null;
    const faqsData = faqsRes.ok ? await faqsRes.json() : [];
    return {
      sector: sectorData?.data || sectorData || null,
      allFaqs: Array.isArray(faqsData?.data)
        ? faqsData.data
        : Array.isArray(faqsData)
          ? faqsData
          : [],
    };
  } catch {
    return { sector: null, allFaqs: [] };
  }
}
export default function SectorDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sector, setSector] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  /* ── Fetch sector ── */
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/sectors/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setSector(json.data || json);
      } catch {
        setSector(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── Fetch FAQs (separate effect, depends on sector) ── */
  useEffect(() => {
    if (!sector?.faqIds?.length) return;
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/api/faqs`);
        if (!res.ok) return;
        const data = await res.json(); // ✅ called only once
        const all: any[] = data.data || data;
        setFaqs(all.filter((f: any) => sector.faqIds.includes(f.id)));
      } catch {
        /* silent */
      }
    })();
  }, [sector]); // ✅ runs after sector is set

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
          </div>
          <p className="text-[#134467]/50 text-sm font-semibold tracking-widest uppercase">
            Loading sector details...
          </p>
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!sector || sector.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-5 text-center antialiased">
        <div className="w-24 h-24 rounded-full bg-[#48AEDD]/10 flex items-center justify-center">
          <span className="text-4xl font-black text-[#48AEDD] tracking-tight">
            404
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#134467] tracking-tight">
            Sector Not Found
          </h1>
          <p className="text-[#134467]/50 mt-2 font-medium text-sm">
            This sector doesn't exist or may have been removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/sectors")}
          className="flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-black text-sm tracking-wide hover:bg-[#134467]/90 transition"
        >
          <ArrowLeft size={16} /> Back to Sectors
        </button>
      </div>
    );
  }

  const heroImage =
    !imgError && sector.heroImage ? sector.heroImage : "/route462.jpeg";
  const canonicalUrl =
    sector.canonicalUrl ||
    `https://couriers.foursix46.com/sectors/${sector.slug}`;
  const recommendedServices: any[] = sector.recommendedServices || [];
  const featuredLocations: any[] = sector.featuredLocations || [];

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white antialiased">
      {/* ══════════════════════════════════════════════════
          SEO
      ══════════════════════════════════════════════════ */}
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
            address: { "@type": "PostalAddress", addressCountry: "GB" },
            areaServed: "United Kingdom",
            sameAs: [
              "https://www.instagram.com/route46couriers/",
              "https://www.facebook.com/route46couriers/",
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

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] sm:min-h-[88vh] flex items-end overflow-hidden bg-[#0d2d47]">
        <img
          src={heroImage}
          alt={sector.heroTitle || sector.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/65 to-[#0d2d47]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/85 via-[#0d2d47]/30 to-transparent" />

        <button
          onClick={() => navigate("/sectors")}
          className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
            text-white/90 hover:text-[#F5EB18] text-sm font-bold tracking-wide
            bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full
            border border-white/20 transition-all hover:bg-white/20"
        >
          <ArrowLeft size={15} />
          <span>All Sectors</span>
        </button>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 pt-36 sm:pt-32">
          <div className={cn("mb-5", fadeUp)}>
            <span className="inline-block bg-[#F5EB18] text-[#134467] text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-sm">
              Trusted UK Courier Network
            </span>
          </div>
          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white",
              "leading-[1.04] tracking-tight mb-5 max-w-3xl",
              fadeUp,
            )}
          >
            {sector.heroTitle || sector.name}
          </h1>
          {sector.heroSubtitle && (
            <p
              className={cn(
                "text-base sm:text-lg text-white/75 max-w-2xl mb-8 leading-[1.85] font-medium",
                fadeUp,
              )}
            >
              {sector.heroSubtitle}
            </p>
          )}
          <div className={cn("flex flex-wrap gap-2 sm:gap-3 mb-9", fadeUp)}>
            <HeroChip
              icon={<Timer className="w-4 h-4 text-[#F5EB18]" />}
              label="60 Min Collection"
            />
            <HeroChip
              icon={<Globe className="w-4 h-4 text-[#48AEDD]" />}
              label="UK Mainland Coverage"
            />
            <HeroChip
              icon={<Zap className="w-4 h-4 text-[#E53935]" />}
              label="Same Day Delivery"
            />
          </div>
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

      {/* ══════════════════════════════════════════════════
          INTRO
      ══════════════════════════════════════════════════ */}
      {sector.intro && (
        <section className="max-w-3xl mx-auto py-16 sm:py-20 px-5 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#E53935] to-[#48AEDD]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#48AEDD]">
              About This Sector
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: sector.intro }}
            className="text-lg sm:text-xl text-[#134467]/80 leading-[1.85]
              prose prose-lg max-w-none
              prose-p:text-[#134467]/75 prose-p:leading-[1.85] prose-p:font-medium
              prose-strong:text-[#134467] prose-strong:font-black
              prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          CONTENT BLOCKS
      ══════════════════════════════════════════════════ */}
      {sector.contentBlocks?.length > 0 && (
        <section>
          <BlockRenderer blocks={sector.contentBlocks} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          HOW OUR COURIER NETWORK WORKS
      ══════════════════════════════════════════════════ */}
      <HowOurNetworkWorks />

      {/* ══════════════════════════════════════════════════
          WHY CHOOSE ROUTE46 COURIERS
      ══════════════════════════════════════════════════ */}
      <WhyChooseSection />

      {/* ══════════════════════════════════════════════════
          RECOMMENDED SERVICES
      ══════════════════════════════════════════════════ */}
      {recommendedServices.length > 0 && (
        <CardsHub
          eyebrow="Express Delivery Across the UK"
          title="Specialist Courier Services"
          subtitle="Explore our specialist courier services designed for urgent deliveries, confidential documents, and time-critical logistics across the UK."
          items={recommendedServices}
          basePath="/services"
          navigate={navigate}
          accentColor="#48AEDD"
          badgeLabel="Courier Service"
          FallbackIcon={Truck}
          fallbackGradient="from-[#134467] via-[#1a5280] to-[#48AEDD]"
          entityType="service"
          bg="bg-white"
        />
      )}

      {/* ══════════════════════════════════════════════════
          FEATURED LOCATIONS
      ══════════════════════════════════════════════════ */}
      {featuredLocations.length > 0 && (
        <CardsHub
          eyebrow="Nationwide Courier Coverage"
          title="Popular UK Courier Locations"
          subtitle="Our courier network covers major cities and business hubs across the UK, providing reliable same-day and urgent delivery services."
          items={featuredLocations}
          basePath="/locations"
          navigate={navigate}
          accentColor="#134467"
          badgeLabel="Courier Location"
          FallbackIcon={MapPin}
          fallbackGradient="from-[#134467] via-[#1a5280] to-[#0d2d47]"
          entityType="location"
          bg="bg-slate-50"
        />
      )}

      {/* ══════════════════════════════════════════════════
          FAQs
      ══════════════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-5 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#134467]/5 text-[#134467] text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-[#134467]/10 mb-5">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#134467] tracking-tight leading-tight">
                {sector.faqHeading || "Sector FAQs"}
              </h2>
              <p className="mt-3 text-[#134467]/50 text-sm font-medium">
                Everything you need to know about this sector.
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <AccordionItem
                  key={faq.id || i}
                  value={`faq-${i}`}
                  className={cn(
                    "border border-slate-100 rounded-2xl overflow-hidden bg-white transition-all shadow-sm",
                    "data-[state=open]:border-[#48AEDD] data-[state=open]:shadow-md data-[state=open]:ring-1 data-[state=open]:ring-[#48AEDD]/20",
                  )}
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-5 text-left font-bold text-[#134467] hover:no-underline text-[15px] sm:text-base tracking-tight">
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#48AEDD]/10 text-[#48AEDD] text-xs font-black flex items-center justify-center flex-shrink-0 tracking-wide">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 sm:px-6 pb-6 pt-4 border-t border-slate-50">
                    <div
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                      className="prose prose-sm max-w-none
                        prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:font-medium
                        prose-strong:text-[#134467] prose-strong:font-black
                        prose-ul:text-slate-600 prose-li:marker:text-[#E53935]
                        prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          DEDICATED COURIER NETWORK
      ══════════════════════════════════════════════════ */}
      <DedicatedCourierNetwork />

      {/* ══════════════════════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
            {[
              "Same Day Dispatch",
              "UK Mainland Coverage",
              "60 Min Collection",
              "24/7 Support",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-white/70 text-sm font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F5EB18] flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-[#48AEDD]" />
            <span className="text-[#48AEDD] text-sm font-bold uppercase tracking-widest">
              {sector.name}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Need a courier for your sector?
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-[1.85] font-medium">
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
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════ */

const CardItem = ({
  item,
  basePath,
  navigate,
  accentColor,
  badgeLabel,
  FallbackIcon,
  fallbackGradient,
  index,
  entityType,
}: {
  item: any;
  basePath: string;
  navigate: (to: string) => void;
  accentColor: string;
  badgeLabel: string;
  FallbackIcon: React.ElementType;
  fallbackGradient: string;
  index: number;
  entityType: "service" | "sector" | "location";
}) => {
  const [cardImgError, setCardImgError] = React.useState(false);
  const [fullData, setFullData] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(false);

  const itemSlug = typeof item === "string" ? item : item.slug;
  const name = typeof item === "string" ? item.replace(/-/g, " ") : item.name;
  const hasInlineImage = !!(
    item?.heroImage ||
    item?.featuredImage ||
    item?.image
  );

  React.useEffect(() => {
    if (hasInlineImage || !itemSlug || fetching) return;
    setFetching(true);
    const endpoint =
      entityType === "sector"
        ? `${apiUrl}/api/sectors/${itemSlug}`
        : entityType === "location"
          ? `${apiUrl}/api/locations/${itemSlug}`
          : `${apiUrl}/api/services/${itemSlug}`;
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setFullData(data.data || data);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSlug]);

  const src = fullData || item;
  const rawImage = src?.heroImage || src?.featuredImage || src?.image || null;
  const image = cardImgError ? null : rawImage;
  const description =
    src?.heroSubtitle || src?.seoDescription || src?.description || null;
  const ctaLabel =
    entityType === "sector"
      ? "Explore Sector"
      : entityType === "location"
        ? "View Location"
        : "View Service";

  return (
    <div
      onClick={() => navigate(`${basePath}/${itemSlug}`)}
      className={cn(
        "cursor-pointer group bg-white border border-slate-100 rounded-2xl p-3",
        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        fadeUp,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative rounded-xl overflow-hidden h-48">
        {fetching && !image ? (
          <div className="w-full h-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
        ) : image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            onError={() => setCardImgError(true)}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br flex items-center justify-center",
              fallbackGradient,
            )}
          >
            <FallbackIcon className="w-14 h-14 text-white/20" />
          </div>
        )}
      </div>
      <div className="px-2 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <FallbackIcon
            className="w-[18px] h-[18px] flex-shrink-0"
            style={{ color: accentColor }}
          />
          <h3 className="font-black text-[15px] text-[#134467] leading-snug tracking-tight capitalize group-hover:text-[#E53935] transition-colors duration-200">
            {name}
          </h3>
        </div>
        {description && (
          <p className="text-[#134467]/55 text-[13px] font-medium leading-[1.7] line-clamp-2 mt-1 mb-3">
            {description}
          </p>
        )}
        <div
          className="flex items-center gap-1.5 mt-2"
          style={{ color: accentColor }}
        >
          <span className="text-[12px] font-black uppercase tracking-[0.1em]">
            {ctaLabel}
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};

const CardsHub = ({
  eyebrow,
  title,
  subtitle,
  items,
  basePath,
  navigate,
  accentColor,
  badgeLabel,
  FallbackIcon,
  fallbackGradient,
  entityType,
  bg = "bg-white",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: any[];
  basePath: string;
  navigate: (to: string) => void;
  accentColor: string;
  badgeLabel: string;
  FallbackIcon: React.ElementType;
  fallbackGradient: string;
  entityType: "service" | "sector" | "location";
  bg?: string;
}) => (
  <section className={cn("py-16 sm:py-20 border-t border-slate-100", bg)}>
    <div className="max-w-6xl mx-auto px-5 sm:px-6">
      <div className="mb-10 sm:mb-12">
        <span
          className="inline-block text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-3 shadow-sm"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#134467] tracking-tight leading-tight mb-2">
          {title}
        </h2>
        <p className="text-[#134467]/55 text-sm sm:text-base font-medium max-w-2xl leading-[1.85]">
          {subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
        {items.map((item: any, i: number) => (
          <CardItem
            key={`${typeof item === "string" ? item : item.slug}-${i}`}
            item={item}
            basePath={basePath}
            navigate={navigate}
            accentColor={accentColor}
            badgeLabel={badgeLabel}
            FallbackIcon={FallbackIcon}
            fallbackGradient={fallbackGradient}
            entityType={entityType}
            index={i}
          />
        ))}
      </div>
    </div>
  </section>
);

function HeroChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-white font-bold text-xs sm:text-sm tracking-wide">
        {label}
      </span>
    </div>
  );
}
