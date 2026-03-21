// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Package,
//   ChevronRight,
//   Clock,
//   Zap,
//   Map,
//   Timer,
//   MapPin,
//   Network,
//   CheckCircle2,
// } from "lucide-react";
// import { Helmet } from "react-helmet-async";
// import Footer from "@/components/Footer";
// import BlockRenderer from "@/components/BlockRenderer";
// import { cn } from "@/lib/utils";
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
//    CONSTANT — 6 Why-Choose cards  (identical across all 4 CMS pages)
// ───────────────────────────────────────────────────────────────────────────── */
// const WHY_CHOOSE_FEATURES = [
//   {
//     icon: Clock,
//     label: "Available 24/7",
//     title: "24/7 Courier Support",
//     description:
//       "Our courier operations run 24 hours a day, 7 days a week to handle urgent deliveries whenever they arise. Whether you need late-night document transport or early morning collections, our dedicated courier network is always ready to respond.",
//   },
//   {
//     icon: Zap,
//     label: "Same Day Transport",
//     title: "Same Day Courier Delivery",
//     description:
//       "Route46 Couriers provides reliable same day courier services across the UK. Our dedicated drivers collect your shipment and transport it directly to the destination without unnecessary stops or hub delays.",
//   },
//   {
//     icon: Map,
//     label: "Nationwide Coverage",
//     title: "Across the UK Mainland",
//     description:
//       "Our courier network covers cities, towns, and business districts across the UK mainland. From London and Birmingham to Cardiff, Manchester, and beyond, we ensure dependable transport wherever your delivery needs to go.",
//   },
//   {
//     icon: Timer,
//     label: "Rapid Dispatch",
//     title: "Collection Within 60 Minutes",
//     description:
//       "For urgent deliveries, our courier drivers can often collect shipments within 60 minutes depending on location and availability. This rapid response ensures time-sensitive documents, parcels, or goods move immediately.",
//   },
//   {
//     icon: MapPin,
//     label: "Real-Time Visibility",
//     title: "Live GPS Delivery Tracking",
//     description:
//       "Every delivery is supported by real-time tracking and delivery confirmation. Our system provides visibility from collection to delivery, ensuring transparency and confidence for both businesses and individual customers.",
//   },
//   {
//     icon: Network,
//     label: "Specialist Deliveries",
//     title: "Industries & Courier Services",
//     description:
//       "Route46 Couriers supports a wide range of industries including legal, medical, corporate, aviation, and e-commerce. From passport deliveries and legal documents to urgent parcels and specialist freight, our services are designed to meet diverse business needs.",
//   },
// ];

// /* ─────────────────────────────────────────────────────────────────────────────
//    CONSTANT — How It Works steps  (identical across all 4 CMS pages)
// ───────────────────────────────────────────────────────────────────────────── */
// const HOW_IT_WORKS = [
//   {
//     step: "01",
//     title: "Request a Quote",
//     desc: "Submit pickup and delivery details online.",
//   },
//   {
//     step: "02",
//     title: "Courier Assigned",
//     desc: "A professional driver is dispatched quickly.",
//   },
//   {
//     step: "03",
//     title: "Collection",
//     desc: "Goods or documents are collected securely.",
//   },
//   {
//     step: "04",
//     title: "Direct Delivery",
//     desc: "Items are transported directly to the destination.",
//   },
//   {
//     step: "05",
//     title: "Confirmation",
//     desc: "Delivery confirmation and proof of delivery provided.",
//   },
// ];

// /* ─────────────────────────────────────────────────────────────────────────────
//    PAGE
// ───────────────────────────────────────────────────────────────────────────── */
// export default function ServiceDetailPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [service, setService] = useState<any>(null);
//   const [faqs, setFaqs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [imgError, setImgError] = useState(false);

//   /* ── Fetch service ── */
//   useEffect(() => {
//     if (!slug) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${apiUrl}/api/services/${slug}`);
//         if (!res.ok) throw new Error("Not found");
//         const json = await res.json();
//         setService(json.data || json);
//       } catch {
//         setService(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [slug]);

//   /* ── Fetch FAQs ── */
//   useEffect(() => {
//     if (!service?.faqIds?.length) return;
//     (async () => {
//       try {
//         const res = await fetch(`${apiUrl}/api/faqs`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const all: any[] = data.data || data;
//         setFaqs(all.filter((f) => service.faqIds.includes(f.id)));
//       } catch {
//         /* silent */
//       }
//     })();
//   }, [service]);

