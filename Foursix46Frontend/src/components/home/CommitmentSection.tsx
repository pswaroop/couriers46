import { CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommitmentSectionProps {
  benefits: string[];
}

export const CommitmentSection = ({ benefits }: CommitmentSectionProps) => (
  <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
    {/* Inline Animation Styles */}
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.7s ease-out forwards;
      }
    `}</style>

    {/* Background Decoration */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E53935]/20 to-transparent" />
    <div className="absolute -left-20 top-20 w-64 h-64 bg-[#48AEDD]/5 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -right-20 bottom-20 w-64 h-64 bg-[#F5EB18]/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-5xl mx-auto relative z-10">
      <div
        className="text-center mb-16 animate-fade-in-up"
        style={{ opacity: 0 }}
      >
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1 rounded-full bg-[#134467]/5 border border-[#134467]/10">
          <ShieldCheck className="w-4 h-4 text-[#E53935]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#134467]">
            Our Promise
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#134467] mb-4">
          Reliable Same Day Courier Services{" "}
          <span className="text-[#48AEDD]">Across the UK</span>
        </h2>
        <p className="text-[#134467]/80 max-w-2xl mx-auto text-lg">
          Looking for a reliable same day courier service in the UK? <br />
          Route46 Couriers provides fast collection and secure delivery for
          urgent shipments and business logistics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, idx) => (
          <div
            key={`${benefit}-${idx}`}
            className={cn(
              "group flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm",
              "hover:shadow-xl hover:border-[#E53935]/20 hover:-translate-y-1 transition-all duration-300 cursor-default",
              "animate-fade-in-up",
            )}
            style={{
              animationDelay: `${200 + idx * 100}ms`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#E53935]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E53935] transition-colors duration-300">
              <CheckCircle2 className="w-6 h-6 text-[#E53935] group-hover:text-white transition-colors duration-300" />
            </div>

            <div className="flex-1 pt-1">
              <span className="text-lg text-[#134467] font-bold group-hover:text-[#134467] transition-colors">
                {benefit}
              </span>
              {/* Optional decorative underline on hover */}
              <div className="w-0 group-hover:w-12 h-0.5 bg-[#F5EB18] mt-2 transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
