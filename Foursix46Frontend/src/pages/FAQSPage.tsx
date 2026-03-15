// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Search,
//   ChevronDown,
//   HelpCircle,
//   Package,
//   Truck,
//   CreditCard,
//   Shield,
//   Users,
//   UserPlus,
//   AlertTriangle,
//   FileText,
//   MapPin,
//   RefreshCcw,
//   HardHat,
//   Smartphone,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Footer from "@/components/Footer";
// import { Helmet } from "react-helmet-async";

// const apiUrl = import.meta.env.VITE_API_URL;

// const fadeInUp =
//   "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards";

// /* ================= CATEGORY META ================= */

// const faqCategories = [
//   { id: "general", label: "General", icon: HelpCircle, color: "#134467" },
//   { id: "booking", label: "Booking", icon: MapPin, color: "#48AEDD" },
//   { id: "packaging", label: "Packaging", icon: Package, color: "#E53935" },
//   { id: "delivery", label: "Delivery", icon: Truck, color: "#F5EB18" },
//   { id: "pricing", label: "Pricing", icon: CreditCard, color: "#134467" },
//   { id: "refunds", label: "Refunds", icon: RefreshCcw, color: "#E53935" },
//   { id: "damage", label: "Insurance", icon: Shield, color: "#48AEDD" },
//   { id: "shippers", label: "Business", icon: Users, color: "#134467" },
//   { id: "drivers", label: "Drivers", icon: UserPlus, color: "#F5EB18" },
//   { id: "safety", label: "Safety", icon: HardHat, color: "#E53935" },
//   { id: "tech", label: "Tech", icon: Smartphone, color: "#48AEDD" },
//   { id: "onboarding", label: "Onboarding", icon: FileText, color: "#134467" },
//   { id: "contact", label: "Support", icon: AlertTriangle, color: "#E53935" },
// ];

// /* ================= TYPES ================= */

// interface FaqItem {
//   id: string;
//   question: string;
//   answer: string;
//   category: string;
//   tags?: string[];
//   status: string;
//   sortOrder: number;
// }

// interface FaqSection {
//   category: string;
//   label: string;
//   questions: FaqItem[];
// }

// /* ================= COMPONENT ================= */

// export default function FaqPage() {
//   const [allFaqs, setAllFaqs] = useState<FaqItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("general");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openQuestions, setOpenQuestions] = useState<string[]>([]);
//   const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     async function loadFaqs() {
//       try {
//         const res = await fetch(`${apiUrl}/api/faqs`);
//         if (!res.ok) throw new Error("Failed to fetch FAQs");
//         const json = await res.json();
//         const data: FaqItem[] = json.data || json;

//         const active = data
//           .filter((f) => f.status === "published")
//           // ✅ FIX: Defensively fallback category to "general" if missing in Firestore doc
//           .map((f) => ({
//             ...f,
//             category: f.category || "general",
//           }))
//           .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

//         setAllFaqs(active);
//       } catch (err) {
//         console.error("FAQ fetch error:", err);
//         setAllFaqs([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadFaqs();
//   }, []);

//   /* ================= DERIVED DATA ================= */

//   const populatedCategories = useMemo(() => {
//     const hasCategory = new Set(allFaqs.map((f) => f.category));
//     return faqCategories.filter((c) => hasCategory.has(c.id));
//   }, [allFaqs]);

//   const faqSections = useMemo((): FaqSection[] => {
//     return faqCategories
//       .map((cat) => ({
//         category: cat.id,
//         label: cat.label,
//         questions: allFaqs.filter((f) => f.category === cat.id),
//       }))
//       .filter((s) => s.questions.length > 0);
//   }, [allFaqs]);

//   useEffect(() => {
//     if (populatedCategories.length > 0) {
//       const ids = populatedCategories.map((c) => c.id);
//       if (!ids.includes(activeCategory)) {
//         setActiveCategory(ids[0]);
//       }
//     }
//   }, [populatedCategories]);

//   /* ================= FILTER ================= */