//   /* ── Loading skeleton ── */
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="relative h-[60vh] sm:h-[75vh] bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
//         <div className="max-w-4xl mx-auto px-5 py-14 space-y-6">
//           <div className="h-6 bg-slate-100 rounded-full w-32 animate-pulse" />
//           <div className="h-10 bg-slate-100 rounded-xl w-3/4 animate-pulse" />
//           {[90, 75, 60].map((w, i) => (
//             <div
//               key={i}
//               className="h-4 bg-slate-100 rounded-full animate-pulse"
//               style={{ width: `${w}%` }}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* ── 404 ── */
//   if (!service || service.status !== "published") {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-5 text-center">
//         <div className="w-24 h-24 rounded-full bg-[#48AEDD]/10 flex items-center justify-center">
//           <span className="text-4xl font-black text-[#48AEDD]">404</span>
//         </div>
//         <div>
//           <h1 className="text-2xl font-black text-[#134467]">
//             Service Not Found
//           </h1>
//           <p className="text-[#134467]/50 mt-2">
//             This service doesn't exist or may have been removed.
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/services")}
//           className="flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#134467]/90 transition"
//         >
//           <ArrowLeft size={18} /> Back to Services
//         </button>
//       </div>
//     );
//   }

//   const heroImage =
//     !imgError && service.heroImage
//       ? service.heroImage
//       : "/FourSix_truckimage.jpg";
//   const canonicalUrl =
//     service.canonicalUrl ||
//     `https://couriers.foursix46.com/services/${service.slug}`;
//   const vehicleTypes: string[] = Array.isArray(service.vehicleTypes)
//     ? service.vehicleTypes
//     : [];
//   const whatWeCarry: string[] = Array.isArray(service.whatWeCarry)
//     ? service.whatWeCarry
//     : [];
//   const relatedSectors: any[] = service.relatedSectors || [];
//   const featuredLocations: any[] = service.featuredLocations || [];
//   const relatedServices: any[] = service.relatedServices || [];

//   return (
//     <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white">
//       {/* ══════════════════════════════════════════════════
//           SEO
//       ══════════════════════════════════════════════════ */}
//       <Helmet>
//         <title>{service.seoTitle || service.name} | FourSix46®</title>
//         <meta name="description" content={service.seoDescription || ""} />
//         <link rel="canonical" href={canonicalUrl} />
//         <meta property="og:title" content={service.seoTitle || service.name} />
//         <meta
//           property="og:description"
//           content={service.seoDescription || ""}
//         />
//         <meta property="og:url" content={canonicalUrl} />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:image"
//           content={
//             service.ogImage || "https://couriers.foursix46.com/og-default.jpg"
//           }
//         />
//         {service.noindex && <meta name="robots" content="noindex,nofollow" />}
//         <script type="application/ld+json">
//           {JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "Service",
//             name: service.name,
//             description: service.seoDescription,
//             provider: {
//               "@type": "Organization",
//               name: "Route46®",
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
//                 name: "Our Services",
//                 item: "https://couriers.foursix46.com/services",
//               },
//               {
//                 "@type": "ListItem",
//                 position: 3,
//                 name: service.name,
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
//               service.ogImage ||
//               "https://couriers.foursix46.com/og-default.jpg",
//             description: service.seoDescription || "",
//             address: { "@type": "PostalAddress", addressCountry: "GB" },
//             areaServed: "United Kingdom",
//             sameAs: [
//               "https://www.instagram.com/foursix46hq/",
//               "https://www.facebook.com/share/1A15gqnztd/",
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
//           HERO
//       ══════════════════════════════════════════════════ */}
//       <section className="relative min-h-[70vh] sm:min-h-[88vh] flex items-end overflow-hidden bg-[#0d2d47]">
//         <img
//           src={heroImage}
//           alt={service.heroTitle || service.name}
//           referrerPolicy="no-referrer"
//           onError={() => setImgError(true)}
//           className="absolute inset-0 w-full h-full object-cover object-center"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/65 to-[#0d2d47]/15" />
//         <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/85 via-[#0d2d47]/30 to-transparent" />

//         {/* Back button */}
//         <button
//           onClick={() => navigate("/services")}
//           className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
//             text-white/90 hover:text-[#F5EB18] text-sm font-semibold
//             bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full
//             border border-white/20 transition-all hover:bg-white/20"
//         >
//           <ArrowLeft size={15} />
//           <span>All Services</span>
//         </button>

