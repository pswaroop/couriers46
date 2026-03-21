// import { Button } from "@/components/ui/button";
// import { Building2, Send } from "lucide-react";

// interface HeroSectionProps {
//   onSendParcel: () => void;
//   onJoinNetwork: () => void;
//   backgroundImageUrl?: string;
//   mobileBackgroundImageUrl?: string;
// }

// export const HeroSection = ({
//   onSendParcel,
//   onJoinNetwork,
//   backgroundImageUrl = "/route462.jpeg",
//   mobileBackgroundImageUrl = "/route462.jpeg",
// }: HeroSectionProps) => {
//   return (
//     <section className="relative min-h-screen lg:min-h-[100vh] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-20 overflow-hidden bg-[#134467] -mt-20 lg:mt-0">
//       {/* --- INTERNAL STYLES FOR ANIMATIONS --- */}
//       <style>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes pulseGlow {
//           0%, 100% { box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.2); }
//           50% { box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.1); }
//         }

//         .animate-blob { animation: blob 7s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//         .animation-delay-4000 { animation-delay: 4s; }
//         .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
//         .animate-pulse-glow { animation: pulseGlow 2s infinite; }
//       `}</style>

//       {/* --- BRAND LOGO (TOP LEFT) --- */}
//       {/* UPDATED: Transparent background, added styled yellow separator */}
//       {/* Hidden on screens smaller than lg (tablets and mobile) to avoid collision */}
//       <div
//         className="hidden lg:flex absolute top-8 left-8 z-50 items-center animate-fade-in-up"
//         style={{ animationDelay: "0ms" }}
//       >
//         {/* Removed bg-[#0055A5], shadow, and border */}
//         <div className="flex items-center gap-5 p-2">
//           {/* Logo Image */}
//           <img
//             src="/route46logo.png"
//             alt="Route46® Logo"
//             className="w-16 h-16 object-contain drop-shadow-sm"
//           />

//           {/* Styled Vertical Yellow Bar Separator */}
//           <div className="h-12 w-[3px] bg-[#f5eb18] rounded-full shadow-[0_0_10px_rgba(245,235,24,0.5)]"></div>

//           {/* Text Content */}
//           <div className="flex flex-col justify-center h-full pt-1">
//             <h2 className="text-2xl font-black text-white tracking-tighter leading-none drop-shadow-md">
//               Route46® Couriers
//             </h2>
//             <p className="text-[0.65rem] font-bold text-[#f5eb18] tracking-widest uppercase leading-tight mt-0.5 drop-shadow-sm">
//               The Courier with a difference
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* 1. Hero Image (Proper IMG tag for LCP) - Hidden but detectable by Lighthouse */}
//       <img
//         src={backgroundImageUrl}
//         alt="Route46® Courier Service Hero"
//         className="hidden sm:block absolute inset-0 w-full h-full object-cover z-0 opacity-80"
//         fetchPriority="high"
//         loading="eager"
//         width="1920"
//         height="1080"
//       />

//       {/* 1b. Mobile Hero Image */}
//       <img
//         src={mobileBackgroundImageUrl || backgroundImageUrl}
//         alt="Route46® Courier Service Hero Mobile"
//         className="block sm:hidden absolute inset-0 w-full h-full object-cover z-0 opacity-80"
//         fetchPriority="high"
//         loading="eager"
//         width="1920"
//         height="1080"
//       />

//       {/* 2. Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#0a2538]/40 via-[#0a2538]/40 to-[#0a2538]/30 z-10" />

//       {/* 3. Animated Background Blobs */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-[#48AEDD] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob z-10" />
//       <div className="absolute top-0 right-0 w-72 h-72 bg-[#f5eb18] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000 z-10" />
//       <div className="absolute -bottom-32 left-20 w-72 h-72 bg-[#E53935] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-4000 z-10" />

