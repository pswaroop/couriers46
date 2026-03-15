import React from "react";
import { Cookie, ShieldCheck, Activity, Settings, Sliders, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp = "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function CookiesPage() {
  // Intro content
  const introContent = "This section provides comprehensive information about how our website uses cookies. Cookies are small text files stored on your device that help us provide a better user experience. They enable essential functionality, remember your preferences, and help us understand how you use our platform.";

  const sections = [
    {
      icon: ShieldCheck,
      title: "Essential Cookies",
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: "Required for basic website functionality, including authentication, security, and navigation. These cannot be disabled as they are necessary for the service to work properly and securely."
    },
    {
      icon: Activity,
      title: "Performance Cookies",
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: "Help us understand how visitors interact with our website by collecting anonymous analytics data. This helps us improve our platform's performance, identify issues, and enhance the overall user experience."
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: "Remember your preferences and settings to provide a personalized experience, such as language preferences, saved locations, and recent delivery addresses. Disabling these may reset your preferences."
    },
    {
      icon: Sliders,
      title: "Managing Cookies",
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: "You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, though this may impact your user experience. You can also use our cookie preference center to customize which optional cookies you accept."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 bg-white border-b border-[#48AEDD]/10">
        {/* Subtle Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-10 right-10 w-64 h-64 bg-[#F5EB18]/10 rounded-full blur-3xl" />
           <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#48AEDD]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <div className={cn("inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-[#48AEDD]/20 shadow-sm mb-8", fadeInUp)}>
            <Cookie className="w-4 h-4 text-[#48AEDD]" />
            <span className="text-[#48AEDD] font-bold text-xs tracking-widest uppercase">Data Transparency</span>
          </div>
          
          <h1 className={cn("text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight", fadeInUp, "animation-delay-100")}>
            Cookies <span className="text-[#E53935]">Policy</span>
          </h1>
          
          <p className={cn("text-lg sm:text-xl text-slate-500 mb-4 max-w-2xl mx-auto font-medium", fadeInUp, "animation-delay-200")}>
            How we use data to improve your experience.
          </p>
          <p className={cn("text-sm text-slate-400", fadeInUp, "animation-delay-300")}>
             Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className={cn(
            "max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden",
            fadeInUp, "animation-delay-500"
          )}>
          
          {/* Intro Box - Yellow Background (Requested) */}
          <div className="bg-[#F5EB18] p-8 sm:p-10 text-[#134467]">
            <div className="flex gap-4 items-start">
              <Info className="w-6 h-6 text-[#134467] flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-xl mb-2 text-[#134467]">What Are Cookies?</h2>
                <p className="text-[#134467]/90 leading-relaxed font-medium">
                  {introContent}
                </p>
              </div>
            </div>
          </div>

          {/* Policy Sections List */}
          <div className="p-8 sm:p-12 space-y-10">
            {sections.map((section, index) => (
              <section key={index} className="group">
                <div className="flex gap-4 items-start">
                  {/* Section Icon - Styled Container */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    section.bg
                  )}>
                    <section.icon 
                      className="w-6 h-6" 
                      style={{ color: section.color === "#F5EB18" ? "#dcb004" : section.color }} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#134467] mb-4 group-hover:text-[#E53935] transition-colors">
                      {section.title}
                    </h2>
                    <div className="text-slate-600 text-base leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
                
                {/* Divider */}
                {index !== sections.length - 1 && (
                  <div className="h-px w-full bg-slate-100 mt-10 ml-16" />
                )}
              </section>
            ))}
          </div>

          {/* Bottom Contact Section */}
          <div className="bg-slate-50 p-8 border-t border-slate-100">
             <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#48AEDD]">
                  <HelpCircle className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#134467]">Have questions about cookies?</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Contact our support team for data privacy enquiries.
                  </p>
               </div>
               <a 
                 href="/contact" 
                 className="px-6 py-3 bg-[#134467] text-white font-bold rounded-xl hover:bg-[#0f3652] transition-colors shadow-lg shadow-blue-900/10"
               >
                 Contact Support
               </a>
             </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};