//         {/* Hero content */}
//         <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 pt-36 sm:pt-32">
//           {/* ✅ Badge — Trusted UK Courier Network */}
//           <div className={cn("mb-5", fadeUp)}>
//             <span className="inline-block bg-[#F5EB18] text-[#134467] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
//               Trusted UK Courier Network
//             </span>
//           </div>

//           {/* Title */}
//           <h1
//             className={cn(
//               "text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[1.04] mb-5 max-w-3xl",
//               fadeUp,
//             )}
//           >
//             {service.heroTitle || service.name}
//           </h1>

//           {/* Subtitle */}
//           {service.heroSubtitle && (
//             <p
//               className={cn(
//                 "text-base sm:text-lg text-white/75 max-w-2xl mb-8 leading-relaxed",
//                 fadeUp,
//               )}
//             >
//               {service.heroSubtitle}
//             </p>
//           )}

//           {/* ✅ Static chips — 60 Min Collection, UK Mainland, Same Day Delivery */}
//           <div className={cn("flex flex-wrap gap-2 sm:gap-3 mb-9", fadeUp)}>
//             <HeroChip
//               icon={<Timer className="w-4 h-4 text-[#F5EB18]" />}
//               label="60 Min Collection"
//             />
//             <HeroChip
//               icon={<Map className="w-4 h-4 text-[#48AEDD]" />}
//               label="UK Mainland Coverage"
//             />
//             <HeroChip
//               icon={<Zap className="w-4 h-4 text-[#E53935]" />}
//               label="Same Day Delivery"
//             />
//           </div>

//           {/* CTA */}
//           <button
//             onClick={() => navigate(service.ctaPrimaryLink || "/quick-quote")}
//             className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
//               active:scale-95 text-white font-black uppercase tracking-wide
//               px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
//               shadow-xl shadow-red-900/40 transition-all hover:scale-105
//               w-full sm:w-auto justify-center"
//           >
//             {service.ctaPrimaryText || "Get a Quote"}
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
//           INTRO  — styled accent paragraph
//       ══════════════════════════════════════════════════ */}
//       {service.intro && (
//         <section className="max-w-3xl mx-auto py-16 sm:py-20 px-5 sm:px-6">
//           {/* Accent bar */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#E53935] to-[#48AEDD]" />
//             <span className="text-xs font-black uppercase tracking-widest text-[#48AEDD]">
//               About This Service
//             </span>
//           </div>
//           <div
//             dangerouslySetInnerHTML={{ __html: service.intro }}
//             className="text-lg sm:text-xl text-[#134467]/80 leading-[1.8]
//               prose prose-lg max-w-none
//               prose-p:text-[#134467]/75 prose-p:leading-[1.8]
//               prose-strong:text-[#134467] prose-strong:font-black
//               prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
//           />
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           VEHICLE TYPES & WHAT WE CARRY
//       ══════════════════════════════════════════════════ */}
//       {(vehicleTypes.length > 0 || whatWeCarry.length > 0) && (
//         <section className="py-14 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50/30 border-y border-slate-100">
//           <div className="max-w-5xl mx-auto px-5 sm:px-6">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="w-1.5 h-8 rounded-full bg-[#48AEDD]" />
//               <h2 className="text-xl font-black text-[#134467] uppercase tracking-wide">
//                 Service Capabilities
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//               {vehicleTypes.length > 0 && (
//                 <TagBlock
//                   title="Vehicle Types"
//                   icon={<Timer className="w-5 h-5 text-[#48AEDD]" />}
//                   items={vehicleTypes}
//                   scheme="blue"
//                 />
//               )}
//               {whatWeCarry.length > 0 && (
//                 <TagBlock
//                   title="What We Carry"
//                   icon={<Package className="w-5 h-5 text-[#E53935]" />}
//                   items={whatWeCarry}
//                   scheme="red"
//                 />
//               )}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           CONTENT BLOCKS
//       ══════════════════════════════════════════════════ */}
//       {service.contentBlocks?.length > 0 && (
//         <section>
//           <BlockRenderer blocks={service.contentBlocks} />
//         </section>
//       )}

//       {/* ══════════════════════════════════════════════════
//           HOW IT WORKS  (constant across all CMS pages)
//       ══════════════════════════════════════════════════ */}
//       <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