//       {/* 4. Main Content */}
//       <div className="relative max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center z-20">
//         <div className="text-center lg:text-left pt-10 lg:pt-0">
//           {/* Mobile/Tablet Logo (Visible only on screens smaller than lg) */}
//           <div className="flex lg:hidden items-center justify-center gap-3 mb-6 animate-fade-in-up">
//             <img
//               src="/route46logo.png"
//               alt="Route46® Logo"
//               className="w-12 h-12 object-contain drop-shadow-sm"
//             />
//             <div className="h-10 w-[2px] bg-[#f5eb18] rounded-full shadow-[0_0_10px_rgba(245,235,24,0.5)]"></div>
//             <div className="flex flex-col justify-center text-left">
//               <h2 className="text-lg font-black text-white tracking-tighter leading-none drop-shadow-md">
//                 Route46® Couriers
//               </h2>
//               <p className="text-[0.5rem] font-bold text-[#f5eb18] tracking-widest uppercase leading-tight mt-0.5 drop-shadow-sm">
//                 The Courier with a difference
//               </p>
//             </div>
//           </div>

//           {/* Badge */}
//           <div className="inline-flex items-center justify-center lg:justify-start mb-6 mt-2 lg:mt-0 animate-fade-in-up">
//             <div className="px-5 py-2 rounded-full bg-transparent border border-white text-white text-xs sm:text-xs font-bold tracking-wide uppercase shadow-sm animate-pulse-glow flex items-center gap-2 backdrop-blur-sm">
//               <span className="w-1 h-1 rounded-full bg-[#f5eb18]"></span>
//               Unique <span className="w-1 h-1 rounded-full bg-[#48AEDD]"></span>{" "}
//               Reliable{" "}
//               <span className="w-1 h-1 rounded-full bg-[#F81E30]"></span> Fast
//             </div>
//           </div>

//           {/* Heading */}
//           <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight drop-shadow-xl animate-fade-in-up">
//             <span className="text-[#48AEDD] whitespace-nowrap">
//               Courier Services
//             </span>
//             <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F81E30] to-[#F81E30] drop-shadow-sm block mt-1 pb-4">
//               Reimagined
//             </span>
//           </h1>

//           {/* Description */}
//           <p className="text-lg sm:text-l text-gray-200 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up drop-shadow-md">
//             From urgent parcels to business logistics,{" "}
//             <span className="text-white font-semibold">Route46®</span> delivers
//             with the precision and uniqueness of an Okapi. Experience courier
//             services that stand out from the herd.
//           </p>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
//             <Button
//               size="lg"
//               variant="default"
//               onClick={onSendParcel}
//               className="w-full sm:w-auto h-12 px-6 text-base font-bold bg-[#E53935] hover:bg-[#C62828] text-white rounded-xl shadow-[0_10px_20px_rgba(229,57,53,0.3)] hover:shadow-[0_15px_30px_rgba(229,57,53,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
//             >
//               <Send className="w-5 h-5" />
//               Quick Quote
//             </Button>

//             <Button
//               size="lg"
//               variant="outline"
//               onClick={onJoinNetwork}
//               className="w-full sm:w-auto h-12 px-6 text-base font-bold rounded-xl flex items-center justify-center gap-2 border-2 border-[#f5eb18] transition-all duration-300

//   /* Normal State */
//   text-white bg-transparent

//   /* Hover State */
//   hover:bg-[#f5eb18]/20

//   /* Hover Shadow */
//   hover:shadow-[0_10px_20px_-5px_rgba(245,235,24,0.5)]
//   hover:-translate-y-1"
//             >
//               <Building2 className="w-5 h-5" />
//               Join Okapi's Network
//             </Button>
//           </div>
//         </div>

//         <div className="hidden lg:block"></div>
//       </div>
//     </section>
//   );
// };
import { Button } from "@/components/ui/button";
import { Building2, Send } from "lucide-react";

interface HeroSectionProps {
  onSendParcel: () => void;
  onJoinNetwork: () => void;
  backgroundImageUrl?: string;
  mobileBackgroundImageUrl?: string;
}

