import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitFeatureSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  benefits: string[];
  cta?: { label: string; onClick: () => void };
  secondaryCta?: { label: string; onClick: () => void };
  reverse?: boolean;
  highlight?: ReactNode;
}

export const SplitFeatureSection = ({
  eyebrow,
  title,
  description,
  image,
  benefits,
  cta,
  secondaryCta,
  reverse = false,
  highlight,
}: SplitFeatureSectionProps) => {

  // Helper to render the image block (used for both Mobile and Desktop positions)
  const renderImageSection = () => (
    <div className="relative animate-float-slow flex justify-center items-center w-full">
      {/* Colored Blob Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#48AEDD]/20 to-[#F5EB18]/20 rounded-[3rem] blur-3xl scale-95 -z-10" />

      {/* Main Image Container */}
      <div className="relative rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl w-full aspect-square lg:aspect-[4/3] max-h-[500px]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
        />

        {/* Overlay Gradient for text readability if highlight exists */}
        {highlight && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />}

        {/* Floating Highlight Card */}
        {highlight && (
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {highlight}
          </div>
        )}
      </div>

      {/* Decorative Element */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F5EB18] rounded-full opacity-20 blur-xl -z-10" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#E53935] rounded-full opacity-10 blur-xl -z-10" />
    </div>
  );

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 overflow-hidden">

      {/* Inline Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div
        className={cn(
          "max-w-7xl mx-auto grid gap-12 lg:gap-16 items-center",
          reverse ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
        )}
      >
        {/* Text Content Column */}
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
          {eyebrow && (
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-[#E53935]"></span>
              <p className="text-sm uppercase tracking-widest font-bold text-[#2B7CB3]">
                {eyebrow}
              </p>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-[#134467] mb-6 leading-tight">
            {title}
          </h2>

          {/* MOBILE IMAGE POSITION: Visible only on lg screens and below */}
          <div className="block lg:hidden mb-8 mt-2">
            {renderImageSection()}
          </div>

          <p className="text-[#134467]/80 text-base sm:text-lg lg:text-base mb-8 leading-relaxed">
            {description}
          </p>

          <div className="space-y-4 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#48AEDD]/20 shadow-sm hover:border-[#E53935]/50 hover:shadow-md transition-all duration-300 group"
              >
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[#E53935]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E53935] transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#E53935] group-hover:text-white transition-colors" />
                </div>
                <p className="text-[#134467] font-medium">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {cta && (
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 bg-[#E53935] hover:bg-[#c62828] text-white font-bold rounded-xl shadow-lg hover:shadow-[#E53935]/30 hover:-translate-y-0.5 transition-all"
                onClick={cta.onClick}
                aria-label={cta.label}
              >
                {cta.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* DESKTOP IMAGE POSITION: Hidden on mobile */}
        <div
          className={cn(
            "hidden lg:flex justify-center items-center",
            reverse ? "lg:order-1" : "lg:order-2"
          )}
        >
          {renderImageSection()}
        </div>
      </div>
    </section>
  );
};