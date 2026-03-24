// import React, { useEffect, useState } from "react";
// import {
//   Shield,
//   Users,
//   TrendingUp,
//   Zap,
//   Globe,
//   PawPrint,
//   Quote,
//   Target,
//   Layers,
//   Truck,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Footer from "@/components/Footer";

// // Animation utility class
// const fadeInUp =
//   "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards";

// // Typing animation component for highlighted left text
// function TypingHighlight({ text, speed = 80 }) {
//   const [displayed, setDisplayed] = useState("");
//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setDisplayed((prev) => prev + text.charAt(index));
//       index++;
//       if (index >= text.length) clearInterval(interval);
//     }, speed);
//     return () => clearInterval(interval);
//   }, [text, speed]);
//   const isTypingComplete = displayed.length === text.length;
//   return (
//     <span className="font-extrabold text-4xl text-[#E53935] whitespace-pre-wrap max-w-md">
//       {displayed}
//       {!isTypingComplete && <span className="animate-blink">|</span>}
//       <style>{`
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0; }
//         }
//         .animate-blink {
//           animation: blink 1s step-start 0s infinite;
//         }
//       `}</style>
//     </span>
//   );
// }

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white overflow-x-hidden font-sans">
//       {/* --- HERO SECTION --- */}
//       <div className="relative py-20 sm:py-24 overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#48AEDD]/10 rounded-full blur-3xl -z-10" />
//         <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
//           <span
//             className={cn(
//               "inline-block py-1 px-4 rounded-full bg-[#E53935]/10 text-[#E53935] font-bold text-sm mb-6 tracking-wider uppercase border border-[#E53935]/20",
//               fadeInUp,
//             )}
//           >
//             One Identity, Infinite Industries
//           </span>
//           <h1
//             className={cn(
//               "text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#48AEDD] mb-8 tracking-tight leading-tight",
//               fadeInUp,
//               "animation-delay-100",
//             )}
//           >
//             About <span className="text-[#E53935]">Route46 Couriers</span>
//           </h1>
//           <p
//             className={cn(
//               "text-lg sm:text-xl text-[#134467]/80 leading-relaxed max-w-2xl mx-auto font-medium",
//               fadeInUp,
//               "animation-delay-200",
//             )}
//           >
//             A nationwide courier network backed by FourSix46® Global Ltd
//           </p>
//         </div>
//       </div>

//       {/* --- MAIN CONTENT CONTAINER --- */}
//       <div className="container mx-auto px-4 sm:px-6 pb-24">
//         <div className="max-w-6xl mx-auto space-y-24">
//           {/* --- FOUNDER & ORIGIN STORY SECTION --- */}
//           <section
//             className={cn(
//               "grid lg:grid-cols-12 gap-12 items-center",
//               fadeInUp,
//               "animation-delay-300",
//             )}
//           >
//             <div className="lg:col-span-5 relative group max-w-xs sm:max-w-sm mx-auto">
//               {/* Decorative background blobs */}
//               <div className="absolute inset-0 bg-[#134467] rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-5" />
//               <div className="absolute -inset-2 bg-gradient-to-tr from-[#E53935] to-[#48AEDD] rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />

//               {/* Image card */}
//               <div className="relative bg-white p-2 rounded-2xl shadow-xl">
//                 <div className="relative overflow-hidden rounded-xl aspect-[4/5] h-100 sm:h-90">
//                   <img
//                     src="/FourSix_Logo.jpeg"
//                     alt="FourSix46 Logo"
//                     className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/90 via-[#134467]/20 to-transparent opacity-80" />
//                   {/* Name/Title removed per your example */}
//                 </div>
//               </div>

//               {/* Number Badge */}
//               <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#E53935] text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white rotate-12 group-hover:rotate-0 transition-transform duration-300 z-20">
//                 46
//               </div>
//             </div>

//             <div className="lg:col-span-7 space-y-6">
//               <div className="inline-flex items-center gap-2 text-[#48AEDD] font-bold tracking-wide uppercase text-sm">
//                 <Quote className="w-5 h-5 fill-current" />
//                 Origin Story
//               </div>
//               <h2 className="text-3xl sm:text-4xl font-bold text-[#134467] leading-tight">
//                 A Mark of <span className="text-[#E53935]">IDENTITY.</span>
//               </h2>
//               <div className="space-y-6 text-lg text-[#134467]/80 leading-relaxed">
//                 <p>
//                   Since 2018, <strong className="text-[#134467]">46</strong> has
//                   been more than just digits — it has been a personal symbol of
//                   meaning, luck, and drive. 46 became part of everyday life, a
//                   mark of IDENTITY.
//                 </p>
//                 <p>
//                   When it was time to step into the world of business, the
//                   vision was clear: build a brand that could stand the test of
//                   time, transcend industries, and carry a global presence.
//                 </p>
//                 <p>
//                   That vision became{" "}
//                   <strong className="text-[#134467]">FourSix46®</strong> — a
//                   name born from numbers, yet built to represent limitless
//                   growth.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* --- ENHANCED HOUSE OF BRANDS & TWITTER SECTION --- */}
//           <section
//             className={cn("grid md:grid-cols-2 gap-10 items-stretch", fadeInUp)}
//           >
//             {/* Left: Highlighted typing animation without card */}
//             <div className="flex flex-col justify-center px-6 md:px-12 py-12">
//               <TypingHighlight
//                 text={'" FourSix46® is more than a company name."'}
//               />
//               <p className="mt-6 text-2xl text-[#134467] font-semibold max-w-md">
//                 A house for multi-industry brands.
//               </p>
//             </div>

