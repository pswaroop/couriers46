import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyChooseItem {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
}

interface WhyChooseFlipSectionProps {
  items: WhyChooseItem[];
}

const FlipCard = ({ item }: { item: WhyChooseItem }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="relative w-full h-48 sm:h-52 cursor-pointer group [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]",
          // Mobile: Flip controlled by Click state
          isFlipped ? "[transform:rotateY(180deg)]" : "",
          // Desktop: Flip controlled by Hover
          "lg:group-hover:[transform:rotateY(180deg)]"
        )}
      >
        {/* Front Side - Navy Blue Background with Yellow Border */}
        <div className="absolute inset-0 bg-[#134467] border-2 border-[#F5EB18] rounded-2xl shadow-lg hover:shadow-xl flex flex-col items-center justify-center gap-3 p-6 [backface-visibility:hidden] w-full h-full hover:border-[#F5EB18]/80">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#F5EB18]">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <p className="text-sm text-white/70 text-center leading-snug">
            {item.description}
          </p>


        </div>

        {/* Back Side - White Background with Red Border */}
        <div className="absolute inset-0 bg-white border-2 border-[#E53935] text-[#134467] rounded-2xl p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden] w-full h-full shadow-xl">
          <div className="w-8 h-8 mb-2 rounded-full bg-[#E53935]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#E53935]" />
          </div>
          <p className="text-sm font-medium leading-relaxed text-[#134467]/90">
            {item.detail}
          </p>

        </div>
      </div>
    </div>
  );
};

export const WhyChooseFlipSection = ({ items }: WhyChooseFlipSectionProps) => (
  <section className="py-20 px-4 sm:px-8 lg:px-12 bg-white relative z-20">
    <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
      <p className="text-sm uppercase tracking-widest font-bold text-[#2B7CB3]">
        Delivering differently
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#134467]">
        Why Choose <span className="text-[#E53935]">FourSix46</span>?
      </h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {items.map((item) => (
        <FlipCard key={item.title} item={item} />
      ))}
    </div>
  </section>
);