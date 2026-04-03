// import {
//   House,
//   Truck,
//   Building2,
//   Send,
//   Info,
//   Phone,
//   Shield,
//   FileText,
//   Cookie,
//   Menu,
//   X,
//   HeartHandshake,
//   PoundSterling,
//   Star,
//   FileCheck,
//   Instagram,
//   Linkedin,
//   Youtube,
//   Facebook,
//   MessageCircle,
//   BookOpen,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";

// // Custom TikTok Icon Component (Authentic Look)
// const TiktokIcon = ({ className }: { className?: string }) => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className}
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
//   </svg>
// );

// const navItems = [
//   { id: "home", label: "Home", icon: House, path: "/" },
//   {
//     id: "become-driver",
//     label: "Drive with Route46",
//     icon: Truck,
//     path: "/become-driver",
//   },
//   {
//     id: "for-businesses",
//     label: "Join Our Courier Network",
//     icon: Building2,
//     path: "/for-businesses",
//   },
//   { id: "quick-quote", label: "Quick Quote", icon: Send, path: "/quick-quote" },
// ];

// const infoItems = [
//   { id: "about", label: "About", icon: Info, path: "/about" },
//   {
//     id: "services",
//     label: "Services",
//     icon: HeartHandshake,
//     path: "/services",
//   },
//   { id: "sectors", label: "Sectors", icon: Building2, path: "/sectors" },
//   { id: "locations", label: "Locations", icon: MapPin, path: "/locations" },
//   { id: "blogs", label: "Blogs", icon: BookOpen, path: "/blog" },
//   {
//     id: "testimonials",
//     label: "Testimonials",
//     icon: Star,
//     path: "/testimonials",
//   },
//   { id: "contact", label: "Contact", icon: Phone, path: "/contact" },
// ];

// const legalItems = [
//   {
//     id: "rha-conditions",
//     label: "RHA Summary",
//     icon: FileCheck,
//     path: "/rha-summary",
//   },
//   {
//     id: "compliance",
//     label: "Accredited & Trusted",
//     icon: FileCheck,
//     path: "/accredited-trusted",
//   },
// ];

// const socialItems = [
//   {
//     id: "tiktok",
//     label: "TikTok",
//     icon: TiktokIcon,
//     path: "https://www.tiktok.com/@route46_couriers",
//     color: "hover:text-[#000000] hover:bg-[#00f2ea]/20",
//   },
//   {
//     id: "instagram",
//     label: "Instagram",
//     icon: Instagram,
//     path: "https://www.instagram.com/route46couriers/",
//     color: "hover:text-[#E1306C] hover:bg-[#E1306C]/20",
//   },
//   {
//     id: "whatsapp",
//     label: "WhatsApp",
//     icon: MessageCircle,
//     path: "https://wa.me/447393363802",
//     color: "hover:text-[#25D366] hover:bg-[#25D366]/20",
//   },
//   {
//     id: "facebook",
//     label: "Facebook",
//     icon: Facebook,
//     path: "https://www.facebook.com/route46couriers/",
//     color: "hover:text-[#1877F2] hover:bg-[#1877F2]/20",
//   },
//   {
//     id: "youtube",
//     label: "YouTube",
//     icon: Youtube,
//     path: "https://www.youtube.com/@Route46Couriers",
//     color: "hover:text-[#FF0000] hover:bg-[#FF0000]/20",
//   },
//   {
//     id: "linkedin",
//     label: "LinkedIn",
//     icon: Linkedin,
//     path: "https://www.linkedin.com/company/foursix46-couriers/",
//     color: "hover:text-[#0077b5] hover:bg-[#0077b5]/20",
//   },
//   {
//     id: "x",
//     label: "X",
//     icon: X,
//     path: "https://x.com/Route46Couriers",
//     color: "hover:text-black hover:bg-black/20",
//   },
// ];

// export const Navigation = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogoClick = () => {
//     navigate("/");
//     window.scrollTo(0, 0);
//     setMobileMenuOpen(false);
//   };

