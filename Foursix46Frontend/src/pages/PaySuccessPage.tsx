import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaySuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-green-50 via-white to-[#134467]/5">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />

      <h1 className="text-3xl font-bold text-[#134467] mb-3">
        Payment Successful!
      </h1>

      <p className="text-gray-600 mb-2 max-w-sm">
        Thank you — your payment has been received. A confirmation email will be
        sent shortly.
      </p>

      {/* Show Stripe session reference if available */}
      {sessionId && (
        <p className="text-xs text-slate-400 font-mono mb-6">
          Ref: {sessionId}
        </p>
      )}

      <Button
        className="bg-[#134467] hover:bg-[#0d2f4a] text-white rounded-full px-8"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
}
