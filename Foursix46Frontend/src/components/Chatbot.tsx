import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[]; // Keywords for search matching
}

interface FAQCategory {
  id: string;
  title: string;
  questions: FAQItem[];
}

// --- COMPLETE FAQ DATA WITH KEYWORDS ---
const faqData: FAQCategory[] = [
  {
    id: "general",
    title: "General Info",
    questions: [
      {
        question: "What is Route46 Couriers?",
        answer:
          "Route46 Couriers is a UK-based same-day and express delivery service operated by Route46 Global Ltd, transporting goods across the UK mainland under the RHA Conditions of Carriage 2024.",
        keywords: [
          "who",
          "what",
          "about",
          "company",
          "route46",
          "courier",
          "service",
        ],
      },
      {
        question: "Which areas do you cover?",
        answer:
          "We currently serve England, Wales and Scotland (UK mainland). Northern Ireland, Channel Islands, Isle of Man and international deliveries require approval.",
        keywords: [
          "area",
          "cover",
          "location",
          "where",
          "deliver",
          "scotland",
          "wales",
          "england",
          "uk",
        ],
      },
      {
        question: "What services do you offer?",
        answer:
          "• Same-Day Collection & Delivery (best-effort)\n• 2–4 Day Standard Delivery\n• Scheduled B2B Collections\n• Contract Logistics\n• Multi-drop support\n• Express point-to-point delivery",
        keywords: [
          "service",
          "offer",
          "same-day",
          "next-day",
          "standard",
          "b2b",
          "collection",
        ],
      },
      {
        question: "Are you insured?",
        answer:
          "Yes — we hold Goods-in-Transit and Public Liability insurance. Maximum compensation follows RHA limits unless enhanced cover is pre-arranged in writing.",
        keywords: [
          "insurance",
          "insured",
          "liability",
          "cover",
          "protection",
          "compensation",
        ],
      },
    ],
  },
  {
    id: "booking",
    title: "Booking & Collection",
    questions: [
      {
        question: "How do I book a delivery?",
        answer: "Use our Instant Quote & Online Booking Tool on our website.",
        keywords: ["book", "booking", "order", "schedule", "quote"],
      },
      {
        question: "Can I schedule a collection?",
        answer: "Yes — you can schedule a collection up to 7 days in advance.",
        keywords: ["schedule", "collection", "advance", "future", "pickup"],
      },
      {
        question: "What happens after I book?",
        answer:
          "You’ll receive:\n• Booking confirmation\n• Driver assignment\n• A live tracking link once the driver is dispatched",
        keywords: ["after booking", "confirmation", "next", "happen"],
      },
      {
        question: "What if I’m not ready?",
        answer:
          "We allow 10 minutes free waiting time. After that, waiting charges may apply or the job may be marked as failed collection.",
        keywords: ["not ready", "late", "waiting", "wait time", "charges"],
      },
      {
        question: "What if pickup fails?",
        answer:
          "If nobody is available at pickup, it is marked as a failed collection and charges may apply.",
        keywords: ["failed", "missed", "nobody", "pickup fail"],
      },
    ],
  },
  {
    id: "packaging",
    title: "Packaging & Items",
    questions: [
      {
        question: "What items can I send?",
        answer: "Most standard business parcels, documents and boxed goods.",
        keywords: ["item", "send", "goods", "parcel", "box", "document"],
      },
      {
        question: "What items are prohibited?",
        answer:
          "Under RHA rules, we cannot carry:\n• Cash or negotiable instruments\n• High-value jewellery or watches\n• Firearms, weapons, ammunition\n• Hazardous, flammable, toxic or explosive goods\n• Fragile glass/ceramics (unless professionally packaged)\n• Animals/livestock\n• Illegal goods\n\nSending prohibited goods voids all liability.",
        keywords: [
          "prohibited",
          "banned",
          "illegal",
          "dangerous",
          "hazardous",
          "glass",
          "cash",
          "animals",
        ],
      },
      {
        question: "Do you check parcels?",
        answer:
          "We may inspect consignments if we suspect unsafe or prohibited contents.",
        keywords: ["check", "inspect", "open", "scan"],
      },
      {
        question: "How should I package?",
        answer:
          "Use strong packaging and protective internal padding. Damage due to poor packaging is excluded under RHA Conditions.",
        keywords: ["pack", "packaging", "box", "padding", "wrap"],
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery & Tracking",
    questions: [
      {
        question: "How do I track my parcel?",
        answer: "You’ll receive a live tracking link by email/SMS.",
        keywords: ["track", "tracking", "where", "status", "location"],
      },
      {
        question: "Tracking link issue?",
        answer: "Use the Contact Us button so we can resend it.",
        keywords: ["link", "issue", "broken", "not working"],
      },
      {
        question: "Recipient unavailable?",
        answer:
          "We will:\n• Attempt delivery once\n• Contact you for instructions\n• Return or re-deliver (additional fees may apply)",
        keywords: [
          "recipient",
          "unavailable",
          "missed",
          "not home",
          "failed delivery",
        ],
      },
      {
        question: "Guaranteed delivery times?",
        answer:
          "Only if explicitly agreed in writing as a special guaranteed service. All other services are best-effort, aligned with RHA rules.",
        keywords: ["guarantee", "time", "slot", "exact", "deadline"],
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Payments",
    questions: [
      {
        question: "How much does delivery cost?",
        answer:
          "Use the Instant Quote tool — pricing depends on weight, size and distance.",
        keywords: [
          "cost",
          "price",
          "pricing",
          "rate",
          "quote",
          "expensive",
          "cheap",
        ],
      },
      {
        question: "Payment methods?",
        answer:
          "Card payments, Apple Pay, Google Pay, and business credit accounts.",
        keywords: ["pay", "payment", "card", "cash", "wallet"],
      },
      {
        question: "Business credit accounts?",
        answer: "Yes — approved shippers receive 30-day terms.",
        keywords: ["credit", "account", "business account", "terms", "30 days"],
      },
      {
        question: "Will I get a VAT invoice?",
        answer: "Yes — automatically emailed.",
        keywords: ["vat", "invoice", "receipt", "tax"],
      },
    ],
  },
  {
    id: "refunds",
    title: "Refunds & Cancellations",
    questions: [
      {
        question: "Can I cancel my booking?",
        answer: "Yes — see our Refund & Cancellation Policy.",
        keywords: ["cancel", "cancellation", "stop"],
      },
      {
        question: "When am I eligible for refund?",
        answer:
          "• Before driver dispatch → partial refund (minus admin fee)\n• After dispatch/driver assignment → partial refund only\n• After arrival or failed collection → no refund",
        keywords: ["refund", "money back", "eligible", "return"],
      },
      {
        question: "Compensation for delays?",
        answer:
          "Only if you purchased a guaranteed service in writing, and the delay was not caused by events outside our control (traffic, weather, etc.).",
        keywords: ["compensation", "delay", "late", "money back"],
      },
    ],
  },
  {
    id: "damage",
    title: "Damage, Loss & Insurance",
    questions: [
      {
        question: "Lost or damaged parcel?",
        answer: "Report within 24 hours, then follow RHA claim timeframes.",
        keywords: ["lost", "damaged", "broken", "missing", "claim"],
      },
      {
        question: "Compensation limit?",
        answer:
          "Under RHA Conditions 2024:\n➡ £1,300 per tonne of gross weight (approx. £1.30 per kg)\n(Unless higher cover was arranged before transit.)",
        keywords: ["limit", "value", "coverage", "max", "tonne"],
      },
      {
        question: "What is not covered?",
        answer:
          "• Fragile goods without adequate packaging\n• Prohibited items\n• Goods damaged due to insufficient protection\n• Items left in a “safe place” at your request\n• Indirect/consequential losses",
        keywords: ["excluded", "covered", "policy", "safe place"],
      },
    ],
  },
  {
    id: "shippers",
    title: "For Shippers (B2B)",
    questions: [
      {
        question: "How do I become a shipper?",
        answer:
          "Complete our Shipper Application and sign:\n• Shipper Agreement\n• Shipper Policy Acknowledgment\n• RHA Conditions acceptance",
        keywords: ["become shipper", "business", "b2b", "apply", "join"],
      },
      {
        question: "Bulk discounts?",
        answer: "Yes — volume-based rates are available.",
        keywords: ["discount", "bulk", "volume", "cheaper"],
      },
      {
        question: "Multiple users?",
        answer: "Yes — you can add multiple team members to one account.",
        keywords: ["users", "team", "multiple", "staff"],
      },
      {
        question: "How do I track shipments?",
        answer: "Through your Shipper Dashboard.",
        keywords: ["track", "dashboard", "portal"],
      },
    ],
  },
  {
    id: "drivers",
    title: "Drivers",
    questions: [
      {
        question: "Become a driver?",
        answer: "Apply online and upload required documentation.",
        keywords: ["driver", "job", "work", "apply", "courier"],
      },
      {
        question: "Documents needed?",
        answer:
          "• Driving licence\n• Courier/business-use insurance\n• Right to work documents\n• Proof of address\n• Vehicle documents (if using own vehicle)",
        keywords: ["document", "license", "insurance", "requirement"],
      },
      {
        question: "Are drivers employed?",
        answer:
          "No — all drivers operate as independent subcontractors (self-employed).",
        keywords: [
          "employed",
          "employee",
          "contract",
          "subcontractor",
          "self-employed",
        ],
      },
      {
        question: "Do you provide training?",
        answer:
          "Yes — including Self-Employed Driver Policy, Road Risk & Safety, and Identity verification.",
        keywords: ["train", "training", "learn"],
      },
      {
        question: "How are drivers paid?",
        answer: "Payments follow the Driver Agreement schedule.",
        keywords: ["pay", "salary", "wage", "money"],
      },
    ],
  },
  {
    id: "safety",
    title: "Safety & Compliance",
    questions: [
      {
        question: "Are deliveries insured?",
        answer:
          "Yes — subject to packaging and item type. Compensation follows RHA limits unless upgraded.",
        keywords: ["insured", "insurance", "safety"],
      },
      {
        question: "Do drivers carry ID?",
        answer: "Yes — ID and proof of assignment are mandatory.",
        keywords: ["id", "identification", "badge"],
      },
      {
        question: "Proof of delivery?",
        answer: "Yes — signature, photo, or timestamp.",
        keywords: ["proof", "pod", "signature", "photo"],
      },
      {
        question: "Road incidents?",
        answer:
          "Drivers follow our Road Risk Policy and report incidents immediately.",
        keywords: ["accident", "incident", "crash"],
      },
    ],
  },
  {
    id: "tech",
    title: "Tech & System",
    questions: [
      {
        question: "Will I get notifications?",
        answer: "Yes — email/SMS updates throughout the delivery.",
        keywords: ["notification", "sms", "email", "alert"],
      },
      {
        question: "Where are my invoices?",
        answer: "Inside your account dashboard.",
        keywords: ["invoice", "bill", "receipt"],
      },
      {
        question: "Edit booking?",
        answer: "Contact support — changes may incur fees.",
        keywords: ["edit", "change", "modify", "amend"],
      },
      {
        question: "Save addresses?",
        answer: "Yes — shipper accounts can save unlimited addresses.",
        keywords: ["save", "address", "book"],
      },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding",
    questions: [
      {
        question: "How long is onboarding?",
        answer: "• Shippers: 1–2 working days\n• Drivers: 1–3 working days",
        keywords: ["long", "time", "onboarding", "approve"],
      },
      {
        question: "Account not approved?",
        answer: "We will contact you with the reason and next steps.",
        keywords: ["declined", "rejected", "approved", "status"],
      },
      {
        question: "Can I close account?",
        answer: "Yes — simply request via email.",
        keywords: ["close", "delete", "remove", "account"],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & Support",
    questions: [
      {
        question: "How do I contact support?",
        answer: "Via live chat, email, or the support form.",
        keywords: ["contact", "support", "help", "email", "chat"],
      },
      {
        question: "Phone support?",
        answer: "Available depending on service level or shipper agreement.",
        keywords: ["phone", "call", "number", "speak"],
      },
      {
        question: "Urgent issue?",
        answer: "Use the Contact Us button for priority support.",
        keywords: ["urgent", "emergency", "fast"],
      },
    ],
  },
];

// --- HELPER TO FIND ANSWERS VIA KEYWORDS ---
const findAnswer = (query: string): string => {
  const lowerQuery = query.toLowerCase().trim();

  // 1. Check for greetings
  if (
    ["hello", "hi", "hey", "good morning", "greetings"].some((w) =>
      lowerQuery.includes(w),
    )
  ) {
    return "Hello! 👋 Select a topic below or type your question to search our FAQ.";
  }

  // 2. Score-based Keyword Matching
  let bestMatch = { answer: "", score: 0 };

  for (const category of faqData) {
    for (const item of category.questions) {
      let score = 0;

      // Check against defined keywords
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (lowerQuery.includes(keyword.toLowerCase())) {
            score += 2; // Keywords are worth more
          }
        }
      }

      // Check against the question text itself
      if (item.question.toLowerCase().includes(lowerQuery)) {
        score += 3; // Direct question match is strong
      }

      if (score > bestMatch.score) {
        bestMatch = { answer: item.answer, score };
      }
    }
  }

  if (bestMatch.score > 0) {
    return bestMatch.answer;
  }

  return "I couldn't find a specific answer for that. Please try picking a category below or contact support for assistance.";
};

export const Chatbot = () => {
  const { pathname } = useLocation();
  const hiddenOnPaths = ["/admin/dashboard", "/admin/login"];
  if (hiddenOnPaths.includes(pathname)) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to Route46 Support. Browse categories below or type your question.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory | null>(
    null,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Handle Sending Messages (User Typed)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: findAnswer(userMessage.text),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  // Handle Clicking a Question (From Suggestions)
  const handleQuestionClick = (questionText: string, answerText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: questionText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answerText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatButtonRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;
      const target = e.target as HTMLElement;
      if (
        !chatBoxRef.current?.contains(target) &&
        !chatButtonRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      <style>{`
        .thin-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
      `}</style>

      <div
        ref={chatButtonRef}
        className={cn(
          "fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 transition-all duration-300",
          isOpen && "opacity-0 pointer-events-none",
        )}
      >
        <div className="relative">
          <button
            onClick={() => {
              if (!isOpen) {
                window.dispatchEvent(new Event("closeMobileMenu"));
              }
              setIsOpen(!isOpen);
            }}
            className={cn(
              "relative w-16 h-16 rounded-full bg-[#F5EB18] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#134467] hover:scale-110",
              isOpen && "scale-90",
            )}
            aria-label="Toggle chat"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-7 h-7" />
            )}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                1
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        ref={chatBoxRef}
        className={cn(
          "fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100%-2rem)] max-w-sm h-[calc(100vh-8rem)] max-h-[600px] bg-card border-2 border-secondary/20 rounded-xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="gradient-accent p-4 rounded-t-xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Customer Support</h3>
              <p className="text-white/80 text-xs">FAQ & Live Help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages - Flexible Area */}
        <div className="chatbot-messages flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-background to-accent/5 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-xl p-3 shadow-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/10 text-secondary border border-secondary/20",
                )}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {message.text}
                </p>
                <span className="text-[10px] opacity-60 mt-1 block text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* SUGGESTIONS AREA (Scrollable if content is long) */}
        <div className="flex-shrink-0 border-t border-secondary/10 bg-card/50 backdrop-blur-sm flex flex-col">
          {/* Title / Back Button Row */}
          <div className="px-4 pt-3 pb-1 flex items-center justify-between sticky top-0 bg-card/95 z-10">
            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wide flex items-center gap-2">
              {activeCategory ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {activeCategory.title}
                </>
              ) : (
                "Select a Topic:"
              )}
            </p>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-[10px] text-primary flex items-center hover:underline font-medium bg-primary/5 px-2 py-1 rounded-md"
                aria-label="Go back to categories"
              >
                <ChevronLeft className="w-3 h-3 mr-0.5" /> Back
              </button>
            )}
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto thin-scrollbar px-4 pb-3 pt-1 max-h-[300px]">
            <div className="flex flex-wrap gap-2">
              {/* VIEW 1: CATEGORIES */}
              {!activeCategory &&
                faqData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category)}
                    className="text-xs px-4 py-3 rounded-lg bg-white hover:bg-secondary/5 text-secondary border border-secondary/10 transition-colors text-left w-full flex items-center justify-between group shadow-sm"
                  >
                    <span className="font-medium">{category.title}</span>
                    <ChevronRight className="w-3 h-3 text-secondary/40 group-hover:text-primary transition-colors" />
                  </button>
                ))}

              {/* VIEW 2: QUESTIONS (Inside Category) */}
              {activeCategory &&
                activeCategory.questions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleQuestionClick(item.question, item.answer)
                    }
                    className="text-xs px-4 py-3 rounded-lg bg-white hover:bg-primary/5 text-secondary border border-secondary/10 hover:border-primary/20 transition-colors text-left w-full shadow-sm hover:shadow-md"
                  >
                    {item.question}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-secondary/10 bg-card rounded-b-xl flex-shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 h-10 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              variant="brand"
              size="icon"
              className="flex-shrink-0 w-10 h-10"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
