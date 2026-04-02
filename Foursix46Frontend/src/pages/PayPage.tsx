// import { useState, useMemo } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { CreditCard, ArrowLeft } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import Footer from "@/components/Footer";

// export default function PayPage() {
//   const navigate = useNavigate();

//   // Fallback to localhost if env missing
//   const API_URL = import.meta.env.VITE_API_URL || "https://route46.couriers.uk";

//   /* ===============================
//      STATE
//   =============================== */

//   const [loading, setLoading] = useState(false);

//   const [payment, setPayment] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     amountNet: "",
//     reference: "",
//   });

//   /* ===============================
//      VAT CALCULATION (CLIENT RULE)
//      VAT = Net × 0.20
//      Total = Net + VAT
//   =============================== */

//   const net = Number(payment.amountNet) || 0;

//   const vatAmount = useMemo(() => {
//     return Number((net * 0.2).toFixed(2));
//   }, [net]);

//   const totalAmount = useMemo(() => {
//     return Number((net + vatAmount).toFixed(2));
//   }, [net, vatAmount]);

//   /* ===============================
//      INPUT HANDLER
//   =============================== */

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;

//     setPayment((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /* ===============================
//      SUBMIT → BACKEND → STRIPE
//   =============================== */

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!payment.name || !payment.email || !payment.reference) {
//       toast.error("Please complete all required fields.");
//       return;
//     }

//     if (net < 1) {
//       toast.error("Minimum payment amount is £1.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_URL}/api/payments/create-checkout-session`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: payment.name.trim(),
//             email: payment.email.trim(),
//             phone: payment.phone?.trim(),
//             netAmount: net,
//             reference: payment.reference.trim(),
//           }),
//         },
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Payment failed");
//       }

//       if (!data.url) {
//         throw new Error("Stripe session URL not returned");
//       }

//       // Redirect to Stripe Checkout
//       window.location.href = data.url;
//     } catch (error: any) {
//       console.error("Payment error:", error);
//       toast.error(error.message || "Something went wrong.");
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
//         <div className="max-w-3xl mx-auto">
//           {/* BACK BUTTON */}
//           <Button
//             variant="ghost"
//             className="mb-6"
//             onClick={() => navigate("/")}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Button>

//           <Card className="p-8 rounded-3xl shadow-xl">
//             {/* HEADER */}
//             <div className="text-center mb-10">
//               <div className="w-16 h-16 mx-auto bg-[#F5EB18] rounded-full flex items-center justify-center mb-4">
//                 <CreditCard className="w-8 h-8 text-[#134467]" />
//               </div>

//               <h1 className="text-4xl font-bold text-[#F81629]">
//                 Secure Payment
//               </h1>

//               <p className="text-[#48AEDD] mt-2">
//                 Pay your invoice securely via Stripe
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* CUSTOMER INFO */}
//               <Card className="p-6 space-y-4">
//                 <h2 className="font-semibold text-lg">Customer Information</h2>

//                 <Input
//                   name="name"
//                   placeholder="Full Name"
//                   required
//                   value={payment.name}
//                   onChange={handleChange}
//                 />

//                 <Input
//                   name="email"
//                   type="email"
//                   placeholder="Email Address"
//                   required
//                   value={payment.email}
//                   onChange={handleChange}
//                 />

//                 <Input
//                   name="phone"
//                   placeholder="Phone (Optional)"
//                   value={payment.phone}
//                   onChange={handleChange}
//                 />
//               </Card>

//               {/* PAYMENT DETAILS */}
//               <Card className="p-6 space-y-4">
//                 <h2 className="font-semibold text-lg">Payment Details</h2>

//                 <Input
//                   type="number"
//                   name="amountNet"
//                   min="1"
//                   step="0.01"
//                   placeholder="Amount (ex VAT) £"
//                   required
//                   value={payment.amountNet}
//                   onChange={handleChange}
//                 />