export const HeroSection = ({
  onSendParcel,
  onJoinNetwork,
  backgroundImageUrl = "/route462.jpeg",
  mobileBackgroundImageUrl = "/route462.jpeg",
}: HeroSectionProps) => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center
        px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#134467]
        pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-0 lg:pb-0 -mt-20 lg:mt-0"
    >
      <style>{`
        @keyframes blob {
          0%   { transform: translate(0px,   0px)   scale(1);   }
          33%  { transform: translate(30px,  -50px) scale(1.1); }
          66%  { transform: translate(-20px,  20px) scale(0.9); }
          100% { transform: translate(0px,   0px)   scale(1);   }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0px rgba(255,255,255,0.2); }
          50%       { box-shadow: 0 0 0 5px rgba(255,255,255,0.1); }
        }
        .animate-blob          { animation: blob 7s infinite; }
        .animation-delay-2000  { animation-delay: 2s; }
        .animation-delay-4000  { animation-delay: 4s; }
        .animate-fade-in-up    { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-pulse-glow    { animation: pulseGlow 2s infinite; }
      `}</style>

      {/* ── DESKTOP BRAND LOCKUP (lg+) ─────────────────────────────── */}
      <div
        className="hidden lg:flex absolute top-7 left-8 z-50 items-center
          animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        {/*
          Glass pill — gives the lockup its own readable surface so it
          never fights the background image.
        */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-2xl
            bg-[#0a2538]/60 backdrop-blur-md
            border border-white/10
            shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
        >
          <img
            src="/route46logo.png"
            alt="Route46 Logo"
            className="w-14 h-14 object-contain drop-shadow-lg flex-shrink-0"
          />

          <div
            className="h-10 w-[2px] rounded-full bg-[#f5eb18]
            shadow-[0_0_10px_rgba(245,235,24,0.6)] flex-shrink-0"
          />

          <div className="hidden sm:flex flex-col justify-center">
            <span
              className="text-xl font-black text-white tracking-tight
    leading-none drop-shadow-sm whitespace-nowrap"
            >
              Route46 Couriers
            </span>
            <span
              className="text-[0.6rem] font-bold text-[#f5eb18]
    tracking-[0.18em] uppercase leading-tight mt-1 whitespace-nowrap"
            >
              The Courier with a difference
            </span>
          </div>
        </div>
      </div>

      {/* ── BACKGROUND IMAGES ───────────────────────────────────────── */}
      <img
        src={backgroundImageUrl}
        alt="Route46 Courier Service"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover z-0 opacity-75"
        fetchPriority="high"
        loading="eager"
        width="1920"
        height="1080"
      />
      <img
        src={mobileBackgroundImageUrl || backgroundImageUrl}
        alt="Route46 Courier Service"
        className="block sm:hidden absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        fetchPriority="high"
        loading="eager"
        width="800"
        height="1200"
      />

      {/* ── GRADIENT OVERLAYS ───────────────────────────────────────── */}
      {/* Stronger left-side gradient so text stays readable */}
      <div
        className="absolute inset-0 bg-gradient-to-r
        from-[#0a2538]/80 via-[#0a2538]/55 to-[#0a2538]/20 z-10"
      />
      {/* Extra bottom fade on mobile for button legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t
        from-[#0a2538]/70 via-transparent to-transparent z-10 sm:hidden"
      />

      {/* ── ANIMATED BLOBS ──────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 w-72 h-72 bg-[#48AEDD] rounded-full
        mix-blend-screen filter blur-[100px] opacity-25 animate-blob z-10"
      />
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-[#f5eb18] rounded-full
        mix-blend-screen filter blur-[100px] opacity-15 animate-blob animation-delay-2000 z-10"
      />
      <div
        className="absolute -bottom-32 left-20 w-72 h-72 bg-[#E53935] rounded-full
        mix-blend-screen filter blur-[100px] opacity-15 animate-blob animation-delay-4000 z-10"
      />

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div
        className="relative max-w-7xl w-full grid lg:grid-cols-2
        gap-10 items-center z-20 lg:min-h-screen lg:py-0"
      >
        <div className="text-center lg:text-left lg:pt-24">
          {/* ── MOBILE / TABLET BRAND LOCKUP (<lg) ── */}
          <div
            className="hidden items-center justify-center gap-3 mb-7
              animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            {/*
              On mobile the lockup sits inside the content flow.
              Give it the same glass treatment so it's always legible.
            */}
            <div
              className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl
                bg-[#0a2538]/65 backdrop-blur-md
                border border-white/10
                shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <img
                src="/route46logo.png"
                alt="Route46 Logo"
                className="w-11 h-11 object-contain drop-shadow-md flex-shrink-0"
              />

              <div
                className="h-9 w-[2px] rounded-full bg-[#f5eb18]
                shadow-[0_0_8px_rgba(245,235,24,0.5)] flex-shrink-0"
              />

              <div className="flex flex-col text-left">
                <span
                  className="text-base sm:text-lg font-black text-white
                  tracking-tight leading-none whitespace-nowrap"
                >
                  Route46 Couriers
                </span>
                <span
                  className="text-[0.55rem] sm:text-[0.6rem] font-bold
                  text-[#f5eb18] tracking-[0.15em] uppercase leading-tight
                  mt-0.5 whitespace-nowrap"
                >
                  The Courier with a difference
                </span>
              </div>
            </div>
          </div>

          {/* ── BADGE ── */}
          <div
            className="inline-flex items-center justify-center lg:justify-start
              mb-5 animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            <div
              className="px-5 py-2 rounded-full bg-transparent border border-white/70
                text-white text-xs font-bold tracking-wide uppercase
                animate-pulse-glow flex items-center gap-2 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#48AEDD]" />
              UK-WIDE COURIER NETWORK
            </div>
          </div>

          {/* ── HEADING ── */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
              font-extrabold mb-5 leading-[1.08] drop-shadow-xl
              animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <span className="text-[#48AEDD] whitespace-nowrap">
              Same Day Courier
            </span>
            <br />
            <span
              className="block mt-1 pb-2
                text-transparent bg-clip-text
                bg-gradient-to-r from-[#F81E30] to-[#ff6b6b]"
            >
              Service In UK
            </span>
          </h1>

          {/* ── DESCRIPTION ── */}
          <p
            className="text-base sm:text-lg text-gray-200 mb-9
              leading-relaxed max-w-xl mx-auto lg:mx-0
              drop-shadow-md animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <span className="text-white font-semibold">Route46</span> Couriers
            provides urgent parcel delivery, document transport, and
            time-critical logistics across the United Kingdom, offers rapid
            collection, direct delivery, and real-time tracking for businesses
            and individuals who require fast and secure transport solutions.
          </p>

          {/* ── BUTTONS ── */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4
              justify-center lg:justify-start animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <Button
              size="lg"
              onClick={onSendParcel}
              className="w-full sm:w-auto h-13 px-7 text-base font-bold
                bg-[#E53935] hover:bg-[#C62828] text-white rounded-xl
                shadow-[0_10px_20px_rgba(229,57,53,0.35)]
                hover:shadow-[0_15px_30px_rgba(229,57,53,0.5)]
                hover:-translate-y-1 transition-all duration-300
                flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 flex-shrink-0" />
              Quick Quote
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onJoinNetwork}
              className="w-full sm:w-auto h-13 px-7 text-base font-bold
                rounded-xl flex items-center justify-center gap-2
                border-2 border-[#f5eb18]
                text-white bg-transparent
                hover:bg-[#f5eb18]/20
                hover:shadow-[0_10px_20px_-5px_rgba(245,235,24,0.45)]
                hover:-translate-y-1
                transition-all duration-300"
            >
              <Building2 className="w-5 h-5 flex-shrink-0" />
              Join Our Courier Network
            </Button>
          </div>
        </div>

        {/* Right column — intentionally empty, image shows through */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
