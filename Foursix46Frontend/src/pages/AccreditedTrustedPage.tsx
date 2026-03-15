import React from "react";
import { Shield, FileCheck, Truck, Lock, Building2, CheckCircle, Award, Target, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Smoother animation utility
const fadeInUp = "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function AccreditedTrustedPage() {

  // Bento Grid Data - Light, Vibrant, High Visibility
  const certifications = [
    {
      id: "rha",
      icon: Truck,
      title: "RHA Member",
      subtitle: "Approved & Certified",
      description: "Proud members of the Road Haulage Association (RHA), committed to maintaining the highest standards of safety, compliance, and professionalism across our logistics operations.",
      // Sky Blue Theme
      iconColor: "text-[#48AEDD]",
      bg: "bg-[#48AEDD]/5",
      border: "border-[#48AEDD]/20 hover:border-[#48AEDD]",
      className: "md:col-span-2 md:row-span-1"
    },
    {
      id: "cyber",
      icon: Lock,
      title: "Cyber Essentials",
      subtitle: "Secured & Protected",
      description: "Government-backed cybersecurity certification, assessed and verified by IASME, demonstrating protection against common cyber threats.",
      // Red Theme
      iconColor: "text-[#E53935]",
      bg: "bg-[#E53935]/5",
      border: "border-[#E53935]/20 hover:border-[#E53935]",
      className: "md:col-span-1 md:row-span-1"
    },
    {
      id: "insured",
      icon: Shield,
      title: "Fully Insured & Cyber Protected",
      subtitle: "For Public Liability & Cargo",
      description: "From goods in transit to digital operations, we maintain robust insurance coverage and cyber liability protection. Your shipments and sensitive business data are handled with the highest level of security and care.",
      // Yellow Theme
      iconColor: "text-[#dcb004]",
      bg: "bg-[#F5EB18]/10",
      border: "border-[#F5EB18]/40 hover:border-[#F5EB18]",
      className: "md:col-span-1 md:row-span-2"
    },
    {
      id: "ico",
      icon: FileCheck,
      title: "ICO Registered",
      subtitle: "Data Protection, Guaranteed!",
      description: "Registered with the Information Commissioner’s Office (ICO), demonstrating our commitment to data privacy and compliance with UK data protection laws.",
      // Green Theme
      iconColor: "text-[#48AEDD]",
      bg: "bg-[#B7D55E]/10",
      border: "border-[#B7D55E]/60 hover:border-[#B7D55E]",
      className: "md:col-span-2 md:row-span-1"
    },
    {
      id: "fsb",
      icon: Building2,
      title: "FSB Member",
      subtitle: "Supported & Approved",
      description: "Proudly supported by the FSB—backed by 51 years of expertise in strengthening UK businesses.",
      // Red Theme
      iconColor: "text-[#E53935]",
      bg: "bg-[#E53935]/5",
      border: "border-[#E53935]/20 hover:border-[#E53935]",
      className: "md:col-span-2 md:row-span-1"
    },
  ];

  const commitments = [
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for perfection in every mile we cover.",
      bg: "bg-white",
      iconBg: "bg-[#E53935]/10",
      iconColor: "text-[#E53935]",
      border: "border-slate-100 hover:border-[#E53935]",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(229,57,53,0.2)]"
    },
    {
      icon: Target,
      title: "Safety",
      description: "Strict protocols to protect your people and parcels.",
      bg: "bg-white",
      iconBg: "bg-[#48AEDD]/10",
      iconColor: "text-[#48AEDD]",
      border: "border-slate-100 hover:border-[#48AEDD]",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(72,174,221,0.2)]"
    },
    {
      icon: CheckCircle,
      title: "Reliability",
      description: "Delivering on our promises, on time, every time.",
      bg: "bg-white",
      iconBg: "bg-[#F5EB18]/20",
      iconColor: "text-[#dcb004]",
      border: "border-slate-100 hover:border-[#F5EB18]",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(245,235,24,0.2)]"
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans text-slate-800">

      {/* --- HERO HEADER --- */}
      <div className="relative pt-24 pb-20 overflow-hidden bg-slate-50/50 border-b border-slate-100">
        {/* Background Gradients - Light & Airy */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 sm:px-8 text-center max-w-4xl relative z-10">
          <span className={cn("inline-block py-1.5 px-4 rounded-full bg-[#48AEDD]/10 text-[#48AEDD] font-bold text-xs sm:text-sm mb-6 tracking-widest uppercase", fadeInUp)}>
            Trust & Compliance
          </span>
          <h1 className={cn("text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#48AEDD] mb-6 tracking-tight", fadeInUp, "animation-delay-100")}>
            Accredited &amp; <span className="text-[#E53935]">Trusted</span>
          </h1>
          <p className={cn("text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium", fadeInUp, "animation-delay-200")}>
            We believe in transparency. Our certifications and standards demonstrate our dedication to safety, quality, and accountability in every delivery.
          </p>
        </div>
      </div>

      {/* --- BENTO GRID SECTION --- */}
      <div className="container mx-auto px-6 sm:px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-6">

            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className={cn(
                  "relative group p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col justify-between",
                  cert.bg,
                  cert.border,
                  cert.className,
                  fadeInUp
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Decor Icon (Subtle) */}
                <cert.icon
                  className={cn(
                    "absolute -right-6 -bottom-6 w-40 h-40 opacity-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110",
                    cert.iconColor
                  )}
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                      <cert.icon className={cn("w-8 h-8", cert.iconColor)} />
                    </div>
                    <ArrowUpRight className={cn("w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0", cert.iconColor)} />
                  </div>

                  <h3 className="text-2xl font-bold text-[#134467] mb-1">
                    {cert.title}
                  </h3>
                  <p className={cn("text-sm font-bold uppercase tracking-wider mb-4 opacity-80", cert.iconColor)}>
                    {cert.subtitle}
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* --- COMMITMENTS SECTION (Light Cards) --- */}
      <div className="bg-white py-24 relative overflow-hidden border-t border-slate-100">
        {/* Decor */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5EB18]/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#48AEDD]/10 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6 sm:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className={cn("text-4xl sm:text-5xl font-extrabold mb-6 text-[#134467]", fadeInUp)}>
                Our Core Commitments
              </h2>
              <p className={cn("text-slate-500 max-w-2xl mx-auto text-lg font-medium", fadeInUp, "animation-delay-100")}>
                Beyond certifications, these are the values that drive our daily operations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {commitments.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-[2.5rem] p-10 text-center transition-all duration-500 border-2 flex flex-col items-center justify-center relative overflow-hidden group",
                    item.bg,
                    item.border,
                    item.shadow,
                    fadeInUp
                  )}
                  style={{ animationDelay: `${200 + (index * 150)}ms` }}
                >
                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110", item.iconBg)}>
                    <item.icon className={cn("w-10 h-10", item.iconColor)} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#134467]">{item.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}