//   const isActive = (path: string) => location.pathname === path;

//   const handleSocialClick = () => {
//     setMobileMenuOpen(false);
//     sessionStorage.setItem("refreshOnReturn", "true");
//   };

//   // Refresh page on return from social links (Safari fix)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         if (sessionStorage.getItem("refreshOnReturn") === "true") {
//           sessionStorage.removeItem("refreshOnReturn");
//           window.location.reload();
//         }
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // Lock body scroll when mobile menu is open
//   useEffect(() => {
//     if (mobileMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [mobileMenuOpen]);

//   // Listen for external close events (e.g. from Chatbot)
//   useEffect(() => {
//     const handleCloseMenu = () => setMobileMenuOpen(false);
//     window.addEventListener("closeMobileMenu", handleCloseMenu);
//     return () => window.removeEventListener("closeMobileMenu", handleCloseMenu);
//   }, []);

//   const desktopLinkClass = (active: boolean) =>
//     cn(
//       "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
//       active
//         ? "bg-red-50 text-[#E53935] font-bold shadow-[0_4px_20px_rgba(229,57,53,0.15)]"
//         : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
//     );

//   return (
//     <>
//       {/* ✅ FIX 2: Removed direction:rtl hack — caused Safari layout bugs */}
//       {/* ✅ FIX 3: Added -webkit- prefixed keyframes for Safari desktop */}
//       <style>{`
//         @-webkit-keyframes fadeIn {
//           from { opacity: 0; -webkit-transform: translateY(10px); transform: translateY(10px); }
//           to   { opacity: 1; -webkit-transform: translateY(0);    transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           -webkit-animation: fadeIn 0.5s ease-out forwards;
//           animation: fadeIn 0.5s ease-out forwards;
//         }

//         /* Subtle scrollbar — no direction:rtl needed */
//         .nav-scroll-container {
//           overscroll-behavior: contain;
//         }
//         .nav-scroll-container::-webkit-scrollbar {
//           width: 5px;
//           background-color: transparent;
//         }
//         .nav-scroll-container::-webkit-scrollbar-track {
//           background-color: transparent;
//         }
//         .nav-scroll-container::-webkit-scrollbar-thumb {
//           background-color: transparent;
//           border-radius: 20px;
//         }
//         .nav-scroll-container:hover::-webkit-scrollbar-thumb {
//           background-color: rgba(0, 0, 0, 0.1);
//         }
//       `}</style>

//       {/* DESKTOP NAVIGATION */}
//       {/* ✅ FIX 1: Separated backdrop-blur from overflow-y-auto — Safari drops blur when both are on same element */}
//       <nav className="hidden lg:flex fixed right-0 top-0 h-screen w-72 z-50 flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.05)]">
//         {/* Blurred background layer — no overflow here, Safari safe */}
//         <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl -z-10 pointer-events-none" />

//         {/* Scrollable content layer — no backdrop-blur here */}
//         <div className="flex-1 overflow-y-auto nav-scroll-container w-full">
//           <div className="p-6 w-full">
//             {/* Branding Header */}
//             <div
//               className="text-center mb-10 animate-fade-in pt-4 cursor-pointer"
//               onClick={handleLogoClick}
//             >
//               <h1 className="text-2xl font-extrabold text-[#48AEDD] mb-2 tracking-tight">
//                 Route<span className="text-[#F5EB18]">46</span>
//               </h1>
//               <div className="h-1 w-16 bg-[#F5EB18] mx-auto rounded-full mb-2"></div>
//               <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">
//                 Logistics & Couriers
//               </p>
//             </div>

