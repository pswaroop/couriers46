import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "How do I track my parcel?",
    answer: "Use your tracking code on our website or app for real-time updates.",
  },
  {
    question: "Can I request same-day delivery?",
    answer: "Yes! Same-day delivery is available within the service area.",
  },
  {
    question: "What do I need to become a driver?",
    answer:
      "A valid UK driving license, vehicle insurance, and proof of right to work.",
  },
  {
    question: "Do businesses get custom rates?",
    answer:
      "Yes, sign up on our Business Enquiries page for tailored rates and support.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We accept credit/debit cards, NetBanking, UPI, and popular wallets for your convenience.",
  },
  {
    question: "How do I cancel or reschedule a shipment?",
    answer:
      "You can modify your shipment details via our app or contact support within 24 hours of booking.",
  },
];

export const FaqSection = () => {
  const [openItems, setOpenItems] = useState(["faq-0"]);
  const navigate = useNavigate();

  const handleAccordionChange = (values: string[]) => {
    setOpenItems(values);
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-white relative overflow-hidden">
      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#48AEDD]/10 mb-4">
            <HelpCircle className="w-6 h-6 text-[#48AEDD]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#134467]">
            Frequently Asked <span className="text-[#E53935]">Questions</span>
          </h2>
          <p className="text-[#134467]/80 mt-4 max-w-2xl mx-auto">
            Everything you need to know about our services, delivery process, and partnerships.
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={handleAccordionChange}
          className="space-y-4 animate-fade-in-up"
          style={{ animationDelay: "200ms", opacity: 0 }}
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${idx}`}
              className="
                border border-[#48AEDD]/30 rounded-2xl px-6 py-2 
                bg-white transition-all duration-300 
                hover:shadow-md hover:border-[#48AEDD]
                data-[state=open]:border-[#48AEDD] data-[state=open]:bg-[#48AEDD]/5
                data-[state=open]:shadow-lg
              "
            >
              <AccordionTrigger
                className="
                  text-left text-lg sm:text-xl font-bold text-[#134467]
                  no-underline hover:no-underline decoration-none
                  transition-colors duration-300
                  py-4
                "
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#2B7CB3] text-base leading-relaxed pb-4 pt-0 font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* View All FAQs Button */}
        <div className="mt-10 text-center animate-fade-in-up" style={{ animationDelay: "400ms", opacity: 0 }}>
          <button
            onClick={() => navigate("/faqs")}
            className="
              inline-flex items-center gap-3 px-8 py-4 
              bg-gradient-to-r from-[#134467] to-[#48AEDD] 
              text-white font-bold text-lg rounded-full 
              shadow-lg hover:shadow-xl 
              transform hover:scale-105 
              transition-all duration-300 
              group
            "
          >
            View All FAQs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};