//             {/* Right: Tweet image floats, X icon static in top right */}
//             <div className="relative overflow-hidden rounded-3xl group shadow-xl aspect-video md:aspect-auto">
//               {/* Tweet image with float animation */}
//               <a
//                 href="https://x.com/46_d_c"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block w-full h-full"
//               >
//                 <img
//                   src="/tweet.jpeg"
//                   alt="FourSix46® on Social Media"
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-float cursor-pointer"
//                 />
//               </a>
//               {/* Navy blue animated overlay */}
//               <div className="absolute inset-0  opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl animate-pulse-slow pointer-events-none" />
//               {/* Static X image on top right */}
//               <a
//                 href="https://x.com/46_d_c"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="absolute top-6 right-10 w-10 h-10"
//               >
//                 <img
//                   src="/X-Logo.png" // Use your uploaded "X" image filename here
//                   alt="X Twitter Icon"
//                   className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-110 drop-shadow-lg"
//                 />
//               </a>
//               <style>{`
//       @keyframes float {
//         0%, 100% { transform: translateY(0); }
//         50% { transform: translateY(-12px); }
//       }
//       .animate-float {
//         animation: float 4s ease-in-out infinite;
//       }
//       @keyframes pulse-slow {
//         0%, 100% { opacity: 0.45; }
//         50% { opacity: 0.7; }
//       }
//       .animate-pulse-slow {
//         animation: pulse-slow 6s ease-in-out infinite;
//       }
//     `}</style>
//             </div>
//           </section>

//           {/* --- OKAPI IDENTITY SECTION --- */}
//           <section
//             className={cn(
//               "relative bg-[#134467] rounded-[3rem] p-8 sm:p-16 overflow-hidden text-white shadow-2xl shadow-blue-900/20",
//               fadeInUp,
//             )}
//           >
//             <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5EB18] rounded-full blur-[120px] opacity-10" />
//             <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#48AEDD] rounded-full blur-[120px] opacity-10" />
//             <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
//               <div className="p-6 bg-white/10 rounded-3xl shrink-0 backdrop-blur-md border border-white/10">
//                 <PawPrint className="w-16 h-16 text-[#F5EB18]" />
//               </div>
//               <div>
//                 <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
//                   Why the Okapi?
//                 </h2>
//                 <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-3xl">
//                   At the heart of our identity is the okapi - A rare and
//                   majestic animal — A close relative of the giraffe, but often
//                   mistaken for something else due to its zebra-like legs and
//                   solitary nature.
//                 </p>
//                 <div className="pl-6 border-l-4 border-[#F5EB18]">
//                   <p className="font-medium text-white text-xl italic mb-2">
//                     "Just as the okapi stands out in nature, FourSix46® stands
//                     out in business."
//                   </p>
//                   <p className="text-[#F5EB18] font-medium">
//                     It represents our uniqueness and commitment to standing out,
//                     wherever we go.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="max-w-7xl mx-auto px-6 sm:px-0 mt-12">
//             <div className="grid lg:grid-cols-2 gap-16 items-center">
//               {/* Left column: Okapi Image with enhanced styling */}
//               <div className="relative group">
//                 {/* Decorative background gradient */}
//                 <div className="absolute -inset-4 bg-gradient-to-br from-[#48AEDD]/20 via-[#E53935]/10 to-[#F5EB18]/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

//                 {/* Image container */}
//                 <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white group-hover:border-[#48AEDD]/50 transition-all duration-500">
//                   <img
//                     src="/okapi.jpeg"
//                     alt="Okapi - Symbol of FourSix46®"
//                     className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                   {/* Subtle overlay gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 </div>

//                 {/* Floating badge */}
//                 <div className="absolute -bottom-6 -right-6 bg-[#E53935] text-white px-6 py-3 rounded-2xl shadow-xl border-4 border-white transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
//                   <p className="font-bold text-sm uppercase tracking-wider">
//                     Unique & Bold
//                   </p>
//                 </div>
//               </div>