//   const filteredSections = useMemo(() => {
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       return faqSections
//         .map((s) => ({
//           ...s,
//           questions: s.questions.filter(
//             (item) =>
//               item.question.toLowerCase().includes(q) ||
//               item.answer.toLowerCase().includes(q) ||
//               item.tags?.some((t) => t.toLowerCase().includes(q)),
//           ),
//         }))
//         .filter((s) => s.questions.length > 0);
//     }
//     return faqSections.filter((s) => s.category === activeCategory);
//   }, [searchQuery, activeCategory, faqSections]);

//   /* ================= HELPERS ================= */

//   const toggleQuestion = (id: string) => {
//     setOpenQuestions((prev) =>
//       prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
//     );
//   };

//   const activeCat = faqCategories.find((c) => c.id === activeCategory);

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-[#134467]/60 font-medium">Loading FAQs...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
//       <Helmet>
//         <title>FAQs | FourSix46®</title>
//         <meta
//           name="description"
//           content="Answers to common questions about FourSix46® courier services, booking, pricing, and policies."
//         />
//         <link rel="canonical" href="https://couriers.foursix46.com/faqs" />

//         <meta property="og:title" content="FAQs | FourSix46®" />
//         <meta
//           property="og:description"
//           content="Answers to common questions about FourSix46® courier services, booking, pricing, and policies."
//         />
//         <meta property="og:url" content="https://couriers.foursix46.com/faqs" />
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
//                 name: "FAQs",
//                 item: "https://couriers.foursix46.com/faqs",
//               },
//             ],
//           })}
//         </script>

//         {allFaqs.length > 0 && (
//           <script type="application/ld+json">
//             {JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "FAQPage",
//               mainEntity: allFaqs.map((faq) => ({
//                 "@type": "Question",
//                 name: faq.question,
//                 acceptedAnswer: {
//                   "@type": "Answer",
//                   text: faq.answer.replace(/<[^>]*>/g, ""),
//                 },
//               })),
//             })}
//           </script>
//         )}
//       </Helmet>

//       {/* Custom scrollbar */}
//       <style>{`
//         .faq-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
//         .faq-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .faq-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 4px; }
//         .faq-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }
//       `}</style>

//       {/* HERO */}
//       <div className="relative pt-24 pb-20 bg-white border-b border-slate-100">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10" />
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10" />

//         <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
//           <span
//             className={cn(
//               "inline-block py-1.5 px-4 rounded-full bg-[#134467]/5 text-[#134467] font-bold text-xs sm:text-sm mb-6 tracking-widest uppercase border border-[#134467]/10",
//               fadeInUp,
//             )}
//           >
//             Help Center
//           </span>

//           <h1
//             className={cn(
//               "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight",
//               fadeInUp,
//             )}
//           >
//             Frequently Asked <span className="text-[#E53935]">Questions</span>
//           </h1>

//           <p
//             className={cn(
//               "text-lg text-[#134467]/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium",
//               fadeInUp,
//             )}
//           >
//             Everything you need to know about our services, booking process, and
//             policies.
//           </p>

//           {/* Search */}
//           <div className={cn("relative max-w-xl mx-auto", fadeInUp)}>
//             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search for answers..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setOpenQuestions([]);
//               }}
//               className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 shadow-lg shadow-slate-200/50 focus:border-[#48AEDD] focus:ring-4 focus:ring-[#48AEDD]/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-700 transition"
//               >
//                 ✕
//               </button>
//             )}
//           </div>

//           {searchQuery && (
//             <p className="mt-3 text-sm text-[#134467]/50">
//               {filteredSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
//               result(s) found
//             </p>
//           )}
//         </div>
//       </div>

//       {/* FAQ CONTENT */}
//       <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
//         <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
//           {/* SIDEBAR */}
//           {!searchQuery && populatedCategories.length > 0 && (
//             <div className="lg:w-1/4 flex-shrink-0 relative z-20">
//               {/* MOBILE: Dropdown */}
//               <div className="lg:hidden mb-4">
//                 <button
//                   onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
//                   className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm text-[#134467] font-bold"
//                 >
//                   <span className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-[#134467]/10 flex items-center justify-center">
//                       {activeCat && (
//                         <activeCat.icon className="w-5 h-5 text-[#134467]" />
//                       )}
//                     </div>
//                     {activeCat?.label || "Select Category"}
//                   </span>
//                   <ChevronDown
//                     className={cn(
//                       "w-5 h-5 transition-transform duration-300",
//                       isCategoryMenuOpen ? "rotate-180" : "",
//                     )}
//                   />
//                 </button>

//                 <div
//                   className={cn(
//                     "absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto z-50 p-2 origin-top transition-all duration-300 ease-out",
//                     isCategoryMenuOpen
//                       ? "opacity-100 scale-100 translate-y-0"
//                       : "opacity-0 scale-95 -translate-y-4 pointer-events-none",
//                   )}
//                 >
//                   {populatedCategories.map((cat) => (
//                     <button
//                       key={cat.id}
//                       onClick={() => {
//                         setActiveCategory(cat.id);
//                         setIsCategoryMenuOpen(false);
//                         setOpenQuestions([]);
//                       }}
//                       className={cn(
//                         "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left mb-1",
//                         activeCategory === cat.id
//                           ? "bg-[#134467]/5 text-[#134467] font-bold"
//                           : "text-slate-600 hover:bg-slate-50",
//                       )}
//                     >
//                       <cat.icon
//                         className="w-5 h-5"
//                         style={{
//                           color:
//                             activeCategory === cat.id ? cat.color : "#94a3b8",
//                         }}
//                       />
//                       {cat.label}
//                       <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
//                         {allFaqs.filter((f) => f.category === cat.id).length}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* DESKTOP: Sidebar */}
//               <div className="hidden lg:block space-y-2 sticky top-24 self-start overflow-y-auto max-h-[70vh] pb-2 faq-scrollbar pr-2">
//                 {populatedCategories.map((cat) => (
//                   <button
//                     key={cat.id}
//                     onClick={() => {
//                       setActiveCategory(cat.id);
//                       setOpenQuestions([]);
//                     }}
//                     className={cn(
//                       "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm w-full text-left group border border-transparent",
//                       activeCategory === cat.id
//                         ? "bg-white shadow-md text-[#134467] border-slate-100 translate-x-2"
//                         : "text-slate-500 hover:bg-white/50 hover:text-[#48AEDD]",
//                     )}
//                   >
//                     <div
//                       className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
//                       style={{
//                         backgroundColor:
//                           activeCategory === cat.id
//                             ? `${cat.color}20`
//                             : "#f1f5f9",
//                       }}
//                     >
//                       <cat.icon
//                         className="w-4 h-4"
//                         style={{
//                           color:
//                             activeCategory === cat.id ? cat.color : "#94a3b8",
//                         }}
//                       />
//                     </div>
//                     <span className="flex-1">{cat.label}</span>
//                     <span
//                       className={cn(
//                         "text-xs px-2 py-0.5 rounded-full",
//                         activeCategory === cat.id
//                           ? "bg-[#134467]/10 text-[#134467]"
//                           : "bg-slate-100 text-slate-400",
//                       )}
//                     >
//                       {allFaqs.filter((f) => f.category === cat.id).length}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* QUESTIONS PANEL */}
//           <div
//             className={cn("flex-1 space-y-8 min-w-0", searchQuery && "w-full")}
//           >
//             {filteredSections.length > 0 ? (
//               filteredSections.map((section) => (
//                 <div
//                   key={section.category}
//                   className="animate-in fade-in slide-in-from-bottom-4 duration-500"
//                 >
//                   <h2 className="text-xl font-bold text-[#134467] mb-6 flex items-center gap-3 pb-2 border-b border-slate-200">
//                     {(() => {
//                       const cat = faqCategories.find(
//                         (c) => c.id === section.category,
//                       );
//                       return cat ? (
//                         <>
//                           <cat.icon
//                             className="w-5 h-5 flex-shrink-0"
//                             style={{ color: cat.color }}
//                           />
//                           {cat.label} FAQs
//                         </>
//                       ) : (
//                         section.label
//                       );
//                     })()}
//                   </h2>

//                   <div className="space-y-4">
//                     {section.questions.map((item) => {
//                       const isOpen = openQuestions.includes(item.id);
//                       return (
//                         <div
//                           key={item.id}
//                           className={cn(
//                             "bg-white border rounded-2xl overflow-hidden transition-all duration-300",
//                             isOpen
//                               ? "border-[#48AEDD] shadow-lg ring-1 ring-[#48AEDD]/20"
//                               : "border-slate-100 hover:border-slate-300 shadow-sm",
//                           )}
//                         >
//                           <button
//                             onClick={() => toggleQuestion(item.id)}
//                             className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
//                           >
//                             <span
//                               className={cn(
//                                 "font-bold text-base sm:text-lg pr-4 leading-snug",
//                                 isOpen ? "text-[#134467]" : "text-slate-700",
//                               )}
//                             >
//                               {item.question}
//                             </span>

//                             <div
//                               className={cn(
//                                 "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0",
//                                 isOpen
//                                   ? "bg-[#E53935] text-white rotate-180"
//                                   : "bg-slate-100 text-slate-400",
//                               )}
//                             >
//                               <ChevronDown className="w-5 h-5" />
//                             </div>
//                           </button>

//                           <div
//                             className={cn(
//                               "overflow-hidden transition-all duration-300 ease-in-out",
//                               isOpen
//                                 ? "max-h-[600px] opacity-100"
//                                 : "max-h-0 opacity-0",
//                             )}
//                           >
//                             <div className="p-5 pt-0 border-t border-slate-50">
//                               <div
//                                 dangerouslySetInnerHTML={{
//                                   __html: item.answer,
//                                 }}
//                                 className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
//                               />

//                               {item.tags && item.tags.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
//                                   {item.tags.map((tag, i) => (
//                                     <span
//                                       key={i}
//                                       className="px-2 py-0.5 bg-[#48AEDD]/10 text-[#134467] text-xs rounded-full font-medium cursor-pointer hover:bg-[#48AEDD]/20 transition"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         setSearchQuery(tag);
//                                       }}
//                                     >
//                                       #{tag}
//                                     </span>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-20 opacity-60">
//                 <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                 <p className="text-xl font-bold text-slate-500">
//                   No answers found
//                 </p>
//                 <p className="text-slate-400 mt-1">
//                   Try adjusting your search terms or browse by category.
//                 </p>
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="mt-4 text-[#48AEDD] underline text-sm"
//                   >
//                     Clear search
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  Shield,
  Users,
  UserPlus,
  AlertTriangle,
  FileText,
  MapPin,
  RefreshCcw,
  HardHat,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const apiUrl = import.meta.env.VITE_API_URL;

const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards";

/* ================= CATEGORY META ================= */

const faqCategories = [
  { id: "general", label: "General", icon: HelpCircle, color: "#134467" },
  { id: "booking", label: "Booking", icon: MapPin, color: "#48AEDD" },
  { id: "packaging", label: "Packaging", icon: Package, color: "#E53935" },
  { id: "delivery", label: "Delivery", icon: Truck, color: "#F5EB18" },
  { id: "pricing", label: "Pricing", icon: CreditCard, color: "#134467" },
  { id: "refunds", label: "Refunds", icon: RefreshCcw, color: "#E53935" },
  { id: "damage", label: "Insurance", icon: Shield, color: "#48AEDD" },
  { id: "shippers", label: "Business", icon: Users, color: "#134467" },
  { id: "drivers", label: "Drivers", icon: UserPlus, color: "#F5EB18" },
  { id: "safety", label: "Safety", icon: HardHat, color: "#E53935" },
  { id: "tech", label: "Tech", icon: Smartphone, color: "#48AEDD" },
  { id: "onboarding", label: "Onboarding", icon: FileText, color: "#134467" },
  { id: "contact", label: "Support", icon: AlertTriangle, color: "#E53935" },
];

/* ================= TYPES ================= */

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  status: string;
  sortOrder: number;
}