//             {/* Main Navigation */}
//             <div className="mb-8">
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
//                 Main Menu
//               </h3>
//               <ul className="space-y-2">
//                 {navItems.map((item, idx) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li
//                       key={item.id}
//                       className="animate-fade-in"
//                       style={{
//                         animationDelay: `${idx * 50}ms`,
//                         opacity: 0,
//                         animationFillMode: "forwards",
//                       }}
//                     >
//                       <NavLink
//                         to={item.path}
//                         className={desktopLinkClass(active)}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
//                             active
//                               ? "text-[#E53935]"
//                               : "text-gray-400 group-hover:text-[#E53935]",
//                           )}
//                         />
//                         <span className="text-sm relative z-10">
//                           {item.label}
//                         </span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Legal */}
//             <div className="mb-8">
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
//                 Legal
//               </h3>
//               <ul className="space-y-2">
//                 {legalItems.map((item) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li key={item.id}>
//                       <NavLink
//                         to={item.path}
//                         className={cn(
//                           "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
//                           active
//                             ? "bg-yellow-50 text-[#dcb004] font-bold shadow-[0_4px_20px_rgba(220,176,4,0.15)]"
//                             : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
//                         )}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
//                             active
//                               ? "text-[#dcb004]"
//                               : "text-gray-400 group-hover:text-[#dcb004]",
//                           )}
//                         />
//                         <span className="text-sm relative z-10">
//                           {item.label}
//                         </span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Info Pages */}
//             <div className="mb-8">
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
//                 Information
//               </h3>
//               <ul className="space-y-2">
//                 {infoItems.map((item) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li key={item.id}>
//                       <NavLink
//                         to={item.path}
//                         className={cn(
//                           "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
//                           active
//                             ? "bg-blue-50 text-[#48AEDD] font-bold shadow-[0_4px_20px_rgba(72,174,221,0.15)]"
//                             : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
//                         )}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
//                             active
//                               ? "text-[#48AEDD]"
//                               : "text-gray-400 group-hover:text-[#48AEDD]",
//                           )}
//                         />
//                         <span className="text-sm relative z-10">
//                           {item.label}
//                         </span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Social Media */}
//             <div className="mb-8">
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest opacity-80">
//                 The Route46{" "}
//                 <span className="text-[#E53935] text-[12px]">Verse</span>
//               </h3>
//               <div className="grid grid-cols-4 gap-2 px-1">
//                 {socialItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <a
//                       key={item.id}
//                       href={item.path}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={cn(
//                         "flex items-center justify-center aspect-square rounded-2xl bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100 hover:shadow-md",
//                         item.color,
//                       )}
//                       aria-label={item.label}
//                     >
//                       <Icon className="w-5 h-5 text-gray-400 transition-colors group-hover:text-inherit" />
//                     </a>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="h-10"></div>
//           </div>
//         </div>
//       </nav>

//       {/* MOBILE LAYOUT */}

//       {/* Mobile Header */}
//       <div
//         className={cn(
//           "lg:hidden fixed top-4 left-4 right-4 z-50 transition-all duration-300",
//           mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100",
//         )}
//       >
//         <div className="flex items-center justify-between bg-white/95 backdrop-blur-3xl px-5 py-3 rounded-2xl shadow-lg border border-white/50">
//           {/* ── Brand lockup ── */}
//           <div
//             className="flex items-center gap-3 cursor-pointer"
//             onClick={handleLogoClick}
//           >
//             <img
//               src="/route46logo.png"
//               alt="Route46 Logo"
//               className="w-11 h-11 object-contain drop-shadow-md flex-shrink-0"
//             />

//             {/* Yellow separator */}
//             <div
//               className="h-9 w-[2px] rounded-full bg-[#f5eb18]
//         shadow-[0_0_8px_rgba(245,235,24,0.5)] flex-shrink-0"
//             />