//               {/* Right column: Content with enhanced styling */}
//               <div className="space-y-6">
//                 {/* Title */}
//                 <div className="space-y-4">
//                   <h2 className="text-4xl sm:text-5xl font-extrabold text-[#E53935] leading-tight inline-block cursor-pointer transition-all duration-300 hover:text-[#E53935]/80">
//                     FourSix46®
//                     <span className="text-[#48AEDD]"> Couriers</span>
//                   </h2>
//                   <div className="inline-block">
//                     <p className="text-base font-semibold uppercase tracking-widest text-[#134467] border-b-4 border-[#F5EB18] inline-block pb-2 hover:border-[#48AEDD] transition-colors duration-300 cursor-pointer">
//                       The Courier with a Difference
//                     </p>
//                   </div>
//                 </div>

//                 {/* Main content paragraphs */}
//                 <div className="space-y-5 text-lg text-[#134467]/80 leading-relaxed">
//                   <p className="hover:text-[#E53935]/80 transition-colors duration-300 cursor-pointer">
//                     The first chapter of FourSix46® begins with logistics — one
//                     of the fastest-growing industries in the world. FourSix46
//                     Couriers was launched to bring adaptability, speed, and
//                     reliability into courier services.
//                   </p>

//                   <p className="hover:text-[#48AEDD] transition-colors duration-300 cursor-pointer">
//                     We combine technology, efficiency, and customer-focused
//                     service to ensure every delivery goes beyond expectations.
//                     Whether it's last-mile delivery, e-commerce shipping, or
//                     corporate logistics, we move with purpose.
//                   </p>
//                 </div>

//                 {/* Call-to-action statement */}
//                 <div className="pt-4">
//                   <div className="bg-gradient-to-r from-[#F5EB18]/20 to-transparent px-6 py-4 rounded-2xl border-l-4 border-[#E53935] hover:border-[#48AEDD] transition-all duration-300 group cursor-pointer">
//                     <p className="font-semibold text-[#E53935] transition-colors duration-300">
//                       At FourSix46® Couriers, we don't just deliver packages.
//                     </p>
//                     <p className="font-bold text-xl text-[#48AEDD] mt-1 transition-colors duration-300">
//                       We deliver differently.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Fleet image with new border style and radius */}
//             <div
//               className={cn(
//                 "relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl mx-auto mt-12 group transition-transform duration-500 hover:scale-[1.03]",
//               )}
//               style={{
//                 border: "4px solid #ddd75aff",
//                 borderRadius: "2rem", // ensures the border matches the container’s radius
//               }}
//             >
//               {/* Desktop Image */}
//               <img
//                 src="/Okapi V3 FS46.jpg"
//                 alt="FourSix46 Fleet"
//                 className="hidden sm:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[1rem]"
//               />
//               {/* Mobile Image */}
//               <img
//                 src="/Okapi Mobile FS46 About.jpg"
//                 alt="FourSix46 Fleet"
//                 className="block sm:hidden w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[1rem]"
//               />
//               {/* Subtle overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/50 via-[#D9DA20]/30 to-transparent opacity-45 rounded-[1rem] pointer-events-none" />
//               <div className="absolute bottom-10 left-10">
//                 <Truck className="w-12 h-12 text-[#F5EB18] mb-4 animate-bounce" />
//                 <p className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
//                   Moving With Purpose
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* --- FUTURE STATEMENT --- */}
//           <div className="bg-[#48AEDD]/10 rounded-2xl p-8 sm:p-12 text-center border border-[#48AEDD]/20">
//             <h3 className="text-2xl font-bold text-[#134467] mb-3">
//               Statement
//             </h3>
//             <p className="text-[#134467]/80 text-lg sm:text-xl font-medium max-w-3xl mx-auto">
//               "This is only the beginning. From couriers to logistics, retail,
//               tech, and beyond — the future of FourSix46® is limitless."
//             </p>
//           </div>

