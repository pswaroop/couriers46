import { CheckCircle2, Send, Truck, ShieldCheck, Zap, MapPin } from "lucide-react";

export const MetricsSectionRetain = () => (
  <section className="px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 lg:-mt-20 relative z-30 mb-12 sm:mb-16">

    {/* Custom Animation Styles */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `}</style>

    {/* Reduced max-width to 850px to decrease overall width */}
    <div className="max-w-[850px] mx-auto">
      <div className="animate-fade-in-up">

        <div className="relative animate-float">
          {/* Glow Effect behind the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E53935]/20 via-[#48AEDD]/20 to-[#F5EB18]/20 rounded-[1.5rem] blur-2xl transform scale-105"></div>

          {/* Main Glass Card */}
          <div className="relative bg-white p-4 sm:p-6 rounded-[1.5rem] shadow-xl border border-white/50">

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 justify-between items-stretch">

              {/* Item 1: Fast Delivery (Red) */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#E53935]/30 hover:bg-[#E53935]/5 transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-[#E53935]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-[#E53935]" />
                </div>
                <div>
                  <p className="font-bold text-[#134467] text-sm sm:text-base">
                    Fast Delivery
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#134467]/80 mt-0.5">
                    Same-day service available
                  </p>
                </div>
              </div>

              {/* Item 2: Real-Time Tracking (Blue) */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#48AEDD]/30 hover:bg-[#48AEDD]/5 transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-[#48AEDD]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-[#48AEDD]" />
                </div>
                <div>
                  <p className="font-bold text-[#134467] text-sm sm:text-base">
                    Live Tracking
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#134467]/80 mt-0.5">
                    Know where your parcel is
                  </p>
                </div>
              </div>

              {/* Item 3: Vetted Drivers (Yellow/Navy) */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#F5EB18]/50 hover:bg-[#F5EB18]/10 transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-[#F5EB18]/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-5 h-5 text-[#134467]" />
                </div>
                <div>
                  <p className="font-bold text-[#134467] text-sm sm:text-base">
                    60 Mins Pickup
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#134467]/80 mt-0.5">
                    Professional & Reliable
                  </p>
                </div>
              </div>

            </div>

            {/* Stats Bar at Bottom */}
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-xl text-center relative overflow-hidden shadow-inner">

              {/* UPDATED: items-baseline aligns the text to the bottom */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-1 sm:gap-3 text-[#134467]">

                {/* Left Part */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#E53935]">On a Mission to cut CO2 Emissions</span>
                  {/* <span className="font-bold text-[#134467]/90 text-xs sm:text-sm">Successful Deliveries</span> */}
                </div>

                {/* UPDATED: self-center keeps the pipe in the middle, independent of baseline alignment */}
                <span className="hidden sm:inline text-[#F5EB18] font-extrabold text-lg mx-1 self-center">|</span>

                {/* Right Part - Now sits on the baseline (bottom) naturally */}
                <span className="font-bold text-[#134467]/90 text-xs sm:text-sm">
                  Upto 30% per Delivery
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
);