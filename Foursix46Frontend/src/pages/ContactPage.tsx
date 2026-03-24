import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ArrowRight,
  Truck,
  User,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { LoadingAnimation } from "@/components/shared/LoadingAnimation";

// Animation utilities
const fadeInUp =
  "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards";

export default function ContactPage() {
  const navigate = useNavigate();

  // --- State for Form ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    senderType: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null,
  );
  const [submitMessage, setSubmitMessage] = useState("");

  // --- State for Custom Dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleCustomSelect = (value: string) => {
    // Create a synthetic event to match your existing handleInputChange structure
    const syntheticEvent = {
      target: {
        name: "senderType",
        value: value,
      },
    };
    handleInputChange(syntheticEvent);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.senderType.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      setSubmitMessage("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      setSubmitMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Navigate to thank you page after a short delay
        setTimeout(() => navigate("/contact-thank-you"), 1500);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          data.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "An error occurred. Please check your connection and try again.",
      );
    } finally {
      // Keep loading true if success to prevent flash before navigation
      if (submitStatus !== "success") {
        setIsLoading(false);
      }
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "operations@route46couriers.co.uk",
      link: "mailto:operations@route46couriers.co.uk",
      color: "#E53935",
      bg: "bg-[#E53935]/10",
      border: "group-hover:border-[#E53935]/30",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+44 0330 124 1966",
      link: "tel:+4403301241966",
      color: "#48AEDD",
      bg: "bg-[#48AEDD]/10",
      border: "group-hover:border-[#48AEDD]/30",
    },
    {
      icon: MapPin,
      title: "Head Office",
      content: "London, England, United Kingdom",
      link: "#",
      color: "#134467",
      bg: "bg-[#134467]/10",
      border: "group-hover:border-[#134467]/30",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Available 24/7",
      link: "#",
      color: "#dcb004",
      bg: "bg-[#F5EB18]/20",
      border: "group-hover:border-[#F5EB18]/50",
    },
  ];

  return (
    <>
      {/* Loading Animation Overlay */}
      {isLoading && <LoadingAnimation message="Sending your message..." />}

      <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans selection:bg-[#E53935] selection:text-white">
        {/* Hero Section */}
        <div className="relative py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
            <div
              className={cn(
                "inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-[#134467]/10 shadow-sm mb-8",
                fadeInUp,
              )}
            >
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
              <span className="text-[#134467] font-bold text-xs tracking-widest uppercase">
                We are always online
              </span>
            </div>

            <h1
              className={cn(
                "text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#48AEDD] mb-6 tracking-tight leading-tight",
                fadeInUp,
                "animation-delay-100",
              )}
            >
              Contact <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E53935] to-[#E53935]">
                Route46 Couriers
              </span>
            </h1>

            <p
              className={cn(
                "text-lg sm:text-xl text-[#134467]/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium",
                fadeInUp,
                "animation-delay-200",
              )}
            >
              Whether you need a courier quote, delivery support, or business
              logistics assistance, the Route46 Couriers team is ready to help.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 pb-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Grid with 'items-stretch' for equal height */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* LEFT: Contact Info */}
              <div
                className={cn(
                  "bg-white/80 backdrop-blur-sm border-2 border-[#48AEDD]/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-blue-900/5 flex flex-col h-full relative overflow-hidden",
                  fadeInUp,
                  "animation-delay-300",
                )}
              >
                <div className="relative z-10 mb-10">
                  <h2 className="text-3xl font-bold text-[#134467] mb-4 flex items-center gap-3">
                    Get in Touch
                  </h2>
                  <p className="text-[#134467]/80 text-lg leading-relaxed">
                    Reach out to us directly using the contact information
                    below, or fill out the form and we will get back to you
                    within 24 hours.
                  </p>
                </div>

                <div className="relative z-10 grid gap-6 flex-1 content-center">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className={cn(
                        "flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group/item",
                        item.border,
                      )}
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110",
                          item.bg,
                        )}
                      >
                        <item.icon
                          className="w-6 h-6"
                          style={{ color: item.color }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-xs font-extrabold uppercase tracking-wider mb-0.5"
                          style={{ color: item.color }}
                        >
                          {item.title}
                        </p>
                        <p className="text-lg font-bold text-[#134467]">
                          {item.content}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* RIGHT: Form */}
              <div
                className={cn(
                  "bg-white border-2 border-[#48AEDD]/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-blue-900/5 flex flex-col h-full",
                  fadeInUp,
                  "animation-delay-400",
                )}
              >
                <h2 className="text-3xl font-bold text-[#134467] mb-2">
                  Send a Message
                </h2>
                <p className="text-[#134467]/80 mb-8 text-lg">
                  Fill in the details below and we'll contact you shortly.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 flex-1 flex flex-col"
                >
                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800 text-sm">
                          {submitMessage}
                        </p>
                        <p className="text-green-700 text-xs mt-1">
                          Confirmation email has been sent to your inbox.
                        </p>
                      </div>
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 text-sm">
                          {submitMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label
                        htmlFor="name"
                        className="text-sm font-bold text-[#134467] ml-1 transition-colors group-focus-within:text-[#E53935]"
                      >
                        Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#E53935] transition-colors" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          disabled={isLoading}
                          required
                          aria-required="true"
                          className="h-12 pl-12 rounded-xl border-none bg-slate-50 text-[#134467] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#E53935]/100 focus-visible:bg-white transition-all duration-300 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 group">
                      <label
                        htmlFor="email"
                        className="text-sm font-bold text-[#134467] ml-1 transition-colors group-focus-within:text-[#E53935]"
                      >
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#E53935] transition-colors" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          disabled={isLoading}
                          required
                          aria-required="true"
                          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                          className="h-12 pl-12 rounded-xl border-none bg-slate-50 text-[#134467] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#E53935]/100 focus-visible:bg-white transition-all duration-300 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* CUSTOM DROPDOWN IMPLEMENTATION */}
                    <div className="space-y-2 w-full" ref={dropdownRef}>
                      <label className="text-sm font-bold text-[#134467] ml-1">
                        Who is submitting?
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          disabled={isLoading}
                          className={`
                          h-12 w-full pl-4 pr-10 text-left rounded-xl border-none 
                          bg-slate-50 text-[#134467] font-medium
                          focus:outline-none transition-all duration-300 flex items-center justify-between
                          ${isDropdownOpen ? "ring-2 ring-[#E53935] bg-white" : "hover:bg-[#E53935]/5 hover:ring-1 hover:ring-[#E53935]"}
                        `}
                        >
                          <span
                            className={
                              !formData.senderType ? "text-slate-400" : ""
                            }
                          >
                            {formData.senderType || "Select one"}
                          </span>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown
                              className={`w-4 h-4 text-[#E53935] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {["Driver", "Shipper", "Customer"].map((option) => (
                              <div
                                key={option}
                                onClick={() => handleCustomSelect(option)}
                                className="
                                px-4 py-3 cursor-pointer text-[#134467] font-medium
                                transition-colors duration-200
                                hover:bg-[#E53935] hover:text-white
                              "
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label
                      htmlFor="subject"
                      className="text-sm font-bold text-[#134467] ml-1 transition-colors group-focus-within:text-[#E53935]"
                    >
                      Subject *
                    </label>
                    <div className="relative">
                      <HelpCircle className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#E53935] transition-colors" />
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this regarding?"
                        disabled={isLoading}
                        required
                        aria-required="true"
                        className="h-12 pl-12 rounded-xl border-none bg-slate-50 text-[#134467] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#E53935]/100 focus-visible:bg-white transition-all duration-300 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group flex-1">
                    <label
                      htmlFor="message"
                      className="text-sm font-bold text-[#134467] ml-1 transition-colors group-focus-within:text-[#E53935]"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      disabled={isLoading}
                      required
                      aria-required="true"
                      className="rounded-xl border-none bg-slate-50 text-[#134467] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#E53935]/100 focus-visible:bg-white transition-all duration-300 resize-none h-full min-h-[150px] p-4 text-base leading-relaxed disabled:opacity-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold bg-[#E53935] hover:bg-[#C62828] text-white rounded-xl shadow-lg hover:shadow-[#E53935]/30 hover:-translate-y-1 transition-all duration-300 mt-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin mr-2">
                          ⏳
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "flex items-start gap-2.5 max-w-xl mx-auto mt-2 mb-8 px-5 py-3.5 rounded-2xl bg-[#134467]/5 border border-[#134467]/10 justify-center",
            fadeInUp,
            "animation-delay-200",
          )}
        >
          {/* Clock / 24-7 icon */}
          <span className="text-[#48AEDD] mt-0.5 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <p className="text-sm text-[#134467]/70 font-medium leading-relaxed text-center">
            <span className="font-bold text-[#134467]/85">Available 24/7</span>{" "}
            for urgent courier enquiries across the UK.
          </p>
        </div>

        {/* FINAL CTA SECTION */}
        <div
          className={cn("relative py-20 overflow-hidden bg-white", fadeInUp)}
        >
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
                  Get a Quick Quote
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/for-businesses")}
                  className="h-16 px-10 border-2 border-[#134467]/100 bg-transparent text-[#134467] hover:bg-[#134467]/100 text-lg font-bold rounded-full transition-all duration-300 hover:-translate-y-1"
                >
                  Join Our Courier Network{" "}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
