import React, { useState, useEffect, useRef } from "react";
import { Quote, Star, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

// Animation utility
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export const TestimonialsPage = () => {
  const navigate = useNavigate();

  // State to track which rows are paused { 0: true, 1: false, etc }
  const [pausedRows, setPausedRows] = useState<Record<number, boolean>>({});
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

  const toggleRow = (index: number) => {
    setPausedRows((prev) => {
      const isPaused = !prev[index];

      // Clear any existing timer for this row
      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]);
      }

      if (isPaused) {
        // If pausing, set a timer to auto-resume after 5 seconds (optional UX enhancement)
        timeoutRefs.current[index] = setTimeout(() => {
          setPausedRows((current) => ({ ...current, [index]: false }));
        }, 5000);
      }

      return { ...prev, [index]: isPaused };
    });
  };

  const testimonials = [
    {
      quote:
        "Route46’s courier service is the best I’ve used! Fast delivery and real-time updates.",
      name: "Neha, Manchester",
      role: "Small Business Owner",
      initial: "N",
      color: "#E53935",
      bg: "bg-[#E53935]/10",
    },
    {
      quote:
        "Flexible driving hours and great pay. Route46 really cares about its team.",
      name: "Ali, Birmingham",
      role: "Driver",
      initial: "A",
      color: "#48AEDD",
      bg: "bg-[#48AEDD]/10",
    },
    {
      quote:
        "Finally a courier service that treats my packages with respect. Tracking is spot on.",
      name: "Sarah, London",
      role: "Online Retailer",
      initial: "S",
      color: "#134467",
      bg: "bg-[#134467]/10",
    },
    {
      quote:
        "Joining the network was seamless. The app is easy to use and support is great.",
      name: "Mike, Leeds",
      role: "Fleet Driver",
      initial: "M",
      color: "#DAA520",
      bg: "bg-[#DAA520]/20",
      textColor: "#134467",
    },
    {
      quote:
        "Reliable, professional, and prompt. Exactly what our logistics department needed.",
      name: "David, Bristol",
      role: "Logistics Manager",
      initial: "D",
      color: "#E53935",
      bg: "bg-[#E53935]/10",
    },
  ];

  // Helper for the card component
  const ReviewCard = ({
    data,
    size = "small",
  }: {
    data: (typeof testimonials)[0];
    size?: "small" | "large";
  }) => (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#DAA520]/50 mx-3 sm:mx-6 cursor-pointer",
        size === "large"
          ? "w-[350px] sm:w-[450px] h-[220px]"
          : "w-[280px] sm:w-[320px] h-[180px]",
      )}
    >
      {/* Quote Icon - Only on Large cards */}
      {size === "large" && (
        <div className="absolute -top-4 -right-4 bg-[#134467] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <Quote className="w-4 h-4" />
        </div>
      )}

      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Gold Stars */}
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-[#DAA520] text-[#DAA520]" />
            ))}
          </div>
          <p
            className={cn(
              "font-medium text-[#134467]/80 leading-snug line-clamp-3",
              size === "large" ? "text-lg" : "text-sm",
            )}
          >
            "{data.quote}"
          </p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-auto">
          <div
            className={cn(
              "rounded-full flex items-center justify-center font-bold shadow-sm",
              data.bg,
              size === "large" ? "w-10 h-10 text-lg" : "w-8 h-8 text-sm",
            )}
            style={{ color: data.textColor || data.color }}
          >
            {data.initial}
          </div>
          <div>
            <p
              className={cn(
                "font-bold text-[#134467]",
                size === "large" ? "text-base" : "text-sm",
              )}
            >
              {data.name}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#134467]/50">
              {data.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 font-sans selection:bg-[#E53935] selection:text-white min-h-screen">
      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden flex flex-col justify-center">
        {/* Styles for Marquee Animations */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-100% - 1.5rem)); }
          }
          @keyframes marquee-reverse {
            from { transform: translateX(calc(-100% - 1.5rem)); }
            to { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 60s linear infinite;
          }
          
          /* Only pause when the specific row has the .paused class */
          .paused {
            animation-play-state: paused !important;
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
          }
        `}</style>

        {/* Header Content */}
        <div className="relative z-20 container mx-auto px-4 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EB18]/75 border border-[#F5EB18]/100 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E53935]/100 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#134467]">
              What Our Customers Say
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#48AEDD] mb-6 tracking-tight">
            Trusted by
            <span className="text-[#E53935]"> Businesses and Individuals </span>
            Across the UK
          </h1>
          <p className="text-[#134467]/80 max-w-xl mx-auto text-lg">
            See what businesses, drivers, and individuals say about their
            experience with Route46 Couriers.
          </p>
        </div>

        {/* Scrolling Grid (Straight) */}
        <div className="relative w-full overflow-hidden py-4 bg-transparent marquee-container space-y-8">
          {/* Gradient Masks for 'Around' Effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          {/* ROW 1: Small Cards, Scroll Left */}
          <div
            className={cn(
              "flex w-max animate-marquee",
              pausedRows[0] && "paused",
            )}
            onClick={() => toggleRow(0)}
          >
            {[...testimonials, ...testimonials, ...testimonials].map(
              (item, idx) => (
                <ReviewCard key={`row1-${idx}`} data={item} size="small" />
              ),
            )}
          </div>

          {/* ROW 2: Large Cards, Scroll Right (Reverse) */}
          <div
            className={cn(
              "flex w-max animate-marquee-reverse",
              pausedRows[1] && "paused",
            )}
            onClick={() => toggleRow(1)}
          >
            {[...testimonials, ...testimonials, ...testimonials].map(
              (item, idx) => (
                <ReviewCard key={`row2-${idx}`} data={item} size="large" />
              ),
            )}
          </div>

          {/* ROW 3: Small Cards, Scroll Left */}
          <div
            className={cn(
              "flex w-max animate-marquee",
              pausedRows[2] && "paused",
            )}
            onClick={() => toggleRow(2)}
          >
            {[...testimonials, ...testimonials, ...testimonials].map(
              (item, idx) => (
                <ReviewCard key={`row3-${idx}`} data={item} size="small" />
              ),
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION (Reused from Contact Page) */}
      <div className={cn("relative py-20 overflow-hidden bg-white", fadeInUp)}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white border-2 border-[#134467]/10 rounded-[2.5rem] p-8 sm:p-16 text-center max-w-5xl mx-auto shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-shadow duration-500 relative overflow-hidden">
            {/* Subtle background decor inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5EB18]/5 rounded-bl-full -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#48AEDD]/5 rounded-tr-full -z-10" />

            <div className="w-20 h-20 bg-[#F5EB18]/75 rounded-full mx-auto flex items-center justify-center mb-8 animate-bounce-slow">
              <Truck className="w-10 h-10 text-[#134467]" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-[#48AEDD] mb-6 leading-tight">
              Ready to Ship with{" "}
              <span className="text-[#E53935]">Confidence?</span>
            </h2>

            <p className="text-[#134467]/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join businesses and individuals across the UK who trust Route46
              Couriers for reliable courier and delivery services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate("/quick-quote")}
                className="h-16 px-10 bg-[#134467] hover:bg-[#0f3652] text-white text-lg font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                Quick Quote
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/for-businesses")}
                className="h-16 px-10 border-2 border-[#134467]/100 bg-transparent text-[#134467] hover:bg-[#134467]/100 text-lg font-bold rounded-full transition-all duration-300 hover:-translate-y-1"
              >
                Join Our Courier Network <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