//             {/* Text */}
//             <div className="flex flex-col justify-center">
//               <span
//                 className="text-base font-black text-[#134467] tracking-tight
//           leading-none whitespace-nowrap"
//               >
//                 Route46 Couriers
//               </span>
//               <span
//                 className="text-[0.55rem] font-bold text-[#48AEDD]
//           tracking-[0.18em] uppercase leading-tight mt-0.5 whitespace-nowrap"
//               >
//                 The Courier with a difference
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//             aria-label="Open navigation menu"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity touch-none cursor-pointer"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Mobile Sidebar - Right Side */}
//       {/* ✅ FIX 4: Removed will-change-transform + transform-gpu — broke z-index stacking in Safari */}
//       {/* ✅ FIX 5: Added h-screen as fallback before h-[100dvh] for Safari < 15.4 */}
//       <nav
//         className={cn(
//           "lg:hidden fixed right-0 top-0 h-screen h-[100dvh] w-[280px] bg-white/95 shadow-2xl z-[70] flex-col overflow-y-auto transition-transform duration-300 ease-in-out",
//           mobileMenuOpen ? "translate-x-0" : "translate-x-full",
//         )}
//       >
//         <div className="p-6 relative min-h-full pb-32">
//           <div className="flex items-center justify-between mb-10 relative z-10">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#F5EB18] rounded-lg flex items-center justify-center text-black shadow-sm">
//                 <Truck className="w-5 h-5" />
//               </div>
//               <span className="text-[#48AEDD] font-bold text-xl">
//                 Route<span className="text-[#E53935]">46</span>
//               </span>
//             </div>
//             <button
//               onClick={() => setMobileMenuOpen(false)}
//               className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="Close navigation menu"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="space-y-8">
//             {/* Mobile Main Nav */}
//             <div>
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
//                 Main Menu
//               </h3>
//               <ul className="space-y-1">
//                 {navItems.map((item) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li key={item.id}>
//                       <NavLink
//                         to={item.path}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={cn(
//                           "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
//                           active
//                             ? "bg-red-50 text-[#E53935] font-bold shadow-sm"
//                             : "text-gray-700 hover:bg-gray-50 font-medium",
//                         )}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5",
//                             active ? "text-[#E53935]" : "text-gray-500",
//                           )}
//                         />
//                         <span className="text-sm">{item.label}</span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Mobile Legal */}
//             <div>
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
//                 Legal
//               </h3>
//               <ul className="space-y-1">
//                 {legalItems.map((item) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li key={item.id}>
//                       <NavLink
//                         to={item.path}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={cn(
//                           "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
//                           active
//                             ? "bg-yellow-50 text-[#dcb004] font-bold shadow-sm"
//                             : "text-gray-700 hover:bg-gray-50 font-medium",
//                         )}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5",
//                             active ? "text-[#dcb004]" : "text-gray-500",
//                           )}
//                         />
//                         <span className="text-sm">{item.label}</span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Mobile Information */}
//             <div>
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
//                 Information
//               </h3>
//               <ul className="space-y-1">
//                 {infoItems.map((item) => {
//                   const Icon = item.icon;
//                   const active = isActive(item.path);
//                   return (
//                     <li key={item.id}>
//                       <NavLink
//                         to={item.path}
//                         onClick={() => setMobileMenuOpen(false)}
//                         className={cn(
//                           "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
//                           active
//                             ? "bg-blue-50 text-[#48AEDD] font-bold shadow-sm"
//                             : "text-gray-700 hover:bg-gray-50 font-medium",
//                         )}
//                       >
//                         <Icon
//                           className={cn(
//                             "w-5 h-5",
//                             active ? "text-[#48AEDD]" : "text-gray-500",
//                           )}
//                         />
//                         <span className="text-sm">{item.label}</span>
//                       </NavLink>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Mobile Social */}
//             <div>
//               <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest opacity-80">
//                 The Route46{" "}
//                 <span className="text-[#E53935] text-[12px]">Verse</span>
//               </h3>
//               <div className="grid grid-cols-4 gap-2 px-1">
//                 {socialItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <a
//                       key={item.id}
//                       href={item.path}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       onClick={handleSocialClick}
//                       className={cn(
//                         "flex items-center justify-center aspect-square rounded-xl bg-gray-50 border border-gray-100 shadow-sm active:scale-95 transition-all",
//                         item.color,
//                       )}
//                       aria-label={item.label}
//                     >
//                       <Icon className="w-5 h-5 text-gray-600 transition-colors group-hover:text-inherit" />
//                     </a>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Bottom Bar */}
//       <nav className="lg:hidden fixed bottom-0 left-0 w-full h-auto bg-white/95 backdrop-blur-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 border-t border-white/50 safe-area-pb">
//         <div className="px-2 py-2">
//           <ul className="flex flex-row justify-around items-center w-full">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.path);
//               return (
//                 <li key={item.id} className="flex-1">
//                   <NavLink
//                     to={item.path}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className={cn(
//                       "w-full flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 text-center group relative overflow-hidden",
//                       active
//                         ? "text-[#E53935]"
//                         : "text-gray-500 hover:text-gray-700 active:scale-95",
//                     )}
//                   >
//                     <Icon
//                       className={cn(
//                         "w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300",
//                         active
//                           ? "scale-110 drop-shadow-sm"
//                           : "group-hover:scale-110",
//                       )}
//                     />
//                     <span
//                       className={cn(
//                         "font-bold text-[10px] sm:text-xs relative z-10 transition-all duration-300 tracking-wide",
//                         active ? "translate-y-0.5" : "",
//                       )}
//                     >
//                       {item.label}
//                     </span>
//                   </NavLink>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </nav>
//     </>
//   );
// };
import {
  House,
  Truck,
  Building2,
  Send,
  Info,
  Phone,
  Shield,
  FileText,
  Cookie,
  Menu,
  X,
  HeartHandshake,
  PoundSterling,
  Star,
  FileCheck,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  MessageCircle,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

// Custom TikTok Icon Component (Authentic Look)
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const navItems = [
  { id: "home", label: "Home", icon: House, path: "/" },
  {
    id: "become-driver",
    label: "Drive with Route46",
    icon: Truck,
    path: "/become-driver",
  },
  {
    id: "for-businesses",
    label: "Join Our Courier Network",
    icon: Building2,
    path: "/for-businesses",
  },
  { id: "quick-quote", label: "Quick Quote", icon: Send, path: "/quick-quote" },
];

const infoItems = [
  { id: "about", label: "About", icon: Info, path: "/about" },
  {
    id: "services",
    label: "Services",
    icon: HeartHandshake,
    path: "/services",
  },
  { id: "sectors", label: "Sectors", icon: Building2, path: "/sectors" },
  { id: "locations", label: "Locations", icon: MapPin, path: "/locations" },
  { id: "blogs", label: "Blogs", icon: BookOpen, path: "/blog" },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: Star,
    path: "/testimonials",
  },
  { id: "contact", label: "Contact", icon: Phone, path: "/contact" },
];

