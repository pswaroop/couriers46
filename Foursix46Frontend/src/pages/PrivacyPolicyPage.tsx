import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Cookie,
  FileText,
  CheckCircle,
  Users,
  Server,
  Scale,
  AlertCircle,
  Globe,
  Database,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function PrivacyPolicyPage() {
  // Privacy content data structure
  const privacySections = [
    {
      title: "1. Who We Are",
      icon: FileText,
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>
            <strong className="text-[#134467]">FourSix46® Global Ltd</strong>
          </p>
          <p>
            Trading as{" "}
            <strong className="text-[#48AEDD]">Foursix46® Couriers</strong>
          </p>
          <p>Cardiff, United Kingdom</p>
          <p className="mt-2 text-slate-600">
            We are the <strong>Data Controller</strong> for the information we
            collect.
          </p>
        </div>
      ),
    },
    {
      title: "2. What Data We Collect",
      icon: Database,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#134467] mb-2 text-sm">
              Customers (B2B & B2C)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600">
              <li>Name, phone, email</li>
              <li>Addresses (billing, pickup, delivery)</li>
              <li>Parcel details</li>
              <li>Payment and invoice information</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#134467] mb-2 text-sm">
              Drivers (Contractors)
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600">
              <li>Name, contact details</li>
              <li>Driving licence & vehicle info</li>
              <li>Insurance details</li>
              <li>Bank details for payments</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "3. How We Use Your Data",
      icon: Eye,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>We process data to:</p>
          <ul className="list-disc pl-5 grid sm:grid-cols-2 gap-1">
            <li>Provide and manage courier services</li>
            <li>Arrange collections and deliveries</li>
            <li>Communicate with customers</li>
            <li>Manage business accounts and invoices</li>
            <li>Verify and pay self-employed drivers</li>
            <li>Improve our website and operations</li>
            <li>Meet legal and regulatory obligations</li>
          </ul>
          <p className="text-sm italic text-slate-400 mt-2">
            We may send marketing updates only if you have opted in.
          </p>
        </div>
      ),
    },
    {
      title: "4. Legal Basis for Processing",
      icon: Scale,
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <div className="space-y-2">
          <p>We rely on the following legal grounds:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Contract:</strong> Providing courier services.
            </li>
            <li>
              <strong>Legitimate Interest:</strong> Business operations, fraud
              prevention.
            </li>
            <li>
              <strong>Legal Obligation:</strong> Tax, accounting, verification.
            </li>
            <li>
              <strong>Consent:</strong> Marketing communications.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "5. Sharing Your Information",
      icon: Users,
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <div className="space-y-2">
          <p>We may share data with:</p>
          <ul className="list-disc pl-5 grid sm:grid-cols-2 gap-1">
            <li>Subcontracted drivers</li>
            <li>Third-party couriers</li>
            <li>Payment processors</li>
            <li>IT/hosting providers</li>
            <li>Regulators if legally required</li>
          </ul>
          <div className="mt-3 inline-block bg-[#E53935]/10 px-3 py-1 rounded text-[#E53935] text-sm font-bold">
            We never sell personal data.
          </div>
        </div>
      ),
    },
    {
      title: "6. Data Storage & Retention",
      icon: Server,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content: (
        <div className="space-y-2">
          <p>We keep your data only as long as needed:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Delivery & customer records:</strong> Up to 6 years
            </li>
            <li>
              <strong>Driver records:</strong> Up to 6 years
            </li>
            <li>
              <strong>Website analytics:</strong> 12–24 months
            </li>
          </ul>
          <p className="text-sm text-slate-500 mt-1">
            Data is stored securely on encrypted systems.
          </p>
        </div>
      ),
    },
    {
      title: "7. Cookies",
      icon: Cookie,
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      content: (
        <div className="space-y-2">
          <p>
            Our website uses cookies for functionality, analytics, and improving
            user experience.
          </p>
          <p className="text-sm">
            You may disable cookies in your browser settings at any time.
          </p>
        </div>
      ),
    },
    {
      title: "8. Your Rights",
      icon: UserCheck,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>Under the UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 grid sm:grid-cols-2 gap-1">
            <li>Access your data</li>
            <li>Correct inaccuracies</li>
            <li>Request deletion</li>
            <li>Object to processing</li>
            <li>Restrict processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent (marketing)</li>
          </ul>
        </div>
      ),
    },
    {
      title: "9. Security",
      icon: Lock,
      color: "#48AEDD", // Sky Blue
      bg: "bg-[#48AEDD]/10",
      content: (
        <p>
          We use encryption, secure servers, access controls, and regular
          monitoring to protect your information. However, no online system is
          100% secure.
        </p>
      ),
    },
    {
      title: "10. Changes to This Policy",
      icon: Globe,
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
      content:
        "We may update this Privacy Policy anytime. The latest version will always appear on our website.",
    },
    {
      title: "11. Complaints",
      icon: AlertCircle,
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
      content: (
        <div className="space-y-2">
          <p>If you have concerns, contact us first.</p>
          <p>
            You may also contact the Information Commissioner’s Office (ICO) at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#48AEDD] font-bold hover:underline"
            >
              ico.org.uk
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      title: "12. Children’s Privacy",
      icon: Users,
      color: "#F5EB18", // Red
      bg: "bg-[#F5EB18]/20",
      content: (
        <div className="space-y-2">
          <p>
            We do not intend to collect or knowingly collect personal
            information from children. We do not target children with our
            services.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-[#E53935] selection:text-white">
      {/* Header Area */}
      <div className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 bg-white border-b border-[#48AEDD]/10">
        {/* Subtle Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#48AEDD]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#F5EB18]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
          <div
            className={cn(
              "inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-[#48AEDD]/20 shadow-sm mb-8",
              fadeInUp,
            )}
          >
            <Shield className="w-4 h-4 text-[#48AEDD]" />
            <span className="text-[#48AEDD] font-bold text-xs tracking-widest uppercase">
              Trust & Security
            </span>
          </div>

          <h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-[#48AEDD] mb-6 tracking-tight",
              fadeInUp,
              "animation-delay-100",
            )}
          >
            Privacy <span className="text-[#E53935]">Policy</span>
          </h1>

          <p
            className={cn(
              "text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium",
              fadeInUp,
              "animation-delay-200",
            )}
          >
            (UK GDPR Compliant)
          </p>

          <p
            className={cn(
              "text-sm text-slate-400",
              fadeInUp,
              "animation-delay-300",
            )}
          >
            Last Updated: {new Date().toLocaleDateString()}
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
          {/* Intro Box - Sky Blue Background (Consistent with Terms) */}
          <div className="bg-[#48AEDD] p-8 sm:p-10 text-white">
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-[#F5EB18] flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-xl mb-2 text-[#F5EB18]">
                  Data Protection Commitment
                </h2>
                <p className="text-white/90 leading-relaxed">
                  FourSix46® Global Ltd, trading as Foursix46® Couriers, is
                  committed to protecting your personal information. This
                  Privacy Policy explains how we collect and use your data in
                  line with the UK GDPR and the Data Protection Act 2018.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections List */}
          <div className="p-8 sm:p-12 space-y-10">
            {privacySections.map((section, index) => (
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
                    {/* Headings - Consistent Navy Blue with Hover to Red */}
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
                {index !== privacySections.length - 1 && (
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
              Your data privacy is our top priority.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              To exercise your rights, please contact our privacy team.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div
          className={cn("mt-12 text-center", fadeInUp, "animation-delay-700")}
        >
          <p className="text-slate-500">
            Questions about privacy?{" "}
            <a
              href="/contact"
              className="text-[#48AEDD] hover:underline font-bold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
