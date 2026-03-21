// // import React, { useEffect, useState } from "react";
// // import {
// //   ArrowRight,
// //   Truck,
// //   Timer,
// //   CreditCard,
// //   Handshake,
// //   Users,
// //   Search,
// // } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { useNavigate } from "react-router-dom";
// // import { Helmet } from "react-helmet-async";
// // import Footer from "@/components/Footer";

// // const apiUrl = import.meta.env.VITE_API_URL;

// // const fadeInUp =
// //   "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out";

// // export default function ServicesPage() {
// //   const navigate = useNavigate();

// //   const [services, setServices] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");

// //   /* ================= FETCH SERVICES ================= */

// //   useEffect(() => {
// //     async function loadServices() {
// //       try {
// //         const res = await fetch(`${apiUrl}/api/services`);
// //         const json = await res.json();
// //         const data = json.data || json;

// //         const sorted = [...data]
// //           .filter((s) => s.status === "published")
// //           .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

// //         setServices(sorted);
// //       } catch (err) {
// //         console.error("Services fetch error:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadServices();
// //   }, []);

// //   const filteredServices = services.filter((s) =>
// //     search
// //       ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
// //         s.seoDescription?.toLowerCase().includes(search.toLowerCase()) ||
// //         s.heroSubtitle?.toLowerCase().includes(search.toLowerCase())
// //       : true,
// //   );

// //   /* ================= FEATURES ================= */

// //   const features = [
// //     {
// //       icon: Truck,
// //       title: "Nationwide Reach",
// //       description:
// //         "Next day delivery across the UK wherever your customers are.",
// //     },
// //     {
// //       icon: Timer,
// //       title: "Book in Minutes",
// //       description: "Online booking lets you quote, book and track instantly.",
// //     },
// //     {
// //       icon: CreditCard,
// //       title: "Cost Effective",
// //       description:
// //         "Flexible delivery options designed to reduce logistics cost.",
// //     },
// //     {
// //       icon: Handshake,
// //       title: "Flexible Solutions",
// //       description: "Custom delivery solutions tailored to your deadlines.",
// //     },
// //     {
// //       icon: Users,
// //       title: "Dedicated Team",
// //       description: "24/7 logistics support whenever you need help.",
// //     },
// //   ];

// //   /* ================= LOADING ================= */

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <div className="w-10 h-10 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin" />
// //           <p className="text-[#134467]/60 text-sm font-medium">
// //             Loading services…
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ================= UI ================= */

// //   return (
// //     <div className="min-h-screen bg-white font-sans">
// //       {/* SEO */}
// //       <Helmet>
// //         <title>Our Services | Route46®</title>
// //         <meta
// //           name="description"
// //           content="Explore Route46® courier services — same day, next day, nationwide and more."
// //         />
// //         <link rel="canonical" href="https://couriers.foursix46.com/services" />
// //         <meta property="og:title" content="Our Services | Route46®" />
// //         <meta
// //           property="og:description"
// //           content="Explore Route46® courier services — same day, next day, nationwide and more."
// //         />
// //         <meta
// //           property="og:url"
// //           content="https://couriers.foursix46.com/services"
// //         />
// //         <meta property="og:type" content="website" />
// //         <meta
// //           property="og:image"
// //           content="https://couriers.foursix46.com/og-default.jpg"
// //         />
// //         <script type="application/ld+json">
// //           {JSON.stringify({
// //             "@context": "https://schema.org",
// //             "@type": "BreadcrumbList",
// //             itemListElement: [
// //               {
// //                 "@type": "ListItem",
// //                 position: 1,
// //                 name: "Home",
// //                 item: "https://couriers.foursix46.com",
// //               },
// //               {
// //                 "@type": "ListItem",
// //                 position: 2,
// //                 name: "Our Services",
// //                 item: "https://couriers.foursix46.com/services",
// //               },
// //             ],
// //           })}
// //         </script>
// //       </Helmet>

// //       {/* HERO */}
// //       <section className="pt-24 pb-16 text-center">
// //         <h1 className="text-6xl font-extrabold text-[#48AEDD]">
// //           Our <span className="text-[#E53935]">Services</span>
// //         </h1>
// //         <p className="mt-6 text-lg text-[#134467]/80 max-w-3xl mx-auto">
// //           Comprehensive courier solutions designed to meet all delivery needs.
// //         </p>
// //       </section>

