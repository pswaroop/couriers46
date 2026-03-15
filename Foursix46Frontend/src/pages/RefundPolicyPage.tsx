import React from "react";
import {
  Receipt,
  RefreshCcw,
  AlertOctagon,
  Wallet,
  HelpCircle,
  CheckCircle,
  FileText,
  Truck,
  Clock,
  Shield,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function RefundPolicyPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. General Principle",
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            Operational planning begins immediately once a booking is made.
            Refund eligibility depends on whether a driver has been assigned,
            dispatched, or travelled.
          </p>
          <p className="font-medium text-[#134467]">
            All liability, claims, and compensation are governed by the RHA
            Conditions of Carriage 2024.
          </p>
        </div>
      ),
    },
    {
      icon: RefreshCcw,
      title: "2. Cancellations Before Dispatch",
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>
            A booking may be cancelled before a driver is allocated or
            dispatched.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Refunds may be issued minus an administrative fee.</li>
            <li>
              <strong>Admin fee:</strong> Up to £5.00 to cover booking &
              processing costs.
            </li>
          </ul>
          <p className="text-sm text-slate-500">
            Refunds are processed to the original payment method within 5–10
            business days.
          </p>
        </div>
      ),
    },
    {
      icon: Truck,
      title: "3. Cancellations After Assignment",
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>
            Once a driver has been allocated or started travelling to the
            collection point:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              A <strong>full refund is not available</strong>.
            </li>
            <li>
              A partial refund may be issued minus:
              <ul className="list-circle pl-5 mt-1">
                <li>Driver call-out fee</li>
                <li>Mileage already travelled</li>
                <li>Waiting time (if applicable)</li>
              </ul>
            </li>
          </ul>
          <p className="italic text-sm">
            This is permitted under the Carrier’s right to recover reasonable
            operational costs.
          </p>
        </div>
      ),
    },
    {
      icon: AlertOctagon,
      title: "4. Failed Collection",
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <div className="space-y-2">
          <p>A failed collection occurs when:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Goods are not ready</li>
            <li>Nobody is available at the collection point</li>
            <li>Incorrect/incomplete address</li>
            <li>Unsafe or inaccessible location</li>
          </ul>
          <div className="mt-2 bg-red-50 p-3 rounded-lg border border-red-100 text-red-800 text-sm">
            <strong>Result:</strong> No refund is provided. Re-collection can be
            arranged at additional cost. Drivers’ time and mileage are
            chargeable.
          </div>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "5. Delayed Deliveries",
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-bold text-[#134467]">5.1 Same-Day Deliveries</p>
            <p>
              Same-day delivery is not guaranteed unless expressly agreed in
              writing as a special service under RHA rules. Delays caused by
              traffic, weather, road closures, or incidents are not refundable.
            </p>
          </div>
          <div>
            <p className="font-bold text-[#134467]">
              5.2 Standard Deliveries (2–4 Days)
            </p>
            <p>
              Delivery times are estimates. Refunds are not given unless a delay
              is proven to be solely caused by FourSix46® negligence, not
              external conditions.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "6. Loss or Damage (RHA)",
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-3">
          <p>
            Customers must follow the{" "}
            <strong>RHA Conditions of Carriage 2024</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Damage/Shortage:</strong> Notice required within 7 days.
            </li>
            <li>
              <strong>Loss/Non-delivery:</strong> Notice required within RHA
              time limits.
            </li>
            <li>
              <strong>Liability Limit:</strong> £1,300 per tonne of gross weight
              (~£1.30 per kg).
            </li>
          </ul>
          <p className="text-sm">
            Liability excludes consequential loss, loss of profits, or special
            losses. Customers must arrange full-value insurance if needed.
          </p>
        </div>
      ),
    },
    {
      icon: Wallet,
      title: "7. Non-Refundable Situations",
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>No refund will be issued if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Customer provides incorrect information.</li>
            <li>The Goods are illegal, dangerous, or prohibited.</li>
            <li>Delivery is refused by the recipient.</li>
            <li>
              Delays arise from external factors (weather, traffic, incidents).
            </li>
            <li>The job is completed and then cancellation is requested.</li>
            <li>The Customer breaches the RHA Conditions or our Terms.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Building2,
      title: "8. Business (B2B) Customers",
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content:
        "Refunds for account customers follow this Policy and the RHA Conditions. Any credit notes issued will be applied to the business account balance.",
    },
    {
      icon: RefreshCcw,
      title: "9. Booking Changes",
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            Changes to collection time, delivery address, parcel details, or
            contact information may:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Not always be possible.</li>
            <li>Incur additional charges.</li>
            <li>Affect delivery times.</li>
          </ul>
          <p className="text-sm italic">
            If the change leads to cancellation, Sections 2–4 apply.
          </p>
        </div>
      ),
    },
    {
      icon: Receipt,
      title: "10. Refund Procedure",
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>
            To request a refund, contact us via the Contact Us page and include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Booking reference</li>
            <li>Reason for request</li>
            <li>Relevant documents (if applicable)</li>
          </ul>
          <p className="font-semibold text-[#E53935]">
            Approved refunds are issued within 5–10 business days.
          </p>
        </div>
      ),
    },
    {
      icon: AlertTriangle,
      title: "11. Right to Decline",
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>FourSix46® Global Ltd may refuse a refund if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Policy or RHA Conditions are breached.</li>
            <li>Fraudulent claims are detected.</li>
            <li>Goods fall under prohibited categories.</li>
            <li>Claims do not meet RHA time limits.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: CheckCircle,
      title: "12. Policy Updates",
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content:
        "This Policy may be updated. Continued use of our services confirms acceptance of the latest version.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 bg-white border-b border-[#48AEDD]/10">
        {/* Subtle Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-10 right-1/3 w-64 h-64 bg-[#48AEDD]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#E53935]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <div
            className={cn(
              "inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-[#134467]/10 shadow-sm mb-8",
              fadeInUp,
            )}
          >
            <Receipt className="w-4 h-4 text-[#48AEDD]" />
            <span className="text-[#48AEDD] font-bold text-xs tracking-widest uppercase">
              Customer Guarantee
            </span>
          </div>

          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight",
              fadeInUp,
              "animation-delay-100",
            )}
          >
            Refund & <span className="text-[#E53935]">Cancellation Policy</span>
          </h1>

          <p
            className={cn(
              "text-lg sm:text-xl text-slate-500 mb-4 max-w-2xl mx-auto font-medium",
              fadeInUp,
              "animation-delay-200",
            )}
          >
            All Carriage Subject to RHA Conditions of Carriage 2024.
          </p>
          <p
            className={cn(
              "text-sm text-slate-400",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            Last Updated: 25/11/2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div
          className={cn(
            "max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden",
            fadeInUp,
            "animation-delay-500",
          )}
        >
          {/* Intro Box - Sky Blue Background for Policy Notice (UPDATED) */}
          <div className="bg-[#48AEDD] p-8 sm:p-10 text-white">
            <div className="flex gap-4 items-start">
              <AlertOctagon className="w-6 h-6 text-[#F5EB18] flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-xl mb-2 text-[#F5EB18]">
                  Policy Overview
                </h2>
                <p className="text-white/90 leading-relaxed">
                  This Refund & Cancellation Policy applies to all services
                  provided by FourSix46® Global Ltd. Where there is any conflict
                  between this Policy and the RHA Conditions, the RHA Conditions
                  of Carriage 2024 shall prevail.
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
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                      section.bg,
                    )}
                  >
                    <section.icon
                      className="w-6 h-6"
                      style={{
                        color:
                          section.color === "#F5EB18"
                            ? "#dcb004"
                            : section.color,
                      }}
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
                <h3 className="text-lg font-bold text-[#134467]">
                  Need to request a refund?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Contact our support team with your Booking Reference.
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
}