//         <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
//           <div className="text-center mb-14">
//             <span className="inline-block text-xs font-black uppercase tracking-widest bg-[#F5EB18] text-[#134467] px-4 py-1.5 rounded-full mb-4">
//               Trusted UK Courier Network
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-black text-white">
//               How Our Courier Network Works
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4">
//             {HOW_IT_WORKS.map((item, i) => (
//               <div key={i} className="relative">
//                 {/* connector line between steps */}
//                 {i < HOW_IT_WORKS.length - 1 && (
//                   <div className="hidden lg:block absolute top-7 left-[65%] w-full h-px bg-white/15 z-0" />
//                 )}
//                 <div className="relative z-10 flex flex-col items-center text-center gap-3 group">
//                   <div className="w-14 h-14 rounded-full bg-[#E53935] flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform">
//                     <span className="text-white font-black text-sm">
//                       {item.step}
//                     </span>
//                   </div>
//                   <h3 className="text-white font-bold text-sm leading-snug">
//                     {item.title}
//                   </h3>
//                   <p className="text-white/55 text-xs leading-relaxed">
//                     {item.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           WHY CHOOSE ROUTE46  (constant 6-card set)
//       ══════════════════════════════════════════════════ */}
//       <section className="bg-slate-50 py-20 sm:py-24 border-t border-slate-100">
//         <div className="max-w-6xl mx-auto px-5 sm:px-6">
//           <div className="text-center mb-12">
//             <span className="inline-block text-xs font-black uppercase tracking-widest bg-[#F5EB18] text-[#134467] px-4 py-1.5 rounded-full mb-4">
//               Why Route46
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-black text-[#134467]">
//               Why Choose Route46 Couriers
//             </h2>
//             <p className="mt-3 text-[#134467]/55 text-base max-w-2xl mx-auto leading-relaxed">
//               Fast, secure and professional courier solutions across the UK
//               mainland for urgent documents, parcels, pallets and specialist
//               deliveries.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {WHY_CHOOSE_FEATURES.map((f, i) => (
//               <div
//                 key={i}
//                 className={cn(
//                   "bg-white p-8 rounded-3xl border border-slate-100",
//                   "hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group",
//                   fadeUp,
//                 )}
//                 style={{ animationDelay: `${i * 80}ms` }}
//               >
//                 <div className="w-12 h-12 rounded-2xl bg-[#134467]/5 flex items-center justify-center mb-5 group-hover:bg-[#134467]/10 transition-colors">
//                   <f.icon className="w-6 h-6 text-[#48AEDD]" />
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-2 block">
//                   {f.label}
//                 </span>
//                 <h3 className="font-black text-lg text-[#134467] mb-3 leading-snug">
//                   {f.title}
//                 </h3>
//                 <p className="text-[#134467]/60 text-sm leading-relaxed">
//                   {f.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════════════
//           RELATED SERVICES
//       ══════════════════════════════════════════════════ */}
//       {relatedServices.length > 0 && (
//         <LinksHub
//           eyebrow="Express Delivery Across the UK"
//           title="Same Day Courier Services"
//           subtitle="Explore our specialist courier services designed for urgent deliveries, confidential documents, and time-critical logistics across the UK."
//           items={relatedServices}
//           basePath="/services"
//           navigate={navigate}
//           accent="#48AEDD"
//           bg="bg-white"
//         />
//       )}

//       {/* ══════════════════════════════════════════════════
//           RELATED SECTORS
//       ══════════════════════════════════════════════════ */}
//       {relatedSectors.length > 0 && (
//         <LinksHub
//           eyebrow="Specialist Industry Solutions"
//           title="Industries We Support"
//           subtitle="Our courier services are trusted by businesses across multiple industries requiring reliable and secure transport solutions."
//           items={relatedSectors}
//           basePath="/sectors"
//           navigate={navigate}
//           accent="#E53935"
//           bg="bg-slate-50"
//         />
//       )}

//       {/* ══════════════════════════════════════════════════
//           FEATURED LOCATIONS
//       ══════════════════════════════════════════════════ */}
//       {featuredLocations.length > 0 && (
//         <LinksHub
//           eyebrow="Nationwide Courier Coverage"
//           title="Popular UK Courier Locations"
//           subtitle="Our courier network covers major cities and business hubs across the UK, providing reliable same-day and urgent delivery services."
//           items={featuredLocations}
//           basePath="/locations"
//           navigate={navigate}
//           accent="#134467"
//           bg="bg-white"
//         />
//       )}

//       {/* ══════════════════════════════════════════════════
//           FAQs
//       ══════════════════════════════════════════════════ */}
//       {faqs.length > 0 && (
//         <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-100">
//           <div className="max-w-3xl mx-auto px-5 sm:px-6">
//             <div className="text-center mb-12">
//               <span className="inline-block bg-[#134467]/5 text-[#134467] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#134467]/10 mb-5">
//                 Got Questions?
//               </span>
//               <h2 className="text-3xl sm:text-4xl font-black text-[#134467]">
//                 {service.faqHeading || "Frequently Asked Questions"}
//               </h2>
//               <p className="mt-3 text-[#134467]/50 text-sm">
//                 Everything you need to know about this service.
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
//                   <AccordionTrigger className="px-5 sm:px-6 py-5 text-left font-bold text-[#134467] hover:no-underline text-[15px] sm:text-base group">
//                     <span className="flex items-center gap-3">
//                       <span className="w-6 h-6 rounded-full bg-[#48AEDD]/10 text-[#48AEDD] text-xs font-black flex items-center justify-center flex-shrink-0">
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                       {faq.question}
//                     </span>
//                   </AccordionTrigger>
//                   <AccordionContent className="px-5 sm:px-6 pb-6 pt-4 border-t border-slate-50">
//                     <div
//                       dangerouslySetInnerHTML={{ __html: faq.answer }}
//                       className="prose prose-sm max-w-none
//                         prose-p:text-slate-600 prose-p:leading-relaxed
//                         prose-strong:text-[#134467] prose-strong:font-bold
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
//           FINAL CTA BANNER
//       ══════════════════════════════════════════════════ */}
//       <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

//         <div className="relative z-10 max-w-4xl mx-auto text-center px-5 sm:px-6">
//           {/* Trust strip */}
//           <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
//             {[
//               "Same Day Dispatch",
//               "UK Mainland Coverage",
//               "60 Min Collection",
//               "24/7 Support",
//             ].map((t) => (
//               <span
//                 key={t}
//                 className="flex items-center gap-1.5 text-white/70 text-sm font-medium"
//               >
//                 <CheckCircle2 className="w-4 h-4 text-[#F5EB18] flex-shrink-0" />
//                 {t}
//               </span>
//             ))}
//           </div>

//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
//             Ready to get started?
//           </h2>
//           <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
//             Route46 Couriers provides reliable same-day transport across the UK
//             with professional drivers, secure handling, and real-time delivery
//             updates.
//           </p>
//           <button
//             onClick={() => navigate(service.ctaPrimaryLink || "/quick-quote")}
//             className="inline-flex items-center gap-3 bg-[#E53935] hover:bg-[#c0392b]
//               active:scale-95 text-white font-black uppercase tracking-wide
//               px-10 sm:px-14 py-4 sm:py-5 rounded-2xl text-base sm:text-lg
//               shadow-2xl shadow-red-900/40 transition-all hover:scale-105
//               w-full sm:w-auto justify-center"
//           >
//             {service.ctaPrimaryText || "Get a Quote"}
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

// function HeroChip({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5">
//       <span className="flex-shrink-0">{icon}</span>
//       <span className="text-white font-semibold text-xs sm:text-sm">
//         {label}
//       </span>
//     </div>
//   );
// }

// const TagBlock = ({
//   title,
//   icon,
//   items,
//   scheme,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   items: string[];
//   scheme: "blue" | "red";
// }) => (
//   <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
//     <div className="flex items-center gap-2 mb-5">
//       <div
//         className={cn(
//           "w-8 h-8 rounded-xl flex items-center justify-center",
//           scheme === "blue" ? "bg-blue-50" : "bg-red-50",
//         )}
//       >
//         {icon}
//       </div>
//       <h3 className="font-black text-sm text-[#134467] uppercase tracking-wider">
//         {title}
//       </h3>
//     </div>
//     <div className="flex flex-wrap gap-2">
//       {items.map((item, i) => (
//         <span
//           key={`${item}-${i}`}
//           className={cn(
//             "px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border",
//             scheme === "red"
//               ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100 transition-colors"
//               : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 transition-colors",
//           )}
//         >
//           {item}
//         </span>
//       ))}
//     </div>
//   </div>
// );

// /* ─── Links Hub (Services / Sectors / Locations) ─────────────────────────── */
// const LinksHub = ({
//   eyebrow,
//   title,
//   subtitle,
//   items,
//   basePath,
//   navigate,
//   accent,
//   bg = "bg-white",
// }: {
//   eyebrow: string;
//   title: string;
//   subtitle: string;
//   items: any[];
//   basePath: string;
//   navigate: (to: string) => void;
//   accent: string;
//   bg?: string;
// }) => (
//   <section className={cn("py-16 sm:py-20 border-t border-slate-100", bg)}>
//     <div className="max-w-6xl mx-auto px-5 sm:px-6">
//       {/* Header */}
//       <div className="mb-10 sm:mb-12">
//         <span
//           className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3"
//           style={{ background: `${accent}15`, color: accent }}
//         >
//           {eyebrow}
//         </span>
//         <h2 className="text-2xl sm:text-3xl font-black text-[#134467] mb-2 leading-tight">
//           {title}
//         </h2>
//         <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
//           {subtitle}
//         </p>
//       </div>

//       {/* Cards grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
//         {items.map((item: any, i: number) => {
//           const itemSlug = typeof item === "string" ? item : item.slug;
//           const name =
//             typeof item === "string" ? item.replace(/-/g, " ") : item.name;
//           return (
//             <div
//               key={`${itemSlug}-${i}`}
//               onClick={() => navigate(`${basePath}/${itemSlug}`)}
//               className="group cursor-pointer bg-white border border-slate-100
//                 p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200
//                 flex items-center justify-between"
//               style={{ borderLeft: `4px solid ${accent}` }}
//             >
//               <span className="capitalize font-bold text-[#134467] text-sm group-hover:text-[#E53935] transition-colors leading-snug">
//                 {name}
//               </span>
//               <ChevronRight
//                 className="w-4 h-4 flex-shrink-0 ml-3 transition-all group-hover:translate-x-1"
//                 style={{ color: accent }}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </section>
// );
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ChevronRight,
  Clock,
  Zap,
  Map,
  Timer,
  MapPin,
  Network,
  CheckCircle2,
  Truck,
  Building2,
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

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANT — 6 Why-Choose cards
───────────────────────────────────────────────────────────────────────────── */
const WHY_CHOOSE_FEATURES = [
  {
    icon: Clock,
    label: "Available 24/7",
    title: "24/7 Courier Support",
    description:
      "Our courier operations run 24 hours a day, 7 days a week to handle urgent deliveries whenever they arise. Whether you need late-night document transport or early morning collections, our dedicated courier network is always ready to respond.",
  },
  {
    icon: Zap,
    label: "Same Day Transport",
    title: "Same Day Courier Delivery",
    description:
      "Route46 Couriers provides reliable same day courier services across the UK. Our dedicated drivers collect your shipment and transport it directly to the destination without unnecessary stops or hub delays.",
  },
  {
    icon: Map,
    label: "Nationwide Coverage",
    title: "Across the UK Mainland",
    description:
      "Our courier network covers cities, towns, and business districts across the UK mainland. From London and Birmingham to Cardiff, Manchester, and beyond, we ensure dependable transport wherever your delivery needs to go.",
  },
  {
    icon: Timer,
    label: "Rapid Dispatch",
    title: "Collection Within 60 Minutes",
    description:
      "For urgent deliveries, our courier drivers can often collect shipments within 60 minutes depending on location and availability. This rapid response ensures time-sensitive documents, parcels, or goods move immediately.",
  },
  {
    icon: MapPin,
    label: "Real-Time Visibility",
    title: "Live GPS Delivery Tracking",
    description:
      "Every delivery is supported by real-time tracking and delivery confirmation. Our system provides visibility from collection to delivery, ensuring transparency and confidence for both businesses and individual customers.",
  },
  {
    icon: Network,
    label: "Specialist Deliveries",
    title: "Industries & Courier Services",
    description:
      "Route46 Couriers supports a wide range of industries including legal, medical, corporate, aviation, and e-commerce. From passport deliveries and legal documents to urgent parcels and specialist freight, our services are designed to meet diverse business needs.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANT — How It Works steps
───────────────────────────────────────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Request a Quote",
    desc: "Submit pickup and delivery details online.",
  },
  {
    step: "02",
    title: "Courier Assigned",
    desc: "A professional driver is dispatched quickly.",
  },
  {
    step: "03",
    title: "Collection",
    desc: "Goods or documents are collected securely.",
  },
  {
    step: "04",
    title: "Direct Delivery",
    desc: "Items are transported directly to the destination.",
  },
  {
    step: "05",
    title: "Confirmation",
    desc: "Delivery confirmation and proof of delivery provided.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
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

  /* ── Fetch FAQs ── */
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
          </div>
          <p className="text-[#134467]/50 text-sm font-semibold tracking-widest uppercase">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (!service || service.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-5 text-center antialiased">
        <div className="w-24 h-24 rounded-full bg-[#48AEDD]/10 flex items-center justify-center">
          <span className="text-4xl font-black text-[#48AEDD] tracking-tight">
            404
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#134467] tracking-tight">
            Service Not Found
          </h1>
          <p className="text-[#134467]/50 mt-2 font-medium text-sm">
            This service doesn't exist or may have been removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 bg-[#134467] text-white px-6 py-3 rounded-xl font-black text-sm tracking-wide hover:bg-[#134467]/90 transition"
        >
          <ArrowLeft size={16} /> Back to Services
        </button>
      </div>
    );
  }

  const heroImage =
    !imgError && service.heroImage ? service.heroImage : "/route462.jpeg";
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
  const relatedServices: any[] = service.relatedServices || [];

  return (
    <div className="min-h-screen bg-white selection:bg-[#E53935] selection:text-white antialiased">
      {/* ══════════════════════════════════════════════════
          SEO
      ══════════════════════════════════════════════════ */}
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
              name: "Route46",
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
          alt={service.heroTitle || service.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d47] via-[#0d2d47]/65 to-[#0d2d47]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2d47]/85 via-[#0d2d47]/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/services")}
          className="absolute top-20 left-4 sm:left-6 z-20 flex items-center gap-2
            text-white/90 hover:text-[#F5EB18] text-sm font-bold tracking-wide
            bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full
            border border-white/20 transition-all hover:bg-white/20"
        >
          <ArrowLeft size={15} />
          <span>All Services</span>
        </button>

        {/* Hero content */}
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
            {service.heroTitle || service.name}
          </h1>

          {service.heroSubtitle && (
            <p
              className={cn(
                "text-base sm:text-lg text-white/75 max-w-2xl mb-8 leading-[1.85] font-medium",
                fadeUp,
              )}
            >
              {service.heroSubtitle}
            </p>
          )}

          <div className={cn("flex flex-wrap gap-2 sm:gap-3 mb-9", fadeUp)}>
            <HeroChip
              icon={<Timer className="w-4 h-4 text-[#F5EB18]" />}
              label="60 Min Collection"
            />
            <HeroChip
              icon={<Map className="w-4 h-4 text-[#48AEDD]" />}
              label="UK Mainland Coverage"
            />
            <HeroChip
              icon={<Zap className="w-4 h-4 text-[#E53935]" />}
              label="Same Day Delivery"
            />
          </div>

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
      {service.intro && (
        <section className="max-w-3xl mx-auto py-16 sm:py-20 px-5 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-[#E53935] to-[#48AEDD]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#48AEDD]">
              About This Service
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: service.intro }}
            className="text-lg sm:text-xl text-[#134467]/80 leading-[1.85]
              prose prose-lg max-w-none
              prose-p:text-[#134467]/75 prose-p:leading-[1.85] prose-p:font-medium
              prose-strong:text-[#134467] prose-strong:font-black
              prose-a:text-[#E53935] prose-a:no-underline hover:prose-a:underline"
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          VEHICLE TYPES & WHAT WE CARRY
      ══════════════════════════════════════════════════ */}
      {(vehicleTypes.length > 0 || whatWeCarry.length > 0) && (
        <section className="py-14 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50/30 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 rounded-full bg-[#48AEDD]" />
              <h2 className="text-xl font-black text-[#134467] uppercase tracking-[0.12em]">
                Service Capabilities
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {vehicleTypes.length > 0 && (
                <TagBlock
                  title="Vehicle Types"
                  icon={<Timer className="w-5 h-5 text-[#48AEDD]" />}
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
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          CONTENT BLOCKS
      ══════════════════════════════════════════════════ */}
      {service.contentBlocks?.length > 0 && (
        <section>
          <BlockRenderer blocks={service.contentBlocks} />
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#134467] py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-4 shadow-sm">
              Trusted UK Courier Network
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              How Our Courier Network Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative group">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[65%] w-full h-px bg-gradient-to-r from-white/25 to-transparent z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#E53935] flex items-center justify-center shadow-xl shadow-red-900/40 group-hover:scale-110 group-hover:bg-[#c0392b] transition-all duration-300">
                    <span className="text-white font-black text-sm tracking-wide">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-sm leading-snug tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY CHOOSE ROUTE46
      ══════════════════════════════════════════════════ */}
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
              Fast, secure and professional courier solutions across the UK
              mainland for urgent documents, parcels, pallets and specialist
              deliveries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_FEATURES.map((f, i) => (
              <div
                key={i}
                className={cn(
                  "bg-white p-8 rounded-3xl border border-slate-100",
                  "hover:shadow-2xl hover:-translate-y-2 hover:border-[#48AEDD]/25 transition-all duration-300 group",
                  fadeUp,
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#134467]/5 to-[#48AEDD]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6 text-[#48AEDD]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E53935] mb-2.5 block">
                  {f.label}
                </span>
                <h3 className="font-black text-[17px] text-[#134467] mb-3 leading-snug tracking-tight group-hover:text-[#E53935] transition-colors duration-200">
                  {f.title}
                </h3>
                <p className="text-[#134467]/58 text-[13.5px] leading-[1.85] font-medium">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RELATED SERVICES
      ══════════════════════════════════════════════════ */}
      {relatedServices.length > 0 && (
        <CardsHub
          eyebrow="Express Delivery Across the UK"
          title="Same Day Courier Services"
          subtitle="Explore our specialist courier services designed for urgent deliveries, confidential documents, and time-critical logistics across the UK."
          items={relatedServices}
          basePath="/services"
          navigate={navigate}
          accentColor="#48AEDD"
          badgeLabel="Courier Service"
          FallbackIcon={Truck}
          fallbackGradient="from-[#134467] via-[#1a5280] to-[#48AEDD]"
          bg="bg-white"
          entityType="service"
        />
      )}

      {/* ══════════════════════════════════════════════════
          RELATED SECTORS
      ══════════════════════════════════════════════════ */}
      {relatedSectors.length > 0 && (
        <CardsHub
          eyebrow="Specialist Industry Solutions"
          title="Industries We Support"
          subtitle="Our courier services are trusted by businesses across multiple industries requiring reliable and secure transport solutions."
          items={relatedSectors}
          basePath="/sectors"
          navigate={navigate}
          accentColor="#E53935"
          badgeLabel="Industry Sector"
          FallbackIcon={Building2}
          fallbackGradient="from-[#E53935] via-[#c0392b] to-[#8b1a1a]"
          bg="bg-slate-50"
          entityType="sector"
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
          bg="bg-white"
          entityType="location"
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
                {service.faqHeading || "Frequently Asked Questions"}
              </h2>
              <p className="mt-3 text-[#134467]/50 text-sm font-medium">
                Everything you need to know about this service.
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

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Need a Same Day Courier Delivery?
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-[1.85] font-medium">
            Route46 Couriers provides reliable same-day transport across the UK
            with professional drivers, secure handling, and real-time delivery
            updates.
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
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-5">
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center",
          scheme === "blue" ? "bg-blue-50" : "bg-red-50",
        )}
      >
        {icon}
      </div>
      <h3 className="font-black text-sm text-[#134467] uppercase tracking-[0.12em]">
        {title}
      </h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={cn(
            "px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-colors",
            scheme === "red"
              ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
              : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

/* ─── CardItem — fetches full data if no inline image ───────────────────── */
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

  /* Fetch full record when the related item has no image inline */
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
      {/* ── Image / Placeholder ── */}
      <div className="relative rounded-xl overflow-hidden h-48">
        {fetching && !image ? (
          /* Skeleton shimmer while fetching */
          <div className="w-full h-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
        ) : image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            onError={() => setCardImgError(true)}
          />
        ) : (
          /* Branded placeholder */
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

      {/* ── Text content ── */}
      <div className="px-2 pt-4 pb-2">
        {/* Name row */}
        <div className="flex items-center gap-2 mb-1.5">
          <FallbackIcon
            className="w-[18px] h-[18px] flex-shrink-0"
            style={{ color: accentColor }}
          />
          <h3
            className="font-black text-[15px] text-[#134467] leading-snug tracking-tight capitalize
            group-hover:text-[#E53935] transition-colors duration-200"
          >
            {name}
          </h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[#134467]/55 text-[13px] font-medium leading-[1.7] line-clamp-2 mt-1 mb-3">
            {description}
          </p>
        )}

        {/* CTA row */}
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

/* ─── CardsHub ───────────────────────────────────────────────────────────── */
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
      {/* Header */}
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

      {/* Cards grid */}
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
