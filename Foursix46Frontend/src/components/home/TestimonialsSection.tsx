import { useState, useEffect, useRef, useCallback } from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const TestimonialsSection = () => {
  const originalTestimonials = [
    {
      quote:
        "“Route46 Couriers handled our urgent same-day delivery perfectly. The driver collected the parcel within the hour and delivered it safely across the city. Reliable courier service when timing really matters.”",
      name: "David – Bristol",
      role: "Logistics Manager",
      initial: "N",
      color: "#E53935", // Red
      bg: "bg-[#E53935]/10",
    },
    {
      quote:
        "“We use Route46 Couriers regularly for business shipments. The booking process is simple, pricing is transparent, and the delivery updates keep us informed throughout the journey.”",
      name: "Neha – Manchester",
      role: "Small Business Owner",
      initial: "A",
      color: "#48AEDD", // Blue
      bg: "bg-[#48AEDD]/10",
    },
    {
      quote:
        "“I needed a passport delivered urgently and Route46 arranged a courier collection within minutes. The service was fast, professional, and exactly what I needed for a time-critical delivery.”",
      name: "James – London",
      role: "Private Client",
      initial: "S",
      color: "#134467", // Navy
      bg: "bg-[#134467]/10",
    },
    {
      quote:
        "“Our company depends on reliable logistics partners, and Route46 Couriers has consistently delivered. From documents to urgent parcels, their same-day courier service across the UK has been excellent.”",
      name: "Sarah – Birmingham",
      role: "Operations Manager",
      initial: "M",
      color: "#F5EB18", // Yellow
      bg: "bg-[#F5EB18]/20",
      textColor: "#134467",
    },
    {
      quote:
        "“Fast collection, friendly driver, and clear communication from start to finish. Route46 Couriers made our urgent delivery stress-free. Highly recommended courier service.”",
      name: "Michael – Cardiff",
      role: "Retail Business Owner",
      initial: "D",
      color: "#E53935",
      bg: "bg-[#E53935]/10",
    },
  ];

  // Clone first 2 and last 2 items to create the buffer for infinite scrolling
  // [Last-1, Last, ...Real Items..., First, First+1]
  const testimonials = [
    originalTestimonials[originalTestimonials.length - 2],
    originalTestimonials[originalTestimonials.length - 1],
    ...originalTestimonials,
    originalTestimonials[0],
    originalTestimonials[1],
  ];

  const [activeIndex, setActiveIndex] = useState(2); // Start at the first real item (index 2)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to get the "real" index for the dots (0 to length-1)
  const getRealIndex = (index: number) => {
    if (index < 2) return originalTestimonials.length - 2 + index;
    if (index >= originalTestimonials.length + 2)
      return index - (originalTestimonials.length + 2);
    return index - 2;
  };

  const nextSlide = useCallback(() => {
    if (!isTransitioning) setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setActiveIndex(index + 2); // Adjust for the 2 leading clones
  };

  // Auto-play
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  // Handle Infinite Loop Snapping
  useEffect(() => {
    if (activeIndex === testimonials.length - 2) {
      // We reached the cloned first items at the end. Snap back to real start.
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(2);
      }, 700); // Match transition duration
    } else if (activeIndex === 1) {
      // We reached the cloned last items at the start. Snap forward to real end.
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(originalTestimonials.length + 1);
      }, 700);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, testimonials.length, originalTestimonials.length]);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Inline Styles for Variables */}
      <style>{`
        .testimonial-track {
          --card-width: 85vw;
          --gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .testimonial-track {
            --card-width: 600px;
          }
        }
      `}</style>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#134467]/10 to-transparent" />
      <div className="absolute -left-20 top-40 w-72 h-72 bg-[#48AEDD]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-10 w-72 h-72 bg-[#F5EB18]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-12 px-4">
          <p className="uppercase tracking-[0.2em] text-[#2B7CB3] text-xs font-bold mb-3">
            Real Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#134467]">
            What Our <span className="text-[#E53935]">Customers</span> Say
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Track */}
          <div
            className={cn(
              "flex gap-6 ease-in-out testimonial-track",
              isTransitioning
                ? "transition-transform duration-700"
                : "transition-none",
            )}
            style={{
              // Logic: Center the active card
              transform: `translateX(calc(50% - (var(--card-width) / 2) - (${activeIndex} * (var(--card-width) + var(--gap)))))`,
            }}
          >
            {testimonials.map((testimonial, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex-shrink-0 transition-all duration-700 ease-in-out",
                    "w-[85vw] md:w-[600px]",
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-50 blur-[1px]",
                  )}
                >
                  <div
                    className={cn(
                      "bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 relative flex flex-col items-center text-center h-full transition-shadow",
                      isActive ? "shadow-2xl border-[#F5EB18]/30" : "shadow-sm",
                    )}
                  >
                    {/* Quote Icon Badge */}
                    <div className="absolute -top-6 bg-[#134467] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50">
                      <Quote className="w-5 h-5" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 text-[#DAA520] fill-[#DAA520]"
                        />
                      ))}
                    </div>

                    <p className="text-lg sm:text-xl md:text-2xl text-[#134467]/80 italic mb-8 leading-relaxed font-medium">
                      {testimonial.quote}
                    </p>

                    <div className="flex items-center gap-4 mt-auto">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-sm",
                          testimonial.bg,
                        )}
                        style={{
                          color: testimonial.textColor || testimonial.color,
                        }}
                      >
                        {testimonial.initial}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-[#134467] text-base">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-[#134467]/80 font-bold uppercase tracking-wider">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center -space-x-5 mt-12">
          {originalTestimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="p-3 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
              aria-label={`Go to testimonial ${idx + 1}`}
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  getRealIndex(activeIndex) === idx
                    ? "bg-[#E53935] w-8"
                    : "bg-[#134467]/20 w-2 hover:bg-[#134467]/40",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
