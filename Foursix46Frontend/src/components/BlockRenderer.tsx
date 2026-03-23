// import React from "react";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";

// interface Block {
//   type: string;
//   [key: string]: any;
// }

// interface Props {
//   blocks: Block[];
// }

// export default function BlockRenderer({ blocks }: Props) {
//   const navigate = useNavigate();

//   if (!blocks || blocks.length === 0) return null;

//   return (
//     <div className="space-y-28">
//       {blocks.map((block, index) => {
//         switch (block.type) {

//           // ==========================
//           // TEXT SECTION
//           // ==========================
//           case "textSection":
//             return (
//               <section key={index} className="max-w-4xl mx-auto">
//                 <h2 className="text-3xl font-bold text-[#134467] mb-6">
//                   {block.heading}
//                 </h2>
//                 <div
//                   className="text-lg text-[#134467]/80 leading-relaxed"
//                   dangerouslySetInnerHTML={{ __html: block.content }}
//                 />
//               </section>
//             );

//           // ==========================
//           // BULLET SECTION
//           // ==========================
//           case "bulletSection":
//             return (
//               <section key={index} className="max-w-4xl mx-auto">
//                 <h2 className="text-3xl font-bold text-[#134467] mb-6">
//                   {block.heading}
//                 </h2>
//                 <ul className="space-y-3">
//                   {block.bullets.map((item: string, i: number) => (
//                     <li
//                       key={i}
//                       className="flex items-start gap-3 text-[#134467]/80"
//                     >
//                       <span className="w-2 h-2 mt-2 bg-[#E53935] rounded-full"></span>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//             );

//           // ==========================
//           // IMAGE LEFT TEXT RIGHT
//           // ==========================
//           case "imageLeftTextRight":
//             return (
//               <section
//                 key={index}
//                 className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
//               >
//                 <img
//                   src={block.image}
//                   alt={block.heading}
//                   className="rounded-3xl shadow-lg"
//                 />
//                 <div>
//                   <h2 className="text-3xl font-bold text-[#134467] mb-6">
//                     {block.heading}
//                   </h2>
//                   <div
//                     className="text-lg text-[#134467]/80 leading-relaxed"
//                     dangerouslySetInnerHTML={{ __html: block.content }}
//                   />
//                 </div>
//               </section>
//             );

//           // ==========================
//           // IMAGE RIGHT TEXT LEFT
//           // ==========================
//           case "imageRightTextLeft":
//             return (
//               <section
//                 key={index}
//                 className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-6"
//               >
//                 <div>
//                   <h2 className="text-3xl font-bold text-[#134467] mb-6">
//                     {block.heading}
//                   </h2>
//                   <div
//                     className="text-lg text-[#134467]/80 leading-relaxed"
//                     dangerouslySetInnerHTML={{ __html: block.content }}
//                   />
//                 </div>
//                 <img
//                   src={block.image}
//                   alt={block.heading}
//                   className="
//                     w-full
//                     h-[320px]
//                     md:h-[420px]
//                     object-cover
//                     rounded-3xl
//                     shadow-xl
//                   "
//                 />
//               </section>
//             );

//           // ==========================
//           // CALLOUT CARD
//           // ==========================
//           case "calloutCard":
//             return (
//               <section key={index} className="max-w-4xl mx-auto px-6">
//                 <div className="bg-[#48AEDD]/10 p-10 rounded-[2rem] text-center">
//                   <h3 className="text-2xl font-bold text-[#48AEDD] mb-4">
//                     {block.title}
//                   </h3>
//                   <p className="text-[#134467]/80">{block.text}</p>
//                 </div>
//               </section>
//             );

//           // ==========================
//           // CTA BANNER
//           // ==========================
//           case "ctaBanner":
//             return (
//               <section key={index} className="max-w-6xl mx-auto text-center">
//                 <div className="bg-[#E53935] text-white p-14 rounded-[2.5rem]">
//                   <h3 className="text-3xl font-bold mb-4">
//                     {block.title}
//                   </h3>
//                   <p className="mb-8 text-white/90">{block.text}</p>
//                   <button
//                     onClick={() => navigate(block.buttonLink)}
//                     className="bg-white text-[#E53935] px-8 py-4 rounded-full font-bold hover:scale-105 transition"
//                   >
//                     {block.buttonText}
//                   </button>
//                 </div>
//               </section>
//             );