//                 <Input value="VAT Rate: 20%" disabled />

//                 <Textarea
//                   name="reference"
//                   required
//                   placeholder="Payment Reference (e.g. Quote Ref FSC-QQ-0007 or Job payment – London to Bristol)"
//                   value={payment.reference}
//                   onChange={handleChange}
//                 />
//               </Card>

//               {/* BREAKDOWN */}
//               <Card className="p-6 space-y-3 bg-gray-50">
//                 <h2 className="font-semibold text-lg">Payment Breakdown</h2>

//                 <div className="flex justify-between">
//                   <span>Net Amount</span>
//                   <span>£{net.toFixed(2)}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>VAT (20%)</span>
//                   <span>£{vatAmount.toFixed(2)}</span>
//                 </div>

//                 <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                   <span>Total Payable</span>
//                   <span>£{totalAmount.toFixed(2)}</span>
//                 </div>
//               </Card>

//               {/* PAY BUTTON */}
//               <Button
//                 type="submit"
//                 className="w-full text-lg py-6"
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Redirecting to Stripe..."
//                   : "Pay Securely via Stripe"}
//               </Button>
//             </form>
//           </Card>
//         </div>

//         <Footer />
//       </div>
//     </>
//   );
// }
// src/pages/PayPage.tsx

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useVatSettings } from "@/hooks/useVatSettings";