//           {/* --- MISSION SECTION --- */}
//           <section className="text-center max-w-4xl mx-auto space-y-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#134467] text-white mb-2 shadow-lg shadow-[#134467]/20">
//               <Target className="w-8 h-8" />
//             </div>
//             <h2 className="text-3xl sm:text-4xl font-bold text-[#134467]">
//               Our Mission
//             </h2>
//             <p className="text-xl text-[#134467]/80 leading-relaxed">
//               At FourSix46® Couriers, our mission is to build a structured and
//               respectful platform that connects drivers and shippers across the
//               UK.
//             </p>
//             <div className="grid sm:grid-cols-2 gap-6 text-left">
//               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//                 <p className="text-[#134467]/80 leading-relaxed">
//                   We aim to create a trusted space where every delivery — from a
//                   single parcel to a full pallet — is handled with transparency,
//                   fairness, and reliability.
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//                 <p className="text-[#134467]/80 leading-relaxed">
//                   Our goal is to empower drivers with consistent work
//                   opportunities and give shippers peace of mind through clear
//                   pricing and dependable same-day service.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* --- VALUES GRID --- */}
//           <section className="space-y-12">
//             <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#134467]">
//               Our Values
//             </h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(229,57,53,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
//                 <div className="w-14 h-14 bg-[#E53935]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E53935] transition-colors relative z-10">
//                   <Shield className="w-7 h-7 text-[#E53935] group-hover:text-white transition-colors" />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
//                   1. Safety First, Always
//                 </h3>
//                 <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
//                   The safety of our drivers, customers, and every parcel we move
//                   is our top priority. We promote responsible driving, secure
//                   handling, and professional standards on every delivery — from
//                   pickup to drop-off.
//                 </p>
//               </div>
//               <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(72,174,221,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#48AEDD]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
//                 <div className="w-14 h-14 bg-[#48AEDD]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#48AEDD] transition-colors relative z-10">
//                   <Users className="w-7 h-7 text-[#48AEDD] group-hover:text-white transition-colors" />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
//                   2. Respect for Every Driver and Shipper
//                 </h3>
//                 <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
//                   We believe everyone deserves respect. Whether you’re booking a
//                   delivery or completing one, you’ll always be treated fairly
//                   and professionally.
//                 </p>
//               </div>
//               <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(245,235,24,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EB18]/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
//                 <div className="w-14 h-14 bg-[#F5EB18]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F5EB18] transition-colors relative z-10">
//                   <TrendingUp className="w-7 h-7 text-[#134467] group-hover:text-[#134467] transition-colors" />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
//                   3. Growth Through Trust
//                 </h3>
//                 <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
//                   We’re here for long-term partnerships, not one-off jobs. We
//                   grow when our users trust us — and we earn that trust through
//                   consistent, honest service.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* --- SIMPLICITY CTA SECTION --- */}
//           <div className="bg-gradient-to-r from-[#48AEDD] to-[#134467] rounded-[3rem] p-10 sm:p-20 text-center text-white relative overflow-hidden">
//             <Globe className="absolute top-10 left-10 w-40 h-40 opacity-10 rotate-12" />
//             <Layers className="absolute bottom-10 right-10 w-32 h-32 opacity-10 -rotate-12 text-[#F5EB18]" />
//             <div className="relative z-10 max-w-3xl mx-auto">
//               <h3 className="text-3xl sm:text-4xl font-bold mb-6">
//                 Simplicity in Every Step
//               </h3>
//               <p className="text-white/90 mb-10 text-xl leading-relaxed">
//                 From booking to delivery, we want to make logistics
//                 straightforward. No complex systems — just a smooth, reliable
//                 platform that works for everyone.
//               </p>
//               <div className="inline-block border-2 border-[#F5EB18] text-[#F5EB18] font-bold py-4 px-10 rounded-full tracking-wide uppercase text-sm hover:bg-[#F5EB18] hover:text-[#134467] transition-colors cursor-default shadow-lg">
//                 FourSix46®
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  Shield,
  Users,
  TrendingUp,
  Globe,
  PawPrint,
  Quote,
  Target,
  Layers,
  Truck,
  Building2,
  CheckCircle2,
  MapPin,
  User,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards";

