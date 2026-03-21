import React from "react";
import {
  Scale,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Info,
  BookOpen,
  Truck,
  UserCheck,
  Package,
  AlertCircle,
  CreditCard,
  ShieldAlert,
  FileWarning,
  Lock,
  Users,
  CloudLightning,
  Gavel,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function TermsPage() {
  // Legal content data structure with specific icons and colors
  const legalSections = [
    {
      title: "1. Introduction",
      icon: Info,
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            <strong className="text-[#134467]">FourSix46® Global Ltd</strong>,
            trading as{" "}
            <strong className="text-[#134467]">Route46 Couriers</strong>,
            undertakes all carriage and related services strictly under the{" "}
            <strong className="text-[#E53935]">
              Road Haulage Association (RHA) Conditions of Carriage 2024
            </strong>
            .
          </p>
          <p>
            All transport and delivery services are undertaken in accordance
            with these industry-standard conditions, which set out the rights,
            responsibilities and liability limits applicable to UK road freight
            operations.
          </p>
          <p>
            By booking a delivery, opening an account, or consigning goods, the
            Customer confirms{" "}
            <strong className="text-[#134467]">acceptance</strong> of the RHA
            Conditions of Carriage 2024.
          </p>
          <p className="italic text-sm">
            A full copy of the RHA Conditions is available upon request.
          </p>
          <p>
            These Terms and Conditions govern the provision of courier,
            transport, and related logistics services oered by FourSix46® Global
            Ltd, trading as Route46 Couriers, within the United Kingdom. All
            carriage and delivery services arranged by Route46 Couriers are
            undertaken strictly in accordance with the Road Haulage Association
            (RHA) Conditions of Carriage 2024, which set out the standard terms,
            responsibilities, and liability limits applicable to road freight
            operations in the UK. By requesting a delivery quotation, booking a
            shipment, opening an account, or consigning goods for transport, the
            customer conrms their acceptance of these Terms and Conditions and
            the applicable RHA Conditions of Carriage 2024. No additional or
            alternative terms shall apply unless expressly agreed in writing and
            signed by an authorised director of FourSix46® Global Ltd. A full
            copy of the RHA Conditions of Carriage 2024 is available upon
            request.
          </p>
        </div>
      ),
    },
    {
      title: "2. Definitions",
      icon: BookOpen,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>
            The definitions used in these Terms correspond to those in the RHA
            Conditions, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>“Carrier”</strong> – Route46 Global Ltd
            </li>
            <li>
              <strong>“Customer”</strong> – Any person or business using the
              Carrier’s services
            </li>
            <li>
              <strong>“Consignment”</strong> – Goods carried at one time under
              one contract
            </li>
            <li>
              <strong>“Goods”</strong> – Items accepted for carriage
            </li>
            <li>
              <strong>“Subcontractor”</strong> – Any third party engaged to
              perform carriage
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "3. Governing Conditions",
      icon: Scale,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            3.1 All services are supplied under the{" "}
            <strong className="text-[#134467]">
              RHA Conditions of Carriage 2024
            </strong>
            , which take precedence over all other terms including Customer
            terms.
          </li>
          <li>
            3.2 No employee, contractor, or agent has authority to{" "}
            <strong className="text-[#134467]">vary these Conditions</strong>.
          </li>
        </ul>
      ),
    },
    {
      title: "4. Carrier’s Status",
      icon: ShieldCheck,
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            4.1 The Carrier is{" "}
            <strong className="text-[#E53935]">not a common carrier</strong> and
            may refuse goods at its discretion.
          </li>
          <li>
            4.2 The Carrier may{" "}
            <strong className="text-[#134467]">subcontract</strong> the whole or
            any part of the carriage in accordance with the RHA Conditions.
          </li>
        </ul>
      ),
    },
    {
      title: "5. Customer Obligations",
      icon: UserCheck,
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            The Customer must comply with the responsibilities outlined in the
            RHA Conditions, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Accurate description</strong> of Goods
            </li>
            <li>
              <strong>Appropriate packaging</strong>
            </li>
            <li>
              <strong>Correct addresses</strong> and documentation
            </li>
            <li>
              Compliance with <strong>UK laws</strong> and transport regulations
            </li>
            <li>
              Proper declaration of{" "}
              <strong>Hazardous or Dangerous Goods</strong>
            </li>
            <li>
              Arranging <strong>full-value insurance</strong> for the Goods
            </li>
          </ul>
          <p className="mt-2 italic text-slate-500">
            The Customer is responsible for any consequences arising from
            incorrect information or insufficient packaging.
          </p>
        </div>
      ),
    },
    {
      title: "6. Dangerous or Prohibited Goods",
      icon: AlertTriangle,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-4">
          <p>
            Unless agreed in writing, the Carrier{" "}
            <strong className="text-[#E53935]">does not accept</strong>:
          </p>
          <div className="grid sm:grid-cols-2 gap-2 pl-5">
            <ul className="list-disc space-y-1">
              <li>
                <strong>Dangerous goods</strong>
              </li>
              <li>Hazardous, explosive, toxic, or flammable items</li>
              <li>
                <strong>Cash</strong>
              </li>
              <li>High-value jewellery</li>
            </ul>
            <ul className="list-disc space-y-1">
              <li>Animals or livestock</li>
              <li>Controlled or illegal substances</li>
              <li>
                Items <strong>prohibited by law</strong>
              </li>
            </ul>
          </div>
          {/* Alert Box */}
          <div className="bg-[#E53935]/5 p-4 rounded-lg border border-[#E53935]/20">
            <p className="font-semibold text-[#E53935] mb-2">
              RHA Conditions Notice:
            </p>
            <p className="text-slate-700 text-sm">
              The Carrier may refuse, remove, make safe, render harmless, or
              destroy any <strong>undeclared dangerous goods</strong>, with all
              costs payable by the Customer.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "7. Packaging",
      icon: Package,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>Packaging responsibilities follow RHA rules:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The Customer must ensure Goods are{" "}
              <strong className="text-[#134467]">
                securely and adequately packaged
              </strong>
              .
            </li>
            <li>
              The Carrier is{" "}
              <strong className="text-[#E53935]">not liable</strong> for loss or
              damage caused by <strong>insufficient packaging</strong>.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "8. Collection, Carriage & Delivery",
      icon: Truck,
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            8.1 Times for collection or delivery are{" "}
            <strong className="text-[#E53935]">not guaranteed</strong> unless
            expressly agreed in writing as a special contractual service under
            the RHA Conditions.
          </li>
          <li>
            8.2 Delivery may be made to any person appearing{" "}
            <strong className="text-[#134467]">authorised</strong> at the
            delivery address.
          </li>
          <li>
            8.3 Undelivered goods will be handled in accordance with the RHA
            Conditions (including storage, return, or disposal).
          </li>
        </ul>
      ),
    },
    {
      title: "9. Undelivered, Unclaimed, or Rejected Goods",
      icon: AlertCircle,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>If the Carrier cannot deliver Goods:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Carrier will attempt to contact the Customer;</li>
            <li>
              Goods may be held, returned, stored, or sold after the RHA notice
              period;
            </li>
            <li>
              All costs associated with{" "}
              <strong className="text-[#134467]">
                storage, return, or disposal
              </strong>{" "}
              are payable by the Customer.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "10. Charges & Payment Terms",
      icon: CreditCard,
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            10.1 Charges are based on distance, size, weight, service type, or
            contractual agreements.
          </li>
          <li>
            10.2 Business account customers must pay within{" "}
            <strong className="text-[#134467]">30 days</strong> of invoice
            unless agreed otherwise.
          </li>
          <li>
            10.3 <strong>Interest</strong> may be charged under the Late Payment
            of Commercial Debts (Interest) Act 1998.
          </li>
          <li>
            10.4 The Carrier exercises a <strong>general lien</strong> over
            Goods until all charges are paid (as permitted under RHA
            Conditions).
          </li>
        </ul>
      ),
    },
    {
      title: "11. Liability",
      icon: ShieldAlert,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>
            Liability for loss, damage, or delay is governed strictly by the{" "}
            <strong className="text-[#134467]">
              RHA Conditions of Carriage 2024
            </strong>
            . This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Liability limited to{" "}
              <strong className="text-[#E53935]">£1,300 per tonne</strong> of
              gross weight (≈ £1.30/kg)
            </li>
            <li>
              <strong>No liability</strong> for consequential or indirect loss
            </li>
            <li>
              <strong>No liability</strong> for loss of profits, business,
              opportunity, or special damages
            </li>
            <li>
              <strong>No liability</strong> for customer-packaged fragile or
              poorly packaged items
            </li>
            <li>
              <strong>No liability</strong> for undeclared dangerous goods
            </li>
          </ul>
          <p className="mt-2 italic text-slate-500">
            The Customer must arrange{" "}
            <strong className="text-[#134467]">full-value insurance</strong> if
            required.
          </p>
        </div>
      ),
    },
    {
      title: "12. Claims",
      icon: FileWarning,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>Claims must comply with RHA deadlines:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Damage / Shortage:</strong> Notify within{" "}
              <strong className="text-[#E53935]">7 days</strong> of delivery
            </li>
            <li>
              <strong>Loss / Non-Delivery:</strong> Notify within the RHA time
              limits
            </li>
            <li>
              Claims outside the permitted RHA windows are{" "}
              <strong className="text-[#E53935]">invalid</strong>
            </li>
            <li>All claims must include required evidence per RHA rules</li>
          </ul>
        </div>
      ),
    },
    {
      title: "13. Lien",
      icon: Lock,
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <p>
          The Carrier may{" "}
          <strong className="text-[#134467]">retain Goods</strong> until all
          charges due are paid in full, as authorised by the RHA Conditions. If
          charges remain unpaid, Goods may be{" "}
          <strong className="text-[#E53935]">sold to recover costs</strong>.
        </p>
      ),
    },
    {
      title: "14. Subcontracted Drivers",
      icon: Users,
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            All subcontracted drivers operate under the authority and rules of
            the RHA Conditions, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Compliance with <strong>safety standards</strong>
            </li>
            <li>Proper handling of Goods</li>
            <li>Reporting incidents immediately</li>
            <li>
              Prohibition from subcontracting further without written permission
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "15. Force Majeure",
      icon: CloudLightning,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>
            Events{" "}
            <strong className="text-[#134467]">
              outside the Carrier’s reasonable control
            </strong>{" "}
            (as defined in the RHA Conditions) relieve the Carrier of liability
            and may include:
          </p>
          <ul className="list-disc pl-5 grid sm:grid-cols-2 gap-1">
            <li>Weather disruptions</li>
            <li>Traffic or road closures</li>
            <li>Strikes or industrial action</li>
            <li>Government restrictions</li>
            <li>Accidents</li>
            <li>Natural disasters</li>
          </ul>
        </div>
      ),
    },
    {
      title: "16. Governing Law",
      icon: Gavel,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>
            These Terms and all carriage contracts are governed by the laws of{" "}
            <strong className="text-[#134467]">England & Wales</strong>, with
            disputes subject to the exclusive jurisdiction of the English
            courts.
          </p>
          <p>
            All carriage remains subject to the{" "}
            <strong>RHA Conditions of Carriage 2024</strong>, which override any
            conflicting term herein.
          </p>
        </div>
      ),
    },
    {
      title: "17. Availability of RHA Conditions",
      icon: Download,
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
      content:
        "A full copy of the RHA Conditions of Carriage 2024 is available on request or for download from our website.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
      {/* Header Area */}
      <div className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 bg-white border-b border-[#48AEDD]/10">
        {/* Subtle Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#F5EB18]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#48AEDD]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <div
            className={cn(
              "inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-[#48AEDD]/20 shadow-sm mb-8",
              fadeInUp,
            )}
          >
            <Scale className="w-4 h-4 text-[#48AEDD]" />
            <span className="text-[#48AEDD] font-bold text-xs tracking-widest uppercase">
              Legal Information
            </span>
          </div>

          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight",
              fadeInUp,
              "animation-delay-100",
            )}
          >
            Terms & <span className="text-[#E53935]">Conditions</span>
          </h1>

          <p
            className={cn(
              "text-lg sm:text-xl text-slate-500 mb-4 max-w-2xl mx-auto font-medium",
              fadeInUp,
              "animation-delay-200",
            )}
          >
            All Carriage Subject to RHA Conditions of Carriage 2024
          </p>
          <p
            className={cn(
              "text-sm text-slate-400",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            Last Updated: 16/03/2026
          </p>
        </div>
      </div>

      {/* Content Section - Single Container */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div
          className={cn(
            "max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden",
            fadeInUp,
            "animation-delay-500",
          )}
        >
          {/* Intro Box - Red Background (Requested) */}
          <div className="bg-[#E53935] p-8 sm:p-10 text-white">
            <div className="flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-[#F5EB18] flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-xl mb-2 text-[#F5EB18]">
                  Important Agreement
                </h2>
                <p className="text-white/90 leading-relaxed">
                  Route46 Global Ltd, trading as Route46 Couriers, undertakes
                  all carriage and related services strictly under the Road
                  Haulage Association (RHA) Conditions of Carriage 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Clauses List */}
          <div className="p-8 sm:p-12 space-y-10">
            {legalSections.map((section, index) => (
              <section key={index} className="group">
                <div className="flex gap-4 items-start">
                  {/* Section Number/Icon - Dynamic Colors */}
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
                    {/* Headings - Consistent Navy Blue */}
                    <h3 className="text-xl font-bold text-[#134467] mb-4 flex items-center gap-3 group-hover:text-[#E53935] transition-colors">
                      {section.title}
                    </h3>
                    {/* Body Text - Slate Gray */}
                    <div className="text-slate-600 leading-relaxed text-base">
                      {section.content}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index !== legalSections.length - 1 && (
                  <div className="h-px w-full bg-slate-100 mt-10 ml-16" />
                )}
              </section>
            ))}
          </div>

          {/* Footer of the Document */}
          <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F5EB18]/20 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#E53935]" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
              FourSix46® Global Ltd — Trading as Route46 Couriers
            </p>
            <p className="text-xs text-slate-400 mt-1">
              FourSix46 Global Ltd Trading as Route46 Couriers, 66 Paul Street,
              London EC2A 4NA, United Kingdom
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div
          className={cn("mt-12 text-center", fadeInUp, "animation-delay-700")}
        >
          <p className="text-slate-500">
            Questions about our terms?{" "}
            <a
              href="/contact"
              className="text-[#48AEDD] hover:underline font-bold"
            >
              Contact Legal Support
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
