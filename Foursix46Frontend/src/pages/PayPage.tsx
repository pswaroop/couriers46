import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

export default function PayPage() {
  const navigate = useNavigate();

  // Fallback to localhost if env missing
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5050";

  /* ===============================
     STATE
  =============================== */

  const [loading, setLoading] = useState(false);

  const [payment, setPayment] = useState({
    name: "",
    email: "",
    phone: "",
    amountNet: "",
    reference: ""
  });

  /* ===============================
     VAT CALCULATION (CLIENT RULE)
     VAT = Net × 0.20
     Total = Net + VAT
  =============================== */

  const net = Number(payment.amountNet) || 0;

  const vatAmount = useMemo(() => {
    return Number((net * 0.2).toFixed(2));
  }, [net]);

  const totalAmount = useMemo(() => {
    return Number((net + vatAmount).toFixed(2));
  }, [net, vatAmount]);

  /* ===============================
     INPUT HANDLER
  =============================== */

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setPayment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ===============================
     SUBMIT → BACKEND → STRIPE
  =============================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!payment.name || !payment.email || !payment.reference) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (net < 1) {
      toast.error("Minimum payment amount is £1.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: payment.name.trim(),
            email: payment.email.trim(),
            phone: payment.phone?.trim(),
            netAmount: net,
            reference: payment.reference.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      if (!data.url) {
        throw new Error("Stripe session URL not returned");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
        <div className="max-w-3xl mx-auto">

          {/* BACK BUTTON */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-8 rounded-3xl shadow-xl">

            {/* HEADER */}
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

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* CUSTOMER INFO */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">
                  Customer Information
                </h2>

                <Input
                  name="name"
                  placeholder="Full Name"
                  required
                  value={payment.name}
                  onChange={handleChange}
                />

                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
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

              {/* PAYMENT DETAILS */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">
                  Payment Details
                </h2>

                <Input
                  type="number"
                  name="amountNet"
                  min="1"
                  step="0.01"
                  placeholder="Amount (ex VAT) £"
                  required
                  value={payment.amountNet}
                  onChange={handleChange}
                />

                <Input value="VAT Rate: 20%" disabled />

                <Textarea
                  name="reference"
                  required
                  placeholder="Payment Reference (e.g. Quote Ref FSC-QQ-0007 or Job payment – London to Bristol)"
                  value={payment.reference}
                  onChange={handleChange}
                />
              </Card>

              {/* BREAKDOWN */}
              <Card className="p-6 space-y-3 bg-gray-50">
                <h2 className="font-semibold text-lg">
                  Payment Breakdown
                </h2>

                <div className="flex justify-between">
                  <span>Net Amount</span>
                  <span>£{net.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (20%)</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total Payable</span>
                  <span>£{totalAmount.toFixed(2)}</span>
                </div>
              </Card>

              {/* PAY BUTTON */}
              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={loading}
              >
                {loading
                  ? "Redirecting to Stripe..."
                  : "Pay Securely via Stripe"}
              </Button>

            </form>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
}