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
      title: "Instant Quotes",
      description: "Transparent pricing before you send.",
      detail:
        "Our pricing engine gives real-time quotes tailored to parcel size, urgency, and distance—no surprises.",
    },
    {
      icon: Truck,
      title: "Driver Excellence",
      description: "Professionals vetted & supported.",
      detail:
        "Our Okapi Network equips drivers with smart routing, live support, and performance-based incentives.",
    },
    {
      icon: Building2,
      title: "Business Benefits",
      description: "Join Okapi's Network",
      detail:
        "Grow Your Business as an Okapi's Shipping Partner with 20% discount on business rates.",
    },
  ];

  const driverBenefits = [
    "Flexible Hours, Competitive Earnings, and Support Every Mile of the Way.",
    "Drive with Freedom. Earn with FourSix46. Training and Insurance Provided.",
    "Dedicated Community Managers to Support Your Success.",
  ];

  const businessBenefits = [
    "Smarter shipping. Better margins. Happier customers. Trusted Delivery Solutions.",
    "Volume-based discounts & custom pricing models to fit your needs",
    "Let's move your Business Forward, Together & Stronger.",
  ];

  const individualBenefits = [
    "Book in Minutes, Delivered with Care.",
    "Courier Pickup within 60 minutes for Urgent Deliveries",
    "Your Parcel, Your Way - Multiple Delivery Options to Suit Your Needs.",
  ];

  const commitmentBenefits = [
    "Same-day Delivery Available",
    "Transparent Pricing with No Hidden Fees",
    "Professional and Vetted Drivers",
    "Real-time Tracking of Your Parcel",
    "60 minutes courier pickup for Priority Parcels",
    "Outstanding Customer Support",
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        backgroundImageUrl="/FourSix_truckimage.jpg"
        mobileBackgroundImageUrl="/FS46 Hero Mobile.jpg"
        // backgroundImageUrl="/FourSixLogo.png"
        onSendParcel={() => navigate("/quick-quote")}
        onJoinNetwork={() => navigate("/for-businesses")}
      />
      <MetricsSectionRetain />
      <TrustLogosSection />
      <WhyChooseFlipSection items={whyChooseItems} />
      <SplitFeatureSection
        eyebrow="Become a driver"
        title="Drive with FourSix46®"
        description="Join Our Growing Network of Professional Drivers delivering trust across the UK. Your Wheels. Your Freedom. Your Future."
        image="/Driver V2 FS46.jpg"
        benefits={driverBenefits}
        cta={{
          label: "Drive with FourSix46®",
          onClick: () => navigate("/become-driver"),
        }}
        highlight={
          <div>
            <p className="text-2xl font-bold text-secondary">£800</p>
            <p className="text-sm text-muted-foreground">
              Average Weekly Earnings
            </p>
          </div>
        }
      />
      <SplitFeatureSection
        eyebrow="Become a Shipper"
        title="Join Okapi's Network"
        description="Whether you’re shipping a single parcel or managing enterprise logistics, Okapi’s platform scales with your business needs and you’ll receive a 20% discount on business rates."
        image="/Shipper V2 FS46.jpg"
        benefits={businessBenefits}
        reverse
        cta={{
          label: "Join Okapi's Network",
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
        eyebrow="For individuals"
        title="Send Parcels Like a Pro"
        description="Enjoy Seamless Parcel Delivery with Real-Time Tracking, Instant Quotes, and Reliable Service Tailored for You."
        image="/Customer V1 FS46.jpg"
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
