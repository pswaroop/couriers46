import { CallToActionSection } from "@/components/home/CallToActionSection";
import { CommitmentSection } from "@/components/home/CommitmentSection";
import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { MetricsSectionRetain } from "@/components/home/MetricsSectionRetain";
import { SplitFeatureSection } from "@/components/home/SplitFeatureSection";
import { TrustLogosSection } from "@/components/home/TrustLogosSection";
import { WhyChooseFlipSection } from "@/components/home/WhyChooseFlipSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { Building2, Send, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  const whyChooseItems = [
    {
      icon: Send,
      title: "Same Day Delivery",
      description:
        "Fast and reliable same day courier delivery available across the UK for urgent parcels,documents and business shipments",
      detail:
        "Route46 Couriers provides reliable same day courier services across the UK, ensuring urgent parcels, documents, and business shipments are collected quickly and delivered directly without delays.",
    },
    {
      icon: Truck,
      title: "Live Parcel Tracking",
      description:
        "Track your courier delivery in real time with full visibility from collection to final delivery",
      detail:
        "Route46 Couriers provides live parcel tracking so customers can monitor their delivery from collection to final destination with complete transparency and real-time updates.",
    },
    {
      icon: Building2,
      title: "60 Minute Collection",
      description:
        "Courier pickup available within 60 minutes in major UK cities for urgent and timecritical deliveries",
      detail:
        "In most major UK cities, Route46 Couriers can arrange collection within 60 minutes, making it ideal for urgent deliveries, time-sensitive documents, and business logistics.",
    },
  ];

  const driverBenefits = [
    "Flexible working hours with competitive courier earnings and full operational support.",
    "Earn money delivering parcels with Route46 Couriers. Driver onboarding, guidance, and insurance support available.",
    "Dedicated support team helping courier drivers manage deliveries and grow their earning potential.",
  ];

  const businessBenefits = [
    "Reliable courier delivery solutions designed for businesses that require fast and secure transport.",
    "Flexible courier solutions for businesses with regular delivery requirements.",
    "Trusted courier services helping businesses move parcels, documents, and urgent shipments across the UK.",
  ];

  const individualBenefits = [
    "Instant courier quotes with transparent pricing before booking.",
    "Courier collection available within 60 minutes in most UK cities.",
    "Suitable for parcels, documents, pallets, and urgent deliveries.",
  ];

  const commitmentBenefits = [
    "Same Day Courier Delivery Across the UK",
    "Transparent Courier Pricing with No Hidden Charges",
    "Professional Courier Drivers and Verified Transport Partners",
    "Real-Time Courier Tracking for Every Delivery",
    "Courier Collection Within 60 Minutes in Major UK Cities",
    "Dedicated 24/7 Customer Support for Urgent Deliveries",
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        backgroundImageUrl="/route462.jpeg"
        mobileBackgroundImageUrl="/route462.jpeg"
        // backgroundImageUrl="/FourSixLogo.png"
        onSendParcel={() => navigate("/quick-quote")}
        onJoinNetwork={() => navigate("/for-businesses")}
      />
      <MetricsSectionRetain />
      <TrustLogosSection />
      <WhyChooseFlipSection items={whyChooseItems} />
      <SplitFeatureSection
        eyebrow="Become a Courier Driver"
        title="Driver with Route46 Couriers"
        description="Join the Route46 Couriers driver network and deliver parcels across the UK with flexible working
opportunities. Our courier drivers handle urgent deliveries, business shipments, and same day
courier services for customers nationwide."
        image="/route461.jpeg"
        benefits={driverBenefits}
        cta={{
          label: "Drive with Route46",
          onClick: () => navigate("/become-driver"),
        }}
      />
      <SplitFeatureSection
        eyebrow="Courier Services for Businesses"
        title="Join Our Courier Network"
        description="Whether you're sending a single parcel or managing regular business deliveries,  Couriers
provides reliable same day courier services across the UK. Our courier network supports
businesses with urgent shipments, document transport, and time-critical logistics."
        image="/route463.jpeg"
        benefits={businessBenefits}
        reverse
        cta={{
          label: "Join Our Courier Network",
          onClick: () => navigate("/for-businesses"),
        }}
        highlight={
          <div>
            <p className="text-2xl font-bold text-secondary">99.2%</p>
            <p className="text-sm text-muted-foreground">
              On-Time Delivery SLA
            </p>
          </div>
        }
      />
      <SplitFeatureSection
        eyebrow="INSTANT COURIER QUOTE"
        title="Request an Instant Courier Quote Across the UK"
        description="Route46 Couriers provides fast and reliable courier services
across the UK. Request an instant courier quote and arrange collection for urgent parcels,
documents, and time-critical deliveries."
        image="/route464.jpeg"
        benefits={individualBenefits}
        cta={{ label: "Quick Quote", onClick: () => navigate("/quick-quote") }}
        highlight={
          <div>
            <p className="text-2xl font-bold text-secondary">15 mins</p>
            <p className="text-sm text-muted-foreground">
              Average courier dispatch time
            </p>
          </div>
        }
      />
      <CommitmentSection benefits={commitmentBenefits} />
      <TestimonialsSection />
      <FaqSection />
      <CallToActionSection
        onGetQuote={() => navigate("/quick-quote")}
        onBusinessEnquiry={() => navigate("/for-businesses")}
      />
      <Footer />
    </div>
  );
}