function TypingHighlight({ text, speed = 80 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  const isTypingComplete = displayed.length === text.length;
  return (
    <span className="font-extrabold text-4xl text-[#E53935] whitespace-pre-wrap max-w-md">
      {displayed}
      {!isTypingComplete && <span className="animate-blink">|</span>}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-start 0s infinite; }
      `}</style>
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white overflow-x-hidden font-sans">
      {/* ── HERO ── */}
      <div className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#48AEDD]/10 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <span
            className={cn(
              "inline-block py-1 px-4 rounded-full bg-[#E53935]/10 text-[#E53935] font-bold text-sm mb-6 tracking-wider uppercase border border-[#E53935]/20",
              fadeInUp,
            )}
          >
            ONE IDENTITY, NATIONWIDE COURIER NETWORK
          </span>
          <h1
            className={cn(
              "text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#48AEDD] mb-6 tracking-tight leading-tight",
              fadeInUp,
              "animation-delay-100",
            )}
          >
            About <span className="text-[#E53935]">Route46 Couriers</span>
          </h1>
          <p
            className={cn(
              "text-lg sm:text-xl text-[#134467]/80 leading-relaxed max-w-2xl mx-auto font-medium mb-8",
              fadeInUp,
              "animation-delay-200",
            )}
          >
            A nationwide courier network backed by FourSix46® Global Ltd
          </p>
          <p
            className={cn(
              "text-base sm:text-lg text-[#134467]/70 leading-relaxed max-w-3xl mx-auto",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            Route46 Couriers is a UK courier service provider offering reliable
            same day and scheduled delivery solutions across the United Kingdom.
            Operating through a nationwide network of professional courier
            drivers and vehicles, Route46 Couriers connects businesses and
            individuals with fast, secure, and dependable logistics solutions.
            Route46 Couriers is a trading brand of{" "}
            <strong className="text-[#134467]">FourSix46® Global Ltd</strong>, a
            UK-registered company focused on building scalable logistics and
            technology ventures.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* ── ABOUT ROUTE46 COURIERS ── */}
          <section className={cn("space-y-8", fadeInUp)}>
            {/* Key Highlights */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">
              <h3 className="text-sm font-black text-[#134467] uppercase tracking-widest mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#48AEDD]" />
                Key Highlights
              </h3>
              <ul className="space-y-3">
                {[
                  "Same day courier services across the UK",
                  "Access to thousands of drivers and vehicles nationwide",
                  "Fast collection windows and reliable delivery timelines",
                  "Professional courier network for businesses and individuals",
                  "Fully insured and industry-compliant transport operations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#48AEDD]/10 text-[#48AEDD] text-xs font-black flex items-center justify-center flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-[#134467]/75 font-medium text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] bg-[#134467]/5 text-[#134467] px-5 py-2 rounded-full border border-[#134467]/10 mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#134467] mb-4">
                How <span className="text-[#E53935]">Route46 Works</span>
              </h2>
              <div className="w-12 h-1 rounded-full bg-[#E53935] mx-auto mb-6" />
              <p className="text-base sm:text-lg text-[#134467]/75 leading-relaxed">
                Route46 Couriers was established to simplify access to
                professional courier services across the UK. Through a modern
                logistics model and access to thousands of independent courier
                drivers and vehicles nationwide, Route46 Couriers enables rapid
                collection, time-critical deliveries, and flexible transport
                solutions for businesses and individuals. Whether it is urgent
                documents, parcels, pallet shipments, or scheduled business
                deliveries, Route46 Couriers ensures that shipments are handled
                by experienced courier professionals operating under recognised
                UK logistics standards.
              </p>
            </div>
          </section>

          {/* ── OUR PARENT COMPANY ── */}
          <section
            className={cn(
              "relative bg-[#134467] rounded-[3rem] p-8 sm:p-16 overflow-hidden text-white shadow-2xl shadow-blue-900/20",
              fadeInUp,
            )}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#48AEDD] rounded-full blur-[120px] opacity-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5EB18] rounded-full blur-[120px] opacity-10" />
            <div className="relative z-10 space-y-6 max-w-4xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                  <Building2 className="w-7 h-7 text-[#F5EB18]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F5EB18]">
                  Parent Company
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Our Parent Company —{" "}
                <span className="text-[#F5EB18]">FourSix46®</span>
              </h2>
              <div className="w-12 h-1 rounded-full bg-[#F5EB18]" />
              <p className="text-white/80 text-lg leading-relaxed">
                Route46 Couriers operates under the umbrella of{" "}
                <strong className="text-white">FourSix46® Global Ltd</strong>, a
                UK-based company focused on developing scalable ventures across
                logistics, technology, and digital platforms. FourSix46®
                represents a long-term brand ecosystem designed to support
                multiple industries through innovation, reliability, and
                structured operational standards.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                As the parent company, FourSix46® provides the strategic
                foundation, operational systems, and long-term vision behind
                Route46 Couriers and other future ventures.
              </p>
            </div>
          </section>

          {/* ── FOUNDER & ORIGIN STORY ── */}
          <section
            className={cn(
              "grid lg:grid-cols-12 gap-12 items-center",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            <div className="lg:col-span-5 relative group max-w-xs sm:max-w-sm mx-auto">
              <div className="absolute inset-0 bg-[#134467] rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-5" />
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#E53935] to-[#48AEDD] rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                  <img
                    src="/FourSix_Logo.jpeg"
                    alt="FourSix46 Logo"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/90 via-[#134467]/20 to-transparent opacity-80" />
                </div>
              </div>
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#E53935] text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white rotate-12 group-hover:rotate-0 transition-transform duration-300 z-20">
                46
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#48AEDD] font-bold tracking-wide uppercase text-sm">
                <Quote className="w-5 h-5 fill-current" />
                Origin Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#134467] leading-tight">
                A Mark of <span className="text-[#E53935]">IDENTITY.</span>
              </h2>
              <div className="space-y-6 text-lg text-[#134467]/80 leading-relaxed">
                <p>
                  Since 2018, <strong className="text-[#134467]">46</strong> has
                  been more than just digits — it has been a personal symbol of
                  meaning, luck, and drive. 46 became part of everyday life, a
                  mark of IDENTITY.
                </p>
                <p>
                  When it was time to step into the world of business, the
                  vision was clear: build a brand that could stand the test of
                  time, transcend industries, and carry a global presence.
                </p>
                <p>
                  That vision became{" "}
                  <strong className="text-[#134467]">FourSix46®</strong> — a
                  name born from numbers, yet built to represent limitless
                  growth.
                </p>
              </div>
            </div>
          </section>

          <section
            className={cn("grid md:grid-cols-2 gap-10 items-stretch", fadeInUp)}
          >
            {/* Left: Highlighted typing animation without card */}
            <div className="flex flex-col justify-center px-6 md:px-12 py-12">
              <TypingHighlight
                text={'" FourSix46® is more than a company name."'}
              />
              <p className="mt-6 text-2xl text-[#134467] font-semibold max-w-md">
                A house for multi-industry brands.
              </p>
            </div>

            {/* Right: Tweet image floats, X icon static in top right */}
            <div className="relative overflow-hidden rounded-3xl group shadow-xl aspect-video md:aspect-auto">
              {/* Tweet image with float animation */}
              <a
                href="https://x.com/46_d_c"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src="/tweet.jpeg"
                  alt="FourSix46® on Social Media"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-float cursor-pointer"
                />
              </a>
              {/* Navy blue animated overlay */}
              <div className="absolute inset-0  opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl animate-pulse-slow pointer-events-none" />
              {/* Static X image on top right */}
              <a
                href="https://x.com/46_d_c"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-6 right-10 w-10 h-10"
              >
                <img
                  src="/X-Logo.png" // Use your uploaded "X" image filename here
                  alt="X Twitter Icon"
                  className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-110 drop-shadow-lg"
                />
              </a>
              <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.45; }
        50% { opacity: 0.7; }
      }
      .animate-pulse-slow {
        animation: pulse-slow 6s ease-in-out infinite;
      }
    `}</style>
            </div>
          </section>

          {/* ── OKAPI IDENTITY ── */}
          <section
            className={cn(
              "relative bg-[#134467] rounded-[3rem] p-8 sm:p-16 overflow-hidden text-white shadow-2xl shadow-blue-900/20",
              fadeInUp,
            )}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5EB18] rounded-full blur-[120px] opacity-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#48AEDD] rounded-full blur-[120px] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="p-6 bg-white/10 rounded-3xl shrink-0 backdrop-blur-md border border-white/10">
                <PawPrint className="w-16 h-16 text-[#F5EB18]" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                  Why the Okapi?
                </h2>
                <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-3xl">
                  At the heart of our identity is the okapi — A rare and
                  majestic animal, a close relative of the giraffe, but often
                  mistaken for something else due to its zebra-like legs and
                  solitary nature.
                </p>
                <div className="pl-6 border-l-4 border-[#F5EB18]">
                  <p className="font-medium text-white text-xl italic mb-2">
                    "Just as the okapi stands out in nature, FourSix46® stands
                    out in business."
                  </p>
                  <p className="text-[#F5EB18] font-medium">
                    It represents our uniqueness and commitment to standing out,
                    wherever we go.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOURSIX46 COURIERS + FLEET ── */}
          <section className="max-w-7xl mx-auto px-6 sm:px-0">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#48AEDD]/20 via-[#E53935]/10 to-[#F5EB18]/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white group-hover:border-[#48AEDD]/50 transition-all duration-500">
                  <img
                    src="/okapi.jpeg"
                    alt="Okapi - Symbol of FourSix46®"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#E53935] text-white px-6 py-3 rounded-2xl shadow-xl border-4 border-white transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <p className="font-bold text-sm uppercase tracking-wider">
                    Unique & Bold
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-[#E53935] leading-tight">
                    Route46
                    <span className="text-[#48AEDD]"> Couriers</span>
                  </h2>
                  <div className="inline-block">
                    <p className="text-base font-semibold uppercase tracking-widest text-[#134467] border-b-4 border-[#F5EB18] inline-block pb-2">
                      The Courier with a Difference
                    </p>
                  </div>
                </div>
                <div className="space-y-5 text-lg text-[#134467]/80 leading-relaxed">
                  <p>
                    The first chapter of FourSix46® begins with logistics — one
                    of the fastest-growing industries in the world. Route46
                    Couriers was launched to bring adaptability, speed, and
                    reliability into courier services.
                  </p>
                  <p>
                    We combine technology, efficiency, and customer-focused
                    service to ensure every delivery goes beyond expectations.
                    Whether it's last-mile delivery, e-commerce shipping, or
                    corporate logistics, we move with purpose.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="bg-gradient-to-r from-[#F5EB18]/20 to-transparent px-6 py-4 rounded-2xl border-l-4 border-[#E53935]">
                    <p className="font-semibold text-[#E53935]">
                      At Route46 Couriers, we don't just deliver packages.
                    </p>
                    <p className="font-bold text-xl text-[#48AEDD] mt-1">
                      We deliver differently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fleet Image */}
            {/* <div
              className="relative w-full h-[600px] rounded-[2rem] overflow-hidden shadow-2xl mx-auto mt-16 group transition-transform duration-500 hover:scale-[1.02]"
              style={{ border: "4px solid #ddd75aff" }}
            >
              <img
                src="/Okapi V3 FS46.jpg"
                alt="FourSix46 Fleet"
                className="hidden sm:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <img
                src="/Okapi Mobile FS46 About.jpg"
                alt="FourSix46 Fleet"
                className="block sm:hidden w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#134467]/50 via-[#D9DA20]/30 to-transparent opacity-45 pointer-events-none" />
              <div className="absolute bottom-10 left-10">
                <Truck className="w-12 h-12 text-[#F5EB18] mb-4 animate-bounce" />
                <p className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                  Moving With Purpose
                </p>
              </div>
            </div> */}
          </section>

          {/* ── FUTURE STATEMENT ── */}
          <div className="bg-[#48AEDD]/10 rounded-2xl p-8 sm:p-12 text-center border border-[#48AEDD]/20">
            <h3 className="text-2xl font-bold text-[#134467] mb-3">
              Statement
            </h3>
            <p className="text-[#134467]/80 text-lg sm:text-xl font-medium max-w-3xl mx-auto">
              "This is only the beginning. From couriers to logistics, retail,
              tech, and beyond — the future of FourSix46® is limitless."
            </p>
          </div>

          {/* ── MISSION SECTION ── */}
          <section className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#134467] text-white mb-2 shadow-lg shadow-[#134467]/20">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#134467]">
              Our Mission
            </h2>
            <p className="text-xl text-[#134467]/80 leading-relaxed max-w-3xl mx-auto">
              At Route46 Couriers, our mission is to provide fast, reliable, and
              professional courier services across the United Kingdom by
              connecting businesses and individuals with a trusted nationwide
              network of courier drivers and vehicles. We aim to make same-day
              and time-critical deliveries simple, transparent, and dependable —
              ensuring every shipment, from urgent documents to pallet
              transport, is handled with care, efficiency, and professional
              logistics standards.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="bg-white p-6 rounded-2xl border border-[#48AEDD]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#48AEDD]/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[#48AEDD]" />
                  </div>
                  <h3 className="font-bold text-[#134467]">
                    Reliable Courier Services
                  </h3>
                </div>
                <p className="text-[#134467]/75 leading-relaxed text-sm">
                  We are committed to delivering shipments safely and
                  efficiently across the UK. From small parcels to larger
                  freight, every delivery is handled with professional care and
                  industry-standard transport practices.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#E53935]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E53935]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#E53935]" />
                  </div>
                  <h3 className="font-bold text-[#134467]">
                    Supporting Drivers and Businesses
                  </h3>
                </div>
                <p className="text-[#134467]/75 leading-relaxed text-sm">
                  Our network connects thousands of courier drivers with
                  businesses and individuals who require dependable delivery
                  services. By enabling access to a nationwide courier network,
                  Route46 Couriers helps ensure reliable logistics support
                  across the UK.
                </p>
              </div>
            </div>
          </section>

          {/* ── VALUES GRID ── */}
          <section className="space-y-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#134467]">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(229,57,53,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <div className="w-14 h-14 bg-[#E53935]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E53935] transition-colors relative z-10">
                  <Shield className="w-7 h-7 text-[#E53935] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
                  1. Safety and Responsibility
                </h3>
                <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
                  The safety of drivers, customers, and transported goods is our
                  highest priority. We promote responsible driving, secure
                  parcel handling, and professional courier practices throughout
                  every delivery.
                </p>
              </div>

              {/* Value 2 */}
              <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(72,174,221,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#48AEDD]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <div className="w-14 h-14 bg-[#48AEDD]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#48AEDD] transition-colors relative z-10">
                  <Users className="w-7 h-7 text-[#48AEDD] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
                  2. Respect for Drivers and Customers
                </h3>
                <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
                  We believe strong logistics networks are built on trust and
                  respect. Every driver and every customer deserves clear
                  communication, fair service, and professional treatment.
                </p>
              </div>

              {/* Value 3 */}
              <div className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-[0_20px_50px_rgba(245,235,24,0.15)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5EB18]/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <div className="w-14 h-14 bg-[#F5EB18]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F5EB18] transition-colors relative z-10">
                  <TrendingUp className="w-7 h-7 text-[#134467] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#134467] mb-3 relative z-10">
                  3. Reliability Through Trust
                </h3>
                <p className="text-[#134467]/80 leading-relaxed text-sm relative z-10">
                  Route46 Couriers focuses on long-term relationships with
                  businesses and individuals who depend on reliable delivery
                  services. We build trust through consistent service
                  performance and transparent communication.
                </p>
              </div>
            </div>

            {/* SEO line under values */}
            <p className="text-center text-sm text-[#134467]/55 font-medium max-w-2xl mx-auto leading-relaxed">
              Route46 Couriers provides same day courier services across the UK,
              supported by a nationwide logistics network with access to
              thousands of courier drivers and vehicles.
            </p>
          </section>

          {/* ── OUR NETWORK ── */}
          <section
            className={cn(
              "relative bg-[#134467] rounded-[3rem] p-8 sm:p-16 overflow-hidden text-white shadow-2xl shadow-blue-900/20",
              fadeInUp,
            )}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#48AEDD] rounded-full blur-[120px] opacity-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5EB18] rounded-full blur-[120px] opacity-10" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <MapPin className="w-7 h-7 text-[#F5EB18]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F5EB18]">
                    Coverage
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Our Network
                </h2>
                <div className="w-12 h-1 rounded-full bg-[#F5EB18]" />
                <p className="text-white/80 text-lg leading-relaxed">
                  Route46 Couriers operates through a nationwide courier network
                  with access to thousands of courier drivers and vehicles
                  across the United Kingdom. This flexible logistics
                  infrastructure allows Route46 Couriers to coordinate
                  deliveries efficiently across cities, towns, and business hubs
                  while maintaining reliable service availability.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#F5EB18] mb-4">
                  Our courier network supports:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Urgent document transport",
                    "Parcel delivery",
                    "Pallet transport",
                    "Business courier contracts",
                    "Time-critical shipments",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#F5EB18]/20 text-[#F5EB18] text-xs font-black flex items-center justify-center flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-white/80 font-medium text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── ABOUT THE FOUNDER ── */}
          <section className={cn("space-y-8", fadeInUp)}>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#134467] text-white mb-4 shadow-lg shadow-[#134467]/20">
                <User className="w-8 h-8" />
              </div>
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] bg-[#134467]/5 text-[#134467] px-5 py-2 rounded-full border border-[#134467]/10 mb-4 w-fit mx-auto">
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#134467] mb-4">
                About the <span className="text-[#E53935]">Founder</span>
              </h2>
              <div className="w-12 h-1 rounded-full bg-[#E53935] mx-auto mb-6" />
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm max-w-3xl mx-auto space-y-5">
              <p className="text-base sm:text-lg text-[#134467]/75 leading-relaxed">
                Route46 Couriers is founded by{" "}
                <strong className="text-[#134467]">Dinesh Koyyalamudi</strong>,
                an entrepreneur focused on building structured business ventures
                with long-term brand identity.
              </p>
              <p className="text-base sm:text-lg text-[#134467]/75 leading-relaxed">
                Through FourSix46®, Dinesh Koyyalamudi is developing a
                multi-industry brand ecosystem that combines logistics services,
                digital platforms, and technology-driven business solutions.
              </p>
              <div className="pl-6 border-l-4 border-[#48AEDD] mt-4">
                <p className="text-[#134467]/80 font-medium leading-relaxed italic">
                  "His vision behind Route46 Couriers is to create a trusted
                  courier brand that connects businesses and individuals with
                  reliable delivery services across the United Kingdom."
                </p>
              </div>
            </div>
          </section>

          {/* ── LOOKING AHEAD (replaces "Simplicity in Every Step") ── */}
          <div className="bg-gradient-to-r from-[#48AEDD] to-[#134467] rounded-[3rem] p-10 sm:p-20 text-center text-white relative overflow-hidden">
            <Globe className="absolute top-10 left-10 w-40 h-40 opacity-10 rotate-12" />
            <Layers className="absolute bottom-10 right-10 w-32 h-32 opacity-10 -rotate-12 text-[#F5EB18]" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h3 className="text-3xl sm:text-4xl font-bold">Looking Ahead</h3>
              <p className="text-white/90 text-xl leading-relaxed">
                Route46 Couriers continues to expand its courier network and
                logistics capabilities while operating under the strategic
                direction of FourSix46® Global Ltd. The long-term vision is to
                build a modern logistics platform that combines strong
                operational standards with scalable technology infrastructure.
              </p>
              <div className="inline-block border-2 border-[#F5EB18] text-[#F5EB18] font-bold py-4 px-10 rounded-full tracking-wide uppercase text-sm hover:bg-[#F5EB18] hover:text-[#134467] transition-colors cursor-default shadow-lg">
                FourSix46®
              </div>
            </div>
          </div>

          {/* ── LEGAL STATEMENT ── */}
          <div className="flex items-start justify-center gap-2.5 max-w-2xl mx-auto px-4 py-4 rounded-2xl bg-[#134467]/4 border border-[#134467]/10">
            <span className="text-[#134467]/45 mt-0.5 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <p className="text-xs text-[#134467]/55 font-medium leading-relaxed text-left">
              <span className="font-bold text-[#134467]/70">
                Legal Statement:{" "}
              </span>
              Route46 Couriers is a trading brand of FourSix46® Global Ltd, a
              company registered in the United Kingdom.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
