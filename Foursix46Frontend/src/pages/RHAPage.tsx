import React from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Clock,
  Lock,
  Download,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function RhaConditionsPage() {
  const summaryPoints = [
    {
      title: "Our Responsibilities",
      icon: ShieldCheck,
      color: "#48AEDD", // Sky Blue
      points: [
        "Safe and professional transport of goods.",
        "Reasonable care while handling and carrying consignments.",
        "Delivery within agreed instructions.",
      ],
    },
    {
      title: "Your Responsibilities",
      icon: FileCheck,
      color: "#134467", // Navy
      points: [
        "Providing accurate descriptions, weights, and addresses.",
        "Ensuring goods are properly packaged.",
        "Declaring any dangerous goods.",
        "Arranging insurance for goods in transit.",
        "Checking goods upon delivery.",
      ],
    },
    {
      title: "Liability Limits",
      icon: Scale,
      color: "#E53935", // Red
      points: [
        "Maximum liability: £1,300 per tonne (≈ £1.30/kg).",
        "No liability for consequential, indirect or special losses.",
        "No liability for delays unless explicitly agreed in writing.",
      ],
    },
    {
      title: "Claims & Time Limits",
      icon: Clock,
      color: "#dcb004", // Yellow
      points: [
        "Damage must be reported within 7 days.",
        "Loss or non-delivery claims must be made within 28 days.",
        "Claims outside these windows cannot be accepted.",
      ],
    },
    {
      title: "Dangerous / Prohibited Goods",
      icon: AlertTriangle,
      color: "#E53935", // Red
      points: [
        "Customers must fully declare dangerous goods.",
        "Undeclared dangerous goods may be refused, destroyed or made safe at the customer's cost.",
      ],
    },
    {
      title: "Lien (Right to Hold Goods)",
      icon: Lock,
      color: "#134467", // Navy
      points: ["We may hold goods until all charges are paid."],
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans text-slate-800">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-24 pb-20 border-b border-slate-100 bg-slate-50/50">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          {/* Logo Container */}
          <div
            className={cn(
              "mx-auto w-28 h-28 mb-8 bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center",
              fadeInUp,
            )}
          >
            <img
              src="/RHA-LogoSquare.png"
              alt="RHA Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight leading-tight",
              fadeInUp,
              "animation-delay-100",
            )}
          >
            RHA Conditions of{" "}
            <span className="text-[#E53935]">Carriage 2024</span>
          </h1>

          <div
            className={cn(
              "inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-[#134467]/10 mb-6 shadow-sm",
              fadeInUp,
              "animation-delay-200",
            )}
          >
            <span className="text-[#134467] font-bold text-xs tracking-widest uppercase">
              Official Summary
            </span>
          </div>

          <p
            className={cn(
              "text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            FourSix46® Global Ltd (trading as FourSix46® Couriers) undertakes
            all carriage strictly under the Road Haulage Association's
            Conditions of Carriage 2024.
          </p>
          <p
            className={cn(
              " mt-4 text-sm text-slate-400",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            Last Updated by FourSix46®: {new Date().toLocaleDateString()} <br />
            This summary page is maintained by FourSix46®. The original RHA
            Conditions remain unchanged.
          </p>
        </div>
      </div>

      {/* --- CONTENT LIST (Open Style) --- */}
      <div className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {summaryPoints.map((section, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col md:flex-row gap-8 md:gap-12 items-start relative",
                fadeInUp,
              )}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              {/* Connector Line (except for last item) */}
              {index !== summaryPoints.length - 1 && (
                <div className="absolute left-[34px] top-20 bottom-[-40px] w-0.5 bg-slate-100 hidden md:block" />
              )}

              {/* Icon Column */}
              <div className="flex-shrink-0 relative">
                <div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center bg-white shadow-lg border border-slate-100 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <section.icon
                    className="w-8 h-8"
                    style={{ color: section.color }}
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 pt-2">
                <h3
                  className="text-2xl font-bold mb-6 flex items-center gap-3 transition-colors duration-300"
                  style={{
                    color:
                      section.color === "#dcb004" ? "#b39200" : section.color,
                  }} // darken yellow for text
                >
                  {section.title}
                </h3>

                <div className="grid sm:grid-cols-1 gap-4">
                  {section.points.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-colors duration-300"
                    >
                      <CheckCircle2
                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                        style={{
                          color:
                            section.color === "#dcb004"
                              ? "#dcb004"
                              : section.color,
                        }}
                      />
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DOWNLOAD SECTION (Light Theme) --- */}
        <div
          className={cn(
            "max-w-4xl mx-auto mt-24 text-center",
            fadeInUp,
            "animation-delay-700",
          )}
        >
          <div className="bg-white rounded-[3rem] p-10 sm:p-14 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
            {/* Soft Background Gradients */}
            <div className="absolute top-0 right-0 w-full h-5 bg-gradient-to-r from-[#48AEDD] via-[#F5EB18] to-[#E53935] rounded-t-[3rem]" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#48AEDD]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#E53935]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#134467]/5 text-[#134467] mb-6">
                <Download className="w-7 h-7" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#134467] mb-4">
                Official Documentation
              </h2>
              <p className="text-slate-500 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                For full legal details and comprehensive terms, please download
                the official RHA documents below.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                {/* Button 1 */}
                <a
                  href="/Documents/Conditions of Carriage 2024 - FourSix46® Global Ltd.pdf"
                  download="Conditions of Carriage 2024 - FourSix46® Global Ltd.pdf"
                  className="group flex items-center justify-center gap-3 bg-[#134467] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#134467] transition-all duration-300 shadow-lg shadow-[#134467]/20 hover:-translate-y-1"
                >
                  <Download className="w-5 h-5 text-[#F5EB18]" />
                  Conditions of Carriage
                </a>

                {/* Button 2 */}
                <a
                  href="/Documents/Explanatory Notes COC 2024.pdf"
                  download="Explanatory Notes COC 2024.pdf"
                  className="group flex items-center justify-center gap-3 bg-white text-[#134467] border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-[#134467] transition-all duration-300 hover:-translate-y-1"
                >
                  <Download className="w-5 h-5 text-[#48AEDD]" />
                  Explanatory Notes
                </a>
              </div>

              <p className="mt-10 text-xs text-slate-400 font-medium">
                By using our services, you agree to be bound by the RHA
                Conditions of Carriage 2024.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