export default function PayPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://route46.couriers.uk";

  /* ─────────────────────────────────────────────────────────────────────────
     VAT SETTINGS — fetched dynamically from admin dashboard
  ───────────────────────────────────────────────────────────────────────── */
  const { settings: vatSettings, loading: vatLoading } = useVatSettings();

  const vatEnabled = vatSettings.vatEnabled;
  const vatRate = vatSettings.vatRate; // e.g. 20 → 20%

  /* ─────────────────────────────────────────────────────────────────────────
     LOCAL STATE
  ───────────────────────────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [payment, setPayment] = useState({
    name: "",
    email: "",
    phone: "",
    amountNet: "",
    reference: "",
  });

  /* ─────────────────────────────────────────────────────────────────────────
     VAT CALCULATION
     VAT   = Net × (vatRate / 100)   — only when vatEnabled
     Total = Net + VAT
  ───────────────────────────────────────────────────────────────────────── */
  const net = Number(payment.amountNet) || 0;

  const vatAmount = useMemo(
    () => (vatEnabled ? Number((net * (vatRate / 100)).toFixed(2)) : 0),
    [net, vatEnabled, vatRate],
  );

  const totalAmount = useMemo(
    () => Number((net + vatAmount).toFixed(2)),
    [net, vatAmount],
  );

  /* ─────────────────────────────────────────────────────────────────────────
     HANDLERS
  ───────────────────────────────────────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payment.name || !payment.email || !payment.reference) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (net < 1) {
      toast.error("Minimum payment amount is £1.");
      return;
    }
    if (!confirmed) {
      toast.error("Please confirm the payment details are correct.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: payment.name.trim(),
            email: payment.email.trim(),
            phone: payment.phone?.trim(),
            netAmount: net,
            vatEnabled,
            vatRate,
            reference: payment.reference.trim(),
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Payment failed");
      if (!data.url) throw new Error("Stripe session URL not returned");

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
        <div className="max-w-3xl mx-auto">
          {/* ── BACK BUTTON ── */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-8 rounded-3xl shadow-xl">
            {/* ── HEADER ── */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto bg-[#F5EB18] rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-[#134467]" />
              </div>
              <h1 className="text-4xl font-bold text-[#F81629]">
                Secure Payment
              </h1>
              <p className="text-[#48AEDD] mt-2">
                Pay your invoice securely via Stripe
              </p>
            </div>

            {/* ── LEGAL NOTICE ── */}
            <div className="mb-8 rounded-2xl border border-[#134467]/10 bg-[#134467]/5 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#134467] mt-0.5 shrink-0" />
                <p className="text-sm text-[#134467]/80 leading-relaxed">
                  Payments are processed securely via{" "}
                  <strong className="text-[#134467]">Stripe</strong>, a globally
                  trusted payment provider. FourSix46&reg; Global Ltd does not
                  store or have access to your card details.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#134467] mt-0.5 shrink-0" />
                <p className="text-sm text-[#134467]/80 leading-relaxed">
                  This payment page is used for invoice settlement, service
                  payments, or agreed charges across FourSix46&reg; ventures.
                  Please ensure the payment amount and reference details are
                  correct before proceeding.
                </p>
              </div>
              <p className="text-sm text-[#134467]/70 leading-relaxed pl-8">
                If you have any questions regarding this payment, please contact
                our team before completing the transaction.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ── CUSTOMER INFO ── */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Customer Information</h2>

                <Input
                  name="name"
                  placeholder="Full Name *"
                  required
                  value={payment.name}
                  onChange={handleChange}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={payment.email}
                  onChange={handleChange}
                />
                <Input
                  name="phone"
                  placeholder="Phone (Optional)"
                  value={payment.phone}
                  onChange={handleChange}
                />
              </Card>

              {/* ── PAYMENT DETAILS ── */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Payment Details</h2>

                <Input
                  type="number"
                  name="amountNet"
                  min="1"
                  step="0.01"
                  placeholder="Amount (ex VAT) £ *"
                  required
                  value={payment.amountNet}
                  onChange={handleChange}
                />

                {/* Dynamic VAT indicator — driven by admin settings */}
                {vatLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading VAT settings…
                  </div>
                ) : vatEnabled ? (
                  <Input value={`VAT Rate: ${vatRate}%`} disabled readOnly />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-muted/40 text-sm text-muted-foreground">
                    VAT: Not applicable
                  </div>
                )}

                <Textarea
                  name="reference"
                  required
                  placeholder="Payment Reference (e.g. Quote Ref FSC-QQ-0007 or Job payment – London to Bristol) *"
                  value={payment.reference}
                  onChange={handleChange}
                />
              </Card>

              {/* ── BREAKDOWN ── */}
              <Card className="p-6 space-y-3 bg-gray-50">
                <h2 className="font-semibold text-lg">Payment Breakdown</h2>

                <div className="flex justify-between text-sm">
                  <span>Net Amount</span>
                  <span>£{net.toFixed(2)}</span>
                </div>

                {vatEnabled ? (
                  <div className="flex justify-between text-sm">
                    <span>VAT ({vatRate}%)</span>
                    <span>£{vatAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>VAT</span>
                    <span>Not applicable</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total Payable</span>
                  <span>£{totalAmount.toFixed(2)}</span>
                </div>
              </Card>

              {/* ── CONFIRMATION CHECKBOX ── */}
              <div className="flex items-start gap-3 rounded-xl border border-[#134467]/15 bg-[#134467]/5 p-4">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(v) => setConfirmed(!!v)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="confirm"
                  className="text-sm text-[#134467]/80 leading-relaxed cursor-pointer"
                >
                  By proceeding, you confirm that the payment amount and
                  reference details are correct.
                </Label>
              </div>

              {/* ── PAY BUTTON ── */}
              <Button
                type="submit"
                className="w-full text-lg py-6 bg-[#134467] hover:bg-[#0d2f4a] text-white rounded-xl"
                disabled={loading || vatLoading || !confirmed}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Pay Securely via Stripe — £{totalAmount.toFixed(2)}
                  </>
                )}
              </Button>

              {/* ── FOOTER LEGAL LINE ── */}
              <p className="text-center text-xs text-muted-foreground leading-relaxed pt-2">
                Payments are processed by Stripe. All payments are made to{" "}
                <strong>FourSix46&reg; Global Ltd</strong> and are subject to
                applicable terms and policies.
              </p>
            </form>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
}
