import React from "react";
import {
  Truck,
  Zap,
  Pencil,
  Package,
  Building2Icon,
  ShieldCheck,
  ShoppingCart,
  IceCreamBowl,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustedBrands = [
  {
    name: "Amma-Ma Foods",
    icon: IceCreamBowl,
    color: "#1a4f0eff", // Blue
    className:
      "hover:text-[#1a4f0eff] hover:bg-[#1a4f0eff]/10 hover:border-[#1a4f0eff]/20",
  },
  {
    name: "Services",
    icon: Truck,
    color: "#d7ce21ff", // Yellow
    className:
      "hover:text-[#d7ce21ff] hover:bg-[#d7ce21ff]/10 hover:border-[#d7ce21ff]/20",
  },
  {
    name: "Spark",
    icon: Zap,
    color: "#48AEDD", // Red
    className:
      "hover:text-[#48AEDD] hover:bg-[#48AEDD]/10 hover:border-[#48AEDD]/20",
  },
  {
    name: "Retail",
    icon: ShoppingCart,
    color: "#E53935", // Blue
    className:
      "hover:text-[#E53935] hover:bg-[#E53935]/10 hover:border-[#E53935]/20",
  },
  {
    name: "E-Commerce",
    icon: Package,
    color: "#134467", // Navy
    className:
      "hover:text-[#134467] hover:bg-[#134467]/10 hover:border-[#134467]/20",
  },
  {
    name: "Hello Amigos",
    icon: Building2Icon,
    color: "#2f9617ff", // Blue
    className:
      "hover:text-[#2f9617ff] hover:bg-[#2f9617ff]/10 hover:border-[#2f9617ff]/20",
  },
  {
    name: "Creators",
    icon: Pencil,
    color: "#e7bc45ff", // Red
    className:
      "hover:text-[#e7bc45ff] hover:bg-[#e7bc45ff]/10 hover:border-[#e7bc45ff]/20",
  },
  {
    name: "Hospitality",
    icon: ShieldCheck,
    color: "#48AEDD", // Blue
    className:
      "hover:text-[#48AEDD] hover:bg-[#48AEDD]/10 hover:border-[#48AEDD]/20",
  },
];

export const TrustLogosSection = () => (
  <section className="py-12 sm:py-16 bg-white overflow-hidden relative z-20">
    {/* Inline Styles for Marquee Animation */}
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 40s linear infinite;
        width: max-content;
      }
      /* Pause animation on hover for better UX */
      .group:hover .animate-marquee {
        animation-play-state: paused;
      }
    `}</style>

    <div className="max-w-7xl mx-auto px-4">
      <p className="text-center text-xs sm:text-sm uppercase tracking-[0.3em] text-[#134467]/80 font-extrabold mb-10 sm:mb-12">
        Trusted by Businesses and Industries Across the UK
      </p>

      <div className="relative group">
        {/* Marquee Content (Duplicated for seamless loop) */}
        <div className="flex items-center gap-12 sm:gap-16 animate-marquee">
          {[...trustedBrands, ...trustedBrands, ...trustedBrands].map(
            (brand, idx) => (
              <div
                key={`${brand.name}-${idx}`}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl border border-transparent transition-all duration-500 cursor-pointer",
                  "grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:shadow-lg",
                  brand.className,
                )}
              >
                {/* Icon acting as logo mark */}
                <div className="p-2 bg-slate-50 rounded-xl transition-colors duration-300 group-hover:bg-white">
                  <brand.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>

                {/* Brand Name */}
                <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap transition-colors duration-300">
                  {brand.name}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  </section>
);
