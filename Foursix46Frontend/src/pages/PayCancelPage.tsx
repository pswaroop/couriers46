import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PayCancelPage(){

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">

      <XCircle className="w-20 h-20 text-red-500 mb-6"/>

      <h1 className="text-3xl font-bold mb-3">
        Payment Cancelled
      </h1>

      <p className="text-gray-600 mb-8">
        Your payment was not completed.
      </p>

      <Button onClick={()=>navigate("/pay")}>
        Try Again
      </Button>

    </div>
  );
}