const legalItems = [
  {
    id: "rha-conditions",
    label: "RHA Summary",
    icon: FileCheck,
    path: "/rha-summary",
  },
  {
    id: "compliance",
    label: "Accredited & Trusted",
    icon: FileCheck,
    path: "/accredited-trusted",
  },
  {
    id: "payments",
    label: "Secure Payment Portal",
    icon: CreditCard,
    path: "/pay",
  },
];

const socialItems = [
  {
    id: "tiktok",
    label: "TikTok",
    icon: TiktokIcon,
    path: "https://www.tiktok.com/@route46_couriers",
    color: "hover:text-[#000000] hover:bg-[#00f2ea]/20",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    path: "https://www.instagram.com/route46couriers/",
    color: "hover:text-[#E1306C] hover:bg-[#E1306C]/20",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    path: "https://wa.me/447393363802",
    color: "hover:text-[#25D366] hover:bg-[#25D366]/20",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    path: "https://www.facebook.com/route46couriers/",
    color: "hover:text-[#1877F2] hover:bg-[#1877F2]/20",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    path: "https://www.youtube.com/@Route46Couriers",
    color: "hover:text-[#FF0000] hover:bg-[#FF0000]/20",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    path: "https://www.linkedin.com/company/foursix46-couriers/",
    color: "hover:text-[#0077b5] hover:bg-[#0077b5]/20",
  },
  {
    id: "x",
    label: "X",
    icon: X,
    path: "https://x.com/Route46Couriers",
    color: "hover:text-black hover:bg-black/20",
  },
];

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSocialClick = () => {
    setMobileMenuOpen(false);
    sessionStorage.setItem("refreshOnReturn", "true");
  };

  // Refresh page on return from social links (Safari fix)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (sessionStorage.getItem("refreshOnReturn") === "true") {
          sessionStorage.removeItem("refreshOnReturn");
          window.location.reload();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Listen for external close events (e.g. from Chatbot)
  useEffect(() => {
    const handleCloseMenu = () => setMobileMenuOpen(false);
    window.addEventListener("closeMobileMenu", handleCloseMenu);
    return () => window.removeEventListener("closeMobileMenu", handleCloseMenu);
  }, []);

  const desktopLinkClass = (active: boolean) =>
    cn(
      "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
      active
        ? "bg-red-50 text-[#E53935] font-bold shadow-[0_4px_20px_rgba(229,57,53,0.15)]"
        : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
    );

  return (
    <>
      <style>{`
        @-webkit-keyframes fadeIn {
          from { opacity: 0; -webkit-transform: translateY(10px); transform: translateY(10px); }
          to   { opacity: 1; -webkit-transform: translateY(0);    transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          -webkit-animation: fadeIn 0.5s ease-out forwards;
          animation: fadeIn 0.5s ease-out forwards;
        }
        .nav-scroll-container {
          overscroll-behavior: contain;
        }
        .nav-scroll-container::-webkit-scrollbar {
          width: 5px;
          background-color: transparent;
        }
        .nav-scroll-container::-webkit-scrollbar-track {
          background-color: transparent;
        }
        .nav-scroll-container::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 20px;
        }
        .nav-scroll-container:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden lg:flex fixed right-0 top-0 h-screen w-72 z-50 flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.05)]">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl -z-10 pointer-events-none" />
        <div className="flex-1 overflow-y-auto nav-scroll-container w-full">
          <div className="p-6 w-full">
            {/* Branding Header */}
            <div
              className="text-center mb-10 animate-fade-in pt-4 cursor-pointer"
              onClick={handleLogoClick}
            >
              <h1 className="text-2xl font-extrabold text-[#48AEDD] mb-2 tracking-tight">
                Route<span className="text-[#F5EB18]">46</span>
              </h1>
              <div className="h-1 w-16 bg-[#F5EB18] mx-auto rounded-full mb-2"></div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">
                Logistics & Couriers
              </p>
            </div>

            {/* Main Navigation */}
            <div className="mb-8">
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
                Main Menu
              </h3>
              <ul className="space-y-2">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li
                      key={item.id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }}
                    >
                      <NavLink
                        to={item.path}
                        className={desktopLinkClass(active)}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                            active
                              ? "text-[#E53935]"
                              : "text-gray-400 group-hover:text-[#E53935]",
                          )}
                        />
                        <span className="text-sm relative z-10">
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Legal */}
            <div className="mb-8">
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
                Legal
              </h3>
              <ul className="space-y-2">
                {legalItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
                          active
                            ? "bg-yellow-50 text-[#dcb004] font-bold shadow-[0_4px_20px_rgba(220,176,4,0.15)]"
                            : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                            active
                              ? "text-[#dcb004]"
                              : "text-gray-400 group-hover:text-[#dcb004]",
                          )}
                        />
                        <span className="text-sm relative z-10">
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Info Pages */}
            <div className="mb-8">
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest uppercase opacity-80">
                Information
              </h3>
              <ul className="space-y-2">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
                          active
                            ? "bg-blue-50 text-[#48AEDD] font-bold shadow-[0_4px_20px_rgba(72,174,221,0.15)]"
                            : "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-600 hover:text-black font-medium",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                            active
                              ? "text-[#48AEDD]"
                              : "text-gray-400 group-hover:text-[#48AEDD]",
                          )}
                        />
                        <span className="text-sm relative z-10">
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Social Media */}
            <div className="mb-8">
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-4 px-4 tracking-widest opacity-80">
                The Route46{" "}
                <span className="text-[#E53935] text-[12px]">Verse</span>
              </h3>
              <div className="grid grid-cols-4 gap-2 px-1">
                {socialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center aspect-square rounded-2xl bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100 hover:shadow-md",
                        item.color,
                      )}
                      aria-label={item.label}
                    >
                      <Icon className="w-5 h-5 text-gray-400 transition-colors group-hover:text-inherit" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="h-10"></div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE LAYOUT ── */}

      {/* Mobile Header — hamburger only */}
      <div
        className={cn(
          "lg:hidden fixed top-4 right-4 z-50 transition-all duration-300",
          mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-3 bg-white/95 backdrop-blur-3xl rounded-2xl shadow-lg border border-white/50 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all duration-200"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity touch-none cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Right Side */}
      <nav
        className={cn(
          "lg:hidden fixed right-0 top-0 h-screen h-[100dvh] w-[280px] bg-white/95 shadow-2xl z-[70] flex-col overflow-y-auto transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-6 relative min-h-full pb-32">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5EB18] rounded-lg flex items-center justify-center text-black shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[#48AEDD] font-bold text-xl">
                Route<span className="text-[#E53935]">46</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Mobile Main Nav */}
            <div>
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
                Main Menu
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
                          active
                            ? "bg-red-50 text-[#E53935] font-bold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 font-medium",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            active ? "text-[#E53935]" : "text-gray-500",
                          )}
                        />
                        <span className="text-sm">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Legal */}
            <div>
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
                Legal
              </h3>
              <ul className="space-y-1">
                {legalItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
                          active
                            ? "bg-yellow-50 text-[#dcb004] font-bold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 font-medium",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            active ? "text-[#dcb004]" : "text-gray-500",
                          )}
                        />
                        <span className="text-sm">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Information */}
            <div>
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest uppercase opacity-80">
                Information
              </h3>
              <ul className="space-y-1">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left",
                          active
                            ? "bg-blue-50 text-[#48AEDD] font-bold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 font-medium",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            active ? "text-[#48AEDD]" : "text-gray-500",
                          )}
                        />
                        <span className="text-sm">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Social */}
            <div>
              <h3 className="text-[#48AEDD] text-[11px] font-bold mb-3 px-2 tracking-widest opacity-80">
                The Route46{" "}
                <span className="text-[#E53935] text-[12px]">Verse</span>
              </h3>
              <div className="grid grid-cols-4 gap-2 px-1">
                {socialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleSocialClick}
                      className={cn(
                        "flex items-center justify-center aspect-square rounded-xl bg-gray-50 border border-gray-100 shadow-sm active:scale-95 transition-all",
                        item.color,
                      )}
                      aria-label={item.label}
                    >
                      <Icon className="w-5 h-5 text-gray-600 transition-colors group-hover:text-inherit" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-auto bg-white/95 backdrop-blur-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 border-t border-white/50 safe-area-pb">
        <div className="px-2 py-2">
          <ul className="flex flex-row justify-around items-center w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.id} className="flex-1">
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "w-full flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 text-center group relative overflow-hidden",
                      active
                        ? "text-[#E53935]"
                        : "text-gray-500 hover:text-gray-700 active:scale-95",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300",
                        active
                          ? "scale-110 drop-shadow-sm"
                          : "group-hover:scale-110",
                      )}
                    />
                    <span
                      className={cn(
                        "font-bold text-[10px] sm:text-xs relative z-10 transition-all duration-300 tracking-wide",
                        active ? "translate-y-0.5" : "",
                      )}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};