// //       {/* SEARCH */}
// //       <section className="container mx-auto px-6 pb-8 max-w-xl">
// //         <div className="relative">
// //           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //           <input
// //             type="text"
// //             placeholder="Search services..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50
// //               focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/40 text-sm"
// //           />
// //         </div>
// //       </section>

// //       {/* SERVICES LIST */}
// //       <section className="container mx-auto px-6 pb-24">
// //         <div className="max-w-6xl mx-auto grid gap-8">
// //           {filteredServices.length === 0 && (
// //             <div className="text-center text-gray-500 py-16">
// //               {search
// //                 ? `No services found for "${search}"`
// //                 : "No services available"}
// //             </div>
// //           )}

// //           {filteredServices.map((service, index) => (
// //             <div
// //               key={service.slug}
// //               onClick={() => navigate(`/services/${service.slug}`)}
// //               className={cn(
// //                 "cursor-pointer bg-white border rounded-[2rem] p-10",
// //                 "hover:shadow-xl transition group",
// //                 fadeInUp,
// //               )}
// //               style={{ animationDelay: `${index * 100}ms` }}
// //             >
// //               <h2 className="text-3xl font-bold text-[#134467] flex items-center gap-3 group-hover:text-[#E53935]">
// //                 {service.name}
// //                 <ArrowRight className="text-[#E53935]" />
// //               </h2>

// //               <p className="mt-4 text-[#134467]/80 text-lg">
// //                 {service.heroSubtitle ||
// //                   service.seoDescription ||
// //                   "Click to view service details"}
// //               </p>

// //               {/* ✅ Operational badges removed — serviceCoverage & collectionTimePromise
// //                   fields are no longer part of the service schema */}
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* CTA */}
// //       <section className="text-center pb-24">
// //         <button
// //           onClick={() => navigate("/quick-quote")}
// //           className="bg-[#E53935] text-white px-10 py-5 rounded-full font-bold text-xl
// //             hover:bg-[#c0392b] active:scale-95 transition-all hover:scale-105
// //             shadow-xl shadow-red-900/30"
// //         >
// //           Book a Delivery Now
// //         </button>
// //       </section>

// //       {/* FEATURES */}
// //       <section className="container mx-auto px-6 pb-20">
// //         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {features.map((f, i) => (
// //             <div
// //               key={i}
// //               className={cn(
// //                 "bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition",
// //                 fadeInUp,
// //               )}
// //             >
// //               <f.icon className="w-8 h-8 text-[#48AEDD] mb-4" />
// //               <h3 className="font-bold text-xl mb-2">{f.title}</h3>
// //               <p className="text-[#134467]/80">{f.description}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       <Footer />
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   Clock,
//   Zap,
//   Map,
//   Timer,
//   MapPin,
//   Network,
//   Search,
//   BookOpen,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import Footer from "@/components/Footer";

// const apiUrl = import.meta.env.VITE_API_URL;
// const fadeInUp =
//   "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out";

// /* ─────────────────────────────────────────────────────────────
//    CONSTANT — 6 Why-Choose cards (same on ALL 4 CMS pages)
// ───────────────────────────────────────────────────────────── */
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

// /* ─────────────────────────────────────────────────────────────
//    CONSTANT — How It Works steps (same on ALL 4 CMS pages)
// ───────────────────────────────────────────────────────────── */
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

// export default function ServicesPage() {
//   const navigate = useNavigate();
//   const [services, setServices] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     async function loadServices() {
//       try {
//         const res = await fetch(`${apiUrl}/api/services`);
//         const json = await res.json();
//         const data = json.data || json;
//         setServices(
//           [...data]
//             .filter((s) => s.status === "published")
//             .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
//         );
//       } catch (err) {
//         console.error("Services fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadServices();
//   }, []);

//   const filteredServices = services.filter((s) =>
//     search
//       ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
//         s.seoDescription?.toLowerCase().includes(search.toLowerCase()) ||
//         s.heroSubtitle?.toLowerCase().includes(search.toLowerCase())
//       : true,
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative w-14 h-14">
//             <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
//             <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
//           </div>
//           <p className="text-[#134467]/60 text-sm font-medium">
//             Loading services…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-sans">
//       {/* ── SEO ─────────────────────────────────────────────────────────────── */}
//       <Helmet>
//         <title>Our Services | Route46®</title>
//         <meta
//           name="description"
//           content="Explore Route46® courier services — same day, next day, nationwide and more."
//         />
//         <link rel="canonical" href="https://couriers.foursix46.com/services" />
//         <meta property="og:title" content="Our Services | Route46®" />
//         <meta
//           property="og:description"
//           content="Explore Route46® courier services — same day, next day, nationwide and more."
//         />
//         <meta
//           property="og:url"
//           content="https://couriers.foursix46.com/services"
//         />
//         <meta property="og:type" content="website" />
//         <meta
//           property="og:image"
//           content="https://couriers.foursix46.com/og-default.jpg"
//         />
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
//             ],
//           })}
//         </script>
//       </Helmet>

