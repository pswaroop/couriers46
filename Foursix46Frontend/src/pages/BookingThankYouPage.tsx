import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Lock,
  Loader2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BookingThankYouPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const [isVerifying, setIsVerifying] = useState(!!sessionId);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionId && bookingId) {
      verifyPayment();
    }
  }, [sessionId, bookingId]);

  const verifyPayment = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/bookings/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, bookingId }),
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus("success");

        // Send notification email
        if (data.booking) {
          await fetch(`${apiUrl}/api/bookings/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.booking),
          });
        }
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setVerificationStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center font-sans text-slate-800">
        <Loader2 className="w-12 h-12 text-[#48AEDD] animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-[#134467]">
          Verifying Payment...
        </h2>
        <p className="text-slate-500 mt-2">
          Please wait while we confirm your booking.
        </p>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center font-sans text-slate-800 p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-[#134467] mb-4">
          Payment Verification Failed
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          We couldn't verify your payment. If you believe this is an error,
          please contact support.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/contact")} variant="outline">
            Contact Support
          </Button>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

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
        className="absolute top-6 left-6 z-20 hidden md:block"
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
                <CheckCircle className="w-10 h-10" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-black text-[#F81629] tracking-tight leading-tight"
              >
                {verificationStatus === "success"
                  ? "Payment Successful!"
                  : "Thank You!"}{" "}
                <br className="hidden md:block" />
                <span className="text-[#E53935]">
                  Your request has been received.
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
              >
                <p>
                  We appreciate you for choosing{" "}
                  <span className="font-bold text-[#48AEDD]">FourSix46®</span>{" "}
                  for your delivery needs.
                </p>
                <p>
                  Your details have been submitted, and our team is currently
                  reviewing your request. We'll contact you shortly to confirm
                  the arrangements and ensure your item is delivered with care.
                </p>

                <div className="flex items-center justify-center gap-3 text-base bg-[#F5EB18]/10 py-3 px-6 rounded-full w-fit mx-auto mt-6 border border-[#F5EB18]/20">
                  <span className="w-2.5 h-2.5 bg-[#dcb004] rounded-full animate-pulse" />
                  <span className="font-medium text-[#134467]">
                    You’ll receive updates and support throughout your delivery
                    journey.
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-slate-100" />

            {/* Coming Soon Section (VaultX) */}
            <div className="grid md:grid-cols-2 gap-12 items-center bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#134467] text-white text-xs font-bold uppercase tracking-widest">
                  <Lock className="w-3 h-3" /> Coming Soon
                </div>

                <h2 className="text-3xl font-bold text-[#F81629]">
                  Something new is on the way.
                </h2>

                <div className="space-y-2">
                  <p className="text-2xl font-light text-slate-700">
                    <span className="font-black text-[#48AEDD]">
                      FourSix46® VaultX
                    </span>
                  </p>
                  <p className="text-lg text-slate-500 font-medium">
                    The future of FourSix46® begins here.
                  </p>
                </div>
              </motion.div>

              {/* VaultX Logo Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group flex justify-center"
              >
                <div className="absolute inset-0 bg-[#48AEDD]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <img
                  src="/VaultX.jpeg"
                  alt="FourSix46® VaultX Logo"
                  className="relative w-full h-auto object-contain rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>

            {/* Footer Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-lg italic text-slate-400 font-medium flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#134467]" />
                “Secure. Encrypted. Built for business confidence.”
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