//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: string;
  [key: string]: any;
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "bulletSection":
      return <BulletSection block={block} />;
    case "imageLeftTextRight":
      return <ImageSplit block={block} imagePos="left" />;
    case "imageRightTextLeft":
      return <ImageSplit block={block} imagePos="right" />;
    case "calloutCard":
      return <CalloutCard block={block} />;
    case "ctaBanner":
      return <CtaBannerBlock block={block} />;
    case "richText":
      return <RichTextBlock block={block} />;
    case "textSection": // ← ADD THIS
      return <RichTextBlock block={block} />;
    default:
      return null;
  }
}

/* ─────────────────────────────
   BULLET SECTION
───────────────────────────── */
function BulletSection({ block }: { block: Block }) {
  return (
    <section className="py-14 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {block.heading && (
          <h2 className="text-2xl sm:text-3xl font-black text-[#134467] mb-8 leading-tight">
            {block.heading}
          </h2>
        )}
        {block.bullets?.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-4">
            {block.bullets.map((bullet: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <CheckCircle2 className="w-5 h-5 text-[#E53935] flex-shrink-0 mt-0.5" />
                <span className="text-[#134467]/80 leading-relaxed text-[15px]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────
   IMAGE SPLIT  ← FIX: uses aspect-ratio container so image renders
───────────────────────────── */
function ImageSplit({
  block,
  imagePos,
}: {
  block: Block;
  imagePos: "left" | "right";
}) {
  const [imgError, setImgError] = useState(false);

  const ImageEl = (
    /* ✅ KEY FIX: explicit aspect-ratio gives the container a real height */
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-lg flex-shrink-0">
      {!imgError && block.imageUrl ? (
        <img
          src={block.imageUrl}
          alt={block.heading || ""}
          // ✅ no-referrer bypasses hotlink protection on many CDNs
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );

  const TextEl = (
    <div className="flex flex-col justify-center py-4">
      {block.heading && (
        <h2 className="text-2xl sm:text-3xl font-black text-[#134467] mb-5 leading-tight">
          {block.heading}
        </h2>
      )}
      {block.richText && (
        <div
          dangerouslySetInnerHTML={{ __html: block.richText }}
          className="prose prose-lg max-w-none text-[#134467]/75 leading-relaxed
            prose-headings:text-[#134467] prose-a:text-[#48AEDD]"
        />
      )}
    </div>
  );

  return (
    <section className="py-14 px-5 sm:px-6">
      <div
        className={cn(
          "max-w-6xl mx-auto grid gap-10 md:gap-14 items-center",
          "grid-cols-1 md:grid-cols-2",
        )}
      >
        {/* On mobile always image first; on md+ respect imagePos */}
        <div className={cn(imagePos === "right" && "md:order-2")}>
          {ImageEl}
        </div>
        <div className={cn(imagePos === "right" && "md:order-1")}>{TextEl}</div>
      </div>
    </section>
  );
}

/* ─────────────────────────────
   CALLOUT CARD
───────────────────────────── */
function CalloutCard({ block }: { block: Block }) {
  return (
    <section className="py-6 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#134467] to-[#1a5a8a] rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#48AEDD]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F5EB18]/10 rounded-full blur-3xl pointer-events-none" />

          {block.title && (
            <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              {block.title}
            </h3>
          )}
          {block.shortText && (
            <p className="relative z-10 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              {block.shortText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────
   CTA BANNER
───────────────────────────── */
function CtaBannerBlock({ block }: { block: Block }) {
  const navigate = useNavigate();
  return (
    <section className="py-6 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto bg-[#E53935] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-red-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c0392b] to-[#E53935] opacity-80" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          {block.title && (
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              {block.title}
            </h3>
          )}
          {block.richText && (
            <div
              dangerouslySetInnerHTML={{ __html: block.richText }}
              className="prose prose-invert max-w-none text-white/80 mb-8 mx-auto max-w-xl"
            />
          )}
          {block.buttonText && (
            <button
              onClick={() => navigate(block.buttonLink || "/quick-quote")}
              className="inline-flex items-center gap-2 bg-white text-[#E53935] font-black
                uppercase tracking-wide px-8 sm:px-10 py-4 rounded-2xl text-base
                shadow-xl hover:scale-105 active:scale-95 transition-all
                w-full sm:w-auto justify-center"
            >
              {block.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────
   RICH TEXT BLOCK
───────────────────────────── */
function RichTextBlock({ block }: { block: Block }) {
  return (
    <section className="py-10 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {block.heading && (
          <h2 className="text-2xl sm:text-3xl font-black text-[#134467] mb-6">
            {block.heading}
          </h2>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: block.content || block.richText || "",
          }}
          className="prose prose-lg max-w-none text-[#134467]/75
            prose-headings:text-[#134467] prose-a:text-[#48AEDD]"
        />
      </div>
    </section>
  );
}
