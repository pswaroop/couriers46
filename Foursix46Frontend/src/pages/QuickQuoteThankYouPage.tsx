import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardCheck, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickQuoteThankYouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden font-sans text-slate-800">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#48AEDD]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl -z-10" />

      {/* Top Left Return Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1 left-1 z-20 hidden md:block"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2 hover:bg-slate-100 text-[#134467]"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Button>
      </motion.div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl w-full bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#48AEDD] via-[#F5EB18] to-[#E53935]" />

          <div className="relative z-10 space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 mx-auto bg-[#48AEDD]/10 rounded-full flex items-center justify-center mb-6 text-[#48AEDD]"
              >
                <ClipboardCheck className="w-10 h-10" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black text-[#01B8F1] tracking-tight leading-tight"
              >
                Quote Received! <br className="hidden md:block" />
                <span className="text-[#E53935]">
                  We'll be in touch shortly.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
              >
                <p>
                  Your quote request has been submitted to the{" "}
                  <span className="font-bold text-[#48AEDD]">
                    FourSix46® Couriers team
                  </span>
                  .
                </p>
                <p>
                  One of our team members will review the job details and
                  confirm your price as soon as possible.
                </p>

                <div className="flex items-center justify-center gap-3 text-base bg-[#F5EB18]/10 py-3 px-6 rounded-full w-fit mx-auto mt-6 border border-[#F5EB18]/20">
                  <span className="w-2.5 h-2.5 bg-[#dcb004] rounded-full animate-pulse" />
                  <span className="font-medium text-[#134467]">
                    Keep an eye on your inbox — we'll confirm your quote there.
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100" />

            {/* What Happens Next */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  step: "01",
                  title: "Quote Reviewed",
                  desc: "Our team checks your job details, distance, and vehicle requirements.",
                },
                {
                  step: "02",
                  title: "Price Confirmed",
                  desc: "We'll send you a confirmed price directly to your email or phone.",
                },
                {
                  step: "03",
                  title: "Booking Confirmed",
                  desc: "Once you accept, your driver will be dispatched and your job is live.",
                },
              ].map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-3"
                >
                  <span className="text-4xl font-black text-[#E53935]/20 leading-none">
                    {step}
                  </span>
                  <h3 className="text-base font-bold text-[#134467]">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100" />

            {/* Coming Soon Section (VaultX) */}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate("/")}
                className="bg-[#134467] hover:bg-[#0d2f4a] text-white px-8 py-5 text-base rounded-xl"
              >
                Return Home
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/get-a-quote")}
                className="border-[#48AEDD] text-[#48AEDD] hover:bg-[#48AEDD]/5 px-8 py-5 text-base rounded-xl"
              >
                Submit Another Quote
              </Button>
            </motion.div>

            {/* Footer Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-lg italic text-slate-400 font-medium flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#134467]" />
                "Fast. Reliable. Professional courier solutions across the UK."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