//       {/* ── HERO ────────────────────────────────────────────────────────────── */}
//       <section className="relative pt-20 pb-20 text-center overflow-hidden bg-white">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/4" />
//         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/4" />
//         <div className="max-w-4xl mx-auto px-6">
//           {/* Eyebrow */}
//           <span className="inline-block text-xs font-black uppercase tracking-widest text-[#134467] bg-[#F5EB18] px-4 py-1.5 rounded-full mb-5">
//             Express Delivery Across the UK
//           </span>
//           <h1 className="text-5xl md:text-6xl font-extrabold text-[#48AEDD] leading-tight">
//             Our <span className="text-[#E53935]">Services</span>
//           </h1>
//           <p className="mt-5 text-lg text-[#134467]/70 max-w-2xl mx-auto leading-relaxed">
//             Explore our specialist courier services designed for urgent
//             deliveries, confidential documents, and time-critical logistics
//             across the UK.
//           </p>
//         </div>
//       </section>

//       {/* ── SEARCH ──────────────────────────────────────────────────────────── */}
//       <section className="container mx-auto px-6 pb-8 max-w-xl">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search services..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50
//               focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/40 text-sm"
//           />
//         </div>
//       </section>

//       {/* ── SERVICES LIST ───────────────────────────────────────────────────── */}
//       <section className="container mx-auto px-6 pb-20">
//         <div className="max-w-6xl mx-auto grid gap-6">
//           {filteredServices.length === 0 && (
//             <div className="text-center text-gray-500 py-16">
//               {search
//                 ? `No services found for "${search}"`
//                 : "No services available"}
//             </div>
//           )}