interface FaqSection {
  category: string;
  label: string;
  questions: FaqItem[];
}

/* ================= COMPONENT ================= */

export default function FaqPage() {
  const [allFaqs, setAllFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${apiUrl}/api/faqs`);
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const json = await res.json();
        const data: FaqItem[] = json.data || json;

        const active = data
          .filter((f) => f.status === "published")
          .map((f) => ({
            ...f,
            category: f.category || "general",
          }))
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        setAllFaqs(active);
      } catch (err) {
        console.error("FAQ fetch error:", err);
        setAllFaqs([]);
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  /* ================= DERIVED DATA ================= */

  const populatedCategories = useMemo(() => {
    const hasCategory = new Set(allFaqs.map((f) => f.category));
    return faqCategories.filter((c) => hasCategory.has(c.id));
  }, [allFaqs]);

  const faqSections = useMemo((): FaqSection[] => {
    return faqCategories
      .map((cat) => ({
        category: cat.id,
        label: cat.label,
        questions: allFaqs.filter((f) => f.category === cat.id),
      }))
      .filter((s) => s.questions.length > 0);
  }, [allFaqs]);

  useEffect(() => {
    if (populatedCategories.length > 0) {
      const ids = populatedCategories.map((c) => c.id);
      if (!ids.includes(activeCategory)) {
        setActiveCategory(ids[0]);
      }
    }
  }, [populatedCategories]);

  /* ================= FILTER ================= */

  const filteredSections = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return faqSections
        .map((s) => ({
          ...s,
          questions: s.questions.filter(
            (item) =>
              item.question.toLowerCase().includes(q) ||
              item.answer.toLowerCase().includes(q) ||
              item.tags?.some((t) => t.toLowerCase().includes(q)),
          ),
        }))
        .filter((s) => s.questions.length > 0);
    }
    return faqSections.filter((s) => s.category === activeCategory);
  }, [searchQuery, activeCategory, faqSections]);

  /* ================= HELPERS ================= */

  const toggleQuestion = (id: string) => {
    setOpenQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const activeCat = faqCategories.find((c) => c.id === activeCategory);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#134467]/60 font-medium">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
      <Helmet>
        <title>FAQs | FourSix46®</title>
        <meta
          name="description"
          content="Answers to common questions about FourSix46® courier services, booking, pricing, and policies."
        />
        <link rel="canonical" href="https://couriers.foursix46.com/faqs" />

        {/* ✅ Robots — explicitly allow indexing */}
        <meta name="robots" content="index, follow" />

        {/* ✅ OpenGraph — complete set */}
        <meta property="og:title" content="FAQs | FourSix46®" />
        <meta
          property="og:description"
          content="Answers to common questions about FourSix46® courier services, booking, pricing, and policies."
        />
        <meta property="og:url" content="https://couriers.foursix46.com/faqs" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://couriers.foursix46.com/og-default.jpg"
        />
        {/* ✅ og:image dimensions — prevents unfurling issues on Slack/LinkedIn */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FourSix46 Couriers – FAQs" />
        {/* ✅ og:locale */}
        <meta property="og:locale" content="en_GB" />
        <meta property="og:site_name" content="FourSix46 Couriers" />

        {/* ✅ Twitter Card — missing before */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQs | FourSix46®" />
        <meta
          name="twitter:description"
          content="Answers to common questions about FourSix46® courier services, booking, pricing, and policies."
        />
        <meta
          name="twitter:image"
          content="https://couriers.foursix46.com/og-default.jpg"
        />
        <meta name="twitter:image:alt" content="FourSix46 Couriers – FAQs" />

        {/* ✅ BreadcrumbList schema */}
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
                name: "FAQs",
                item: "https://couriers.foursix46.com/faqs",
              },
            ],
          })}
        </script>

        {/* ✅ FAQPage schema — only rendered when FAQs are loaded */}
        {allFaqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: allFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer.replace(/<[^>]*>/g, ""),
                },
              })),
            })}
          </script>
        )}
      </Helmet>

      {/* Custom scrollbar */}
      <style>{`
        .faq-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .faq-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .faq-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 4px; }
        .faq-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }
      `}</style>

      {/* HERO */}
      <div className="relative pt-24 pb-20 bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <span
            className={cn(
              "inline-block py-1.5 px-4 rounded-full bg-[#134467]/5 text-[#134467] font-bold text-xs sm:text-sm mb-6 tracking-widest uppercase border border-[#134467]/10",
              fadeInUp,
            )}
          >
            Help Center
          </span>

          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight",
              fadeInUp,
            )}
          >
            Frequently Asked <span className="text-[#E53935]">Questions</span>
          </h1>

          <p
            className={cn(
              "text-lg text-[#134467]/80 mb-10 max-w-2xl mx-auto leading-relaxed font-medium",
              fadeInUp,
            )}
          >
            Everything you need to know about our services, booking process, and
            policies.
          </p>

          {/* Search */}
          <div className={cn("relative max-w-xl mx-auto", fadeInUp)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenQuestions([]);
              }}
              aria-label="Search frequently asked questions"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 shadow-lg shadow-slate-200/50 focus:border-[#48AEDD] focus:ring-4 focus:ring-[#48AEDD]/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="mt-3 text-sm text-[#134467]/50" aria-live="polite">
              {filteredSections.reduce((n, s) => n + s.questions.length, 0)}{" "}
              result(s) found
            </p>
          )}
        </div>
      </div>

      {/* FAQ CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* SIDEBAR */}
          {!searchQuery && populatedCategories.length > 0 && (
            <div className="lg:w-1/4 flex-shrink-0 relative z-20">
              {/* MOBILE: Dropdown */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  aria-expanded={isCategoryMenuOpen}
                  aria-controls="mobile-category-menu"
                  aria-label="Select FAQ category"
                  className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm text-[#134467] font-bold"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#134467]/10 flex items-center justify-center">
                      {activeCat && (
                        <activeCat.icon
                          className="w-5 h-5 text-[#134467]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    {activeCat?.label || "Select Category"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isCategoryMenuOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                <div
                  id="mobile-category-menu"
                  role="listbox"
                  aria-label="FAQ categories"
                  className={cn(
                    "absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto z-50 p-2 origin-top transition-all duration-300 ease-out",
                    isCategoryMenuOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-4 pointer-events-none",
                  )}
                >
                  {populatedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      role="option"
                      aria-selected={activeCategory === cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsCategoryMenuOpen(false);
                        setOpenQuestions([]);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left mb-1",
                        activeCategory === cat.id
                          ? "bg-[#134467]/5 text-[#134467] font-bold"
                          : "text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      <cat.icon
                        className="w-5 h-5"
                        aria-hidden="true"
                        style={{
                          color:
                            activeCategory === cat.id ? cat.color : "#94a3b8",
                        }}
                      />
                      {cat.label}
                      <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {allFaqs.filter((f) => f.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DESKTOP: Sidebar */}
              <nav
                aria-label="FAQ categories"
                className="hidden lg:block space-y-2 sticky top-24 self-start overflow-y-auto max-h-[70vh] pb-2 faq-scrollbar pr-2"
              >
                {populatedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenQuestions([]);
                    }}
                    aria-current={
                      activeCategory === cat.id ? "true" : undefined
                    }
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm w-full text-left group border border-transparent",
                      activeCategory === cat.id
                        ? "bg-white shadow-md text-[#134467] border-slate-100 translate-x-2"
                        : "text-slate-500 hover:bg-white/50 hover:text-[#48AEDD]",
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                      style={{
                        backgroundColor:
                          activeCategory === cat.id
                            ? `${cat.color}20`
                            : "#f1f5f9",
                      }}
                    >
                      <cat.icon
                        className="w-4 h-4"
                        aria-hidden="true"
                        style={{
                          color:
                            activeCategory === cat.id ? cat.color : "#94a3b8",
                        }}
                      />
                    </div>
                    <span className="flex-1">{cat.label}</span>
                    <span
                      aria-label={`${allFaqs.filter((f) => f.category === cat.id).length} questions`}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        activeCategory === cat.id
                          ? "bg-[#134467]/10 text-[#134467]"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {allFaqs.filter((f) => f.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* QUESTIONS PANEL */}
          <div
            className={cn("flex-1 space-y-8 min-w-0", searchQuery && "w-full")}
          >
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <section
                  key={section.category}
                  aria-labelledby={`faq-section-${section.category}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <h2
                    id={`faq-section-${section.category}`}
                    className="text-xl font-bold text-[#134467] mb-6 flex items-center gap-3 pb-2 border-b border-slate-200"
                  >
                    {(() => {
                      const cat = faqCategories.find(
                        (c) => c.id === section.category,
                      );
                      return cat ? (
                        <>
                          <cat.icon
                            className="w-5 h-5 flex-shrink-0"
                            aria-hidden="true"
                            style={{ color: cat.color }}
                          />
                          {cat.label} FAQs
                        </>
                      ) : (
                        section.label
                      );
                    })()}
                  </h2>

                  <div className="space-y-4">
                    {section.questions.map((item) => {
                      const isOpen = openQuestions.includes(item.id);
                      const answerId = `faq-answer-${item.id}`;
                      const questionId = `faq-question-${item.id}`;
                      return (
                        <div
                          key={item.id}
                          itemScope
                          itemType="https://schema.org/Question"
                          className={cn(
                            "bg-white border rounded-2xl overflow-hidden transition-all duration-300",
                            isOpen
                              ? "border-[#48AEDD] shadow-lg ring-1 ring-[#48AEDD]/20"
                              : "border-slate-100 hover:border-slate-300 shadow-sm",
                          )}
                        >
                          <button
                            id={questionId}
                            onClick={() => toggleQuestion(item.id)}
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48AEDD] focus-visible:ring-offset-2"
                          >
                            <span
                              itemProp="name"
                              className={cn(
                                "font-bold text-base sm:text-lg pr-4 leading-snug",
                                isOpen ? "text-[#134467]" : "text-slate-700",
                              )}
                            >
                              {item.question}
                            </span>

                            <div
                              aria-hidden="true"
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0",
                                isOpen
                                  ? "bg-[#E53935] text-white rotate-180"
                                  : "bg-slate-100 text-slate-400",
                              )}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          </button>

                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={questionId}
                            itemScope
                            itemType="https://schema.org/Answer"
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              isOpen
                                ? "max-h-[600px] opacity-100"
                                : "max-h-0 opacity-0",
                            )}
                          >
                            <div className="p-5 pt-0 border-t border-slate-50">
                              <div
                                itemProp="text"
                                dangerouslySetInnerHTML={{
                                  __html: item.answer,
                                }}
                                className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
                              />

                              {item.tags && item.tags.length > 0 && (
                                <div
                                  className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50"
                                  aria-label="Related topics"
                                >
                                  {item.tags.map((tag, i) => (
                                    <span
                                      key={i}
                                      role="button"
                                      tabIndex={0}
                                      aria-label={`Search for ${tag}`}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" ||
                                          e.key === " "
                                        ) {
                                          setSearchQuery(tag);
                                        }
                                      }}
                                      className="px-2 py-0.5 bg-[#48AEDD]/10 text-[#134467] text-xs rounded-full font-medium cursor-pointer hover:bg-[#48AEDD]/20 transition"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery(tag);
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-20 opacity-60" role="status">
                <Search
                  className="w-16 h-16 mx-auto mb-4 text-slate-300"
                  aria-hidden="true"
                />
                <p className="text-xl font-bold text-slate-500">
                  No answers found
                </p>
                <p className="text-slate-400 mt-1">
                  Try adjusting your search terms or browse by category.
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[#48AEDD] underline text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
