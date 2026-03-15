import { Button } from "@/components/ui/button";
import { Building2, Package } from "lucide-react";

interface CallToActionSectionProps {
  onGetQuote: () => void;
  onBusinessEnquiry: () => void;
}
export const CallToActionSection = ({
  onGetQuote,
  onBusinessEnquiry,
}: CallToActionSectionProps) => (
  <section
    className="py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 relative overflow-hidden"
    style={{ backgroundColor: "#0D4064" }}
  >
    <div className="absolute inset-0 opacity-30"></div>

    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-in">
        Ready to Get Started?
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in">
        Join thousands of satisfied customers who trust FourSix46® for their
        delivery needs. Get your instant quote or reach out for business
        solutions.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in">
        <Button
          size="lg"
          variant="default"
          className="bg-white text-[#0D4064] hover:bg-white/90 hover-scale shadow-elegant w-full sm:w-auto font-bold"
          onClick={onGetQuote}
        >
          <Package className="w-5 h-5 mr-2" />
          Get a Quote Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-[#0D4064] transition-smooth w-full sm:w-auto font-bold"
          onClick={onBusinessEnquiry}
        >
          <Building2 className="w-5 h-5 mr-2" />
          Business Enquiries
        </Button>
      </div>

      {/* UPDATED METRICS SECTION 
          - grid-cols-3 forces single row on mobile
          - max-w-lg (was 3xl) brings items closer together, reducing middle space
      */}
      <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto items-center">
        <div className="text-center">
          <p className="text-xl sm:text-3xl font-bold text-white mb-1">24/7</p>
          <p className="text-[10px] sm:text-sm text-white/80 leading-tight">Service Availability</p>
        </div>
        
        {/* Center item with borders to visually separate */}
        <div className="text-center border-x border-white/10 px-2">
          <p className="text-xl sm:text-3xl font-bold text-white mb-1">25+</p>
          <p className="text-[10px] sm:text-sm text-white/80 leading-tight">Approved Drivers</p>
        </div>
        
        <div className="text-center">
          <p className="text-xl sm:text-3xl font-bold text-white mb-1">100%</p>
          <p className="text-[10px] sm:text-sm text-white/80 leading-tight">
            Insured Deliveries
          </p>
        </div>
      </div>
    </div>
  </section>
);