//           {filteredServices.map((service, index) => (
//             <div
//               key={service.slug}
//               onClick={() => navigate(`/services/${service.slug}`)}
//               className={cn(
//                 "cursor-pointer bg-white border border-slate-100 rounded-[2rem] overflow-hidden",
//                 "hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group",
//                 fadeInUp,
//               )}
//               style={{ animationDelay: `${index * 80}ms` }}
//             >
//               <div className="grid md:grid-cols-[2fr_3fr] items-stretch">
//                 {/* ── Service Image ── */}
//                 <div className="relative h-52 md:h-auto bg-slate-100 overflow-hidden">
//                   {service.heroImage || service.featuredImage ? (
//                     <img
//                       src={service.heroImage || service.featuredImage}
//                       alt={service.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "/FourSix_truckimage.jpg";
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-[#134467] to-[#48AEDD] flex items-center justify-center">
//                       <BookOpen className="w-12 h-12 text-white/20" />
//                     </div>
//                   )}
//                   {/* Overlay gradient for mobile */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:hidden" />
//                 </div>

//                 {/* ── Content ── */}
//                 <div className="p-8 md:p-10 flex flex-col justify-center">
//                   {/* Badge */}
//                   <span className="inline-block w-fit text-[10px] font-black uppercase tracking-widest text-[#134467] bg-[#F5EB18] px-3 py-1 rounded-full mb-4">
//                     Courier Service
//                   </span>

//                   <h2 className="text-2xl md:text-3xl font-bold text-[#134467] group-hover:text-[#E53935] transition-colors flex items-center gap-3">
//                     {service.name}
//                     <ArrowRight className="text-[#E53935] w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
//                   </h2>

//                   <p className="mt-3 text-[#134467]/70 text-base leading-relaxed line-clamp-3">
//                     {service.heroSubtitle ||
//                       service.seoDescription ||
//                       "Click to view service details"}
//                   </p>

//                   {/* Static chips */}
//                   <div className="flex flex-wrap gap-2 mt-5">
//                     {[
//                       { icon: Timer, label: "60 Min Collection" },
//                       { icon: Map, label: "UK Mainland" },
//                       { icon: Zap, label: "Same Day" },
//                     ].map(({ icon: Icon, label }) => (
//                       <span
//                         key={label}
//                         className="flex items-center gap-1.5 text-xs font-semibold text-[#134467]
//                           bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full"
//                       >
//                         <Icon className="w-3.5 h-3.5 text-[#48AEDD]" />
//                         {label}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
//       <section className="bg-[#134467] py-20 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative z-10 max-w-6xl mx-auto px-6">
//           <div className="text-center mb-14">
//             <span className="inline-block text-xs font-black uppercase tracking-widest bg-[#F5EB18] text-[#134467] px-4 py-1.5 rounded-full mb-4">
//               Trusted UK Courier Network
//             </span>
//             <h2 className="text-3xl md:text-4xl font-black text-white">
//               How Our Courier Network Works
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//             {HOW_IT_WORKS.map((item, i) => (
//               <div key={i} className="relative">
//                 {/* Connector line */}
//                 {i < HOW_IT_WORKS.length - 1 && (
//                   <div className="hidden lg:block absolute top-7 left-[60%] w-full h-px bg-white/20 z-0" />
//                 )}
//                 <div className="relative z-10 flex flex-col items-center text-center gap-3">
//                   <div className="w-14 h-14 rounded-full bg-[#E53935] flex items-center justify-center shadow-lg shadow-red-900/30">
//                     <span className="text-white font-black text-sm">
//                       {item.step}
//                     </span>
//                   </div>
//                   <h3 className="text-white font-bold text-sm">{item.title}</h3>
//                   <p className="text-white/60 text-xs leading-relaxed">
//                     {item.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ─────────────────────────────────────────────────────────────── */}
//       <section className="text-center py-20 bg-white">
//         <p className="text-sm font-semibold text-[#134467]/50 uppercase tracking-widest mb-4">
//           Route46 Couriers provides reliable same-day transport across the UK
//           with professional drivers, secure handling, and real-time delivery
//           updates.
//         </p>
//         <button
//           onClick={() => navigate("/quick-quote")}
//           className="bg-[#E53935] text-white px-10 py-5 rounded-full font-bold text-xl
//             hover:bg-[#c0392b] active:scale-95 transition-all hover:scale-105
//             shadow-xl shadow-red-900/30"
//         >
//           Book a Delivery Now
//         </button>
//       </section>

//       {/* ── WHY CHOOSE (6 cards) ────────────────────────────────────────────── */}
//       <section className="bg-slate-50 py-20 border-t border-slate-100">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="text-center mb-12">
//             <span className="inline-block text-xs font-black uppercase tracking-widest bg-[#F5EB18] text-[#134467] px-4 py-1.5 rounded-full mb-4">
//               Why Route46
//             </span>
//             <h2 className="text-3xl md:text-4xl font-black text-[#134467]">
//               Why Choose Route46 Couriers
//             </h2>
//             <p className="mt-3 text-[#134467]/60 text-base max-w-2xl mx-auto">
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
//                   "bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
//                   fadeInUp,
//                 )}
//                 style={{ animationDelay: `${i * 80}ms` }}
//               >
//                 <div className="w-12 h-12 rounded-2xl bg-[#134467]/5 flex items-center justify-center mb-5">
//                   <f.icon className="w-6 h-6 text-[#48AEDD]" />
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-widest text-[#E53935] mb-2 block">
//                   {f.label}
//                 </span>
//                 <h3 className="font-black text-lg text-[#134467] mb-3">
//                   {f.title}
//                 </h3>
//                 <p className="text-[#134467]/65 text-sm leading-relaxed">
//                   {f.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  Zap,
  Map,
  Timer,
  MapPin,
  Network,
  Search,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";

const apiUrl = import.meta.env.VITE_API_URL;
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out";

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

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${apiUrl}/api/services`);
        const json = await res.json();
        const data = json.data || json;
        setServices(
          [...data]
            .filter((s) => s.status === "published")
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        );
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
          </div>
          <p className="text-[#134467]/50 text-sm font-semibold tracking-widest uppercase">
            Loading services…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ── SEO ─────────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Our Services | Route46</title>
        <meta
          name="description"
          content="Explore Route46 courier services — same day, next day, nationwide and more."
        />
        <link rel="canonical" href="https://couriers.foursix46.com/services" />
        <meta property="og:title" content="Our Services | Route46" />
        <meta
          property="og:description"
          content="Explore Route46 courier services — same day, next day, nationwide and more."
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

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-24 text-center overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/6 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-[#134467] bg-[#F5EB18] px-5 py-2 rounded-full mb-7 shadow-sm">
            Express Delivery Across the UK
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#48AEDD] leading-[1.06] tracking-tight mb-6">
            Our{" "}
            <span className="relative inline-block text-[#E53935]">
              Services
              <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#F5EB18] rounded-full" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#134467]/65 max-w-2xl mx-auto leading-[1.85] font-medium">
            Explore our specialist courier services designed for urgent
            deliveries, confidential documents, and time-critical logistics
            across the UK.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SEARCH
      ══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 pb-10 max-w-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/80
              focus:outline-none focus:ring-2 focus:ring-[#48AEDD]/35 focus:border-[#48AEDD]/50
              text-sm font-medium text-[#134467] placeholder:text-slate-400 transition-all shadow-sm"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SERVICES LIST
      ══════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto grid gap-7">
          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto text-slate-200 mb-4" />
              <p className="text-[#134467]/40 font-semibold text-lg tracking-wide">
                {search
                  ? `No services found for "${search}"`
                  : "No services available"}
              </p>
            </div>
          )}

          {filteredServices.map((service, index) => (
            <div
              key={service.slug}
              onClick={() => navigate(`/services/${service.slug}`)}
              className={cn(
                "cursor-pointer bg-white border border-slate-100/80 rounded-[2rem] overflow-hidden",
                "hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#48AEDD]/30 transition-all duration-300 group",
                fadeInUp,
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="grid md:grid-cols-[5fr_8fr] items-stretch">
                {/* ── Image ── */}
                <div className="relative h-56 md:h-auto bg-slate-100 overflow-hidden min-h-[200px]">
                  {service.heroImage || service.featuredImage ? (
                    <img
                      src={service.heroImage || service.featuredImage}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/route462.jpeg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#134467] via-[#1a5280] to-[#48AEDD] flex items-center justify-center">
                      <BookOpen className="w-14 h-14 text-white/15" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 md:hidden" />
                </div>

                {/* ── Content ── */}
                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-4">
                  <span className="inline-block w-fit text-[10px] font-black uppercase tracking-[0.18em] text-[#134467] bg-[#F5EB18] px-3.5 py-1.5 rounded-full shadow-sm">
                    Courier Service
                  </span>

                  <h2 className="text-2xl md:text-3xl font-black text-[#134467] group-hover:text-[#E53935] transition-colors duration-200 flex items-center gap-3 leading-tight tracking-tight">
                    {service.name}
                    <ArrowRight className="text-[#E53935] w-5 h-5 flex-shrink-0 group-hover:translate-x-2 transition-transform duration-300" />
                  </h2>

                  <p className="text-[#134467]/60 text-[15px] leading-[1.85] font-medium line-clamp-3">
                    {service.heroSubtitle ||
                      service.seoDescription ||
                      "Click to view full service details and get an instant quote."}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { icon: Timer, label: "60 Min Collection" },
                      { icon: Map, label: "UK Mainland" },
                      { icon: Zap, label: "Same Day" },
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#134467]
                          bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full
                          group-hover:border-[#48AEDD]/40 group-hover:bg-[#48AEDD]/5 transition-colors duration-200"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#48AEDD]" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#134467] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-5 shadow-sm">
              Trusted UK Courier Network
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              How Our Courier Network Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
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

      {/* ══════════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#48AEDD08_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#134467]/40 mb-3">
            Route46 Couriers
          </p>
          <p className="text-[#134467]/55 text-base font-medium leading-[1.8] mb-8">
            Route46 Couriers provides reliable same-day transport across the UK
            with professional drivers, secure handling, and real-time delivery
            updates.
          </p>
          <button
            onClick={() => navigate("/quick-quote")}
            className="inline-flex items-center gap-3 bg-[#E53935] text-white
              px-12 py-5 rounded-full font-black text-lg uppercase tracking-wide
              hover:bg-[#c0392b] active:scale-95 transition-all hover:scale-105
              shadow-2xl shadow-red-900/30"
          >
            Book a Delivery Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY CHOOSE ROUTE46 — 6 cards
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50/80 py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#F5EB18] text-[#134467] px-5 py-2 rounded-full mb-5 shadow-sm">
              Why Route46
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#134467] tracking-tight leading-tight mb-4">
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
                  fadeInUp,
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

      <Footer />
    </div>
  );
}
