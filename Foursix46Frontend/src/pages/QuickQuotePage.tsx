import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { LoadingAnimation } from "@/components/shared/LoadingAnimation";

export default function QuickQuotePage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // In initialState — remove dropTime, add dropTimeFrom / dropTimeTo
  const initialState = {
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    pickupName: "",
    pickupPostcode: "",
    pickupDate: "",
    pickupFrom: "",
    pickupTo: "",

    dropName: "",
    dropPostcode: "",
    dropDate: "",
    dropTime: "", // ← renamed
    // dropTimeTo: "", // ← new
    asap: false,

    distanceMiles: "",
    jobDescription: "",
    suggestedVehicle: "",
    notes: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.asap && !form.dropTime) {
      toast.error("Please select a drop time window or choose ASAP.");
      return;
    }

    if (Number(form.distanceMiles) <= 0) {
      toast.error("Distance must be greater than 0 miles.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quick-quotes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to submit quote.");
      setIsSubmitting(true);
      navigate("/get-a-quote/thank-you");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <LoadingAnimation message="Submitting your driver application..." />
      )}
      <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-8 rounded-3xl shadow-xl">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto bg-[#F5EB18] rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-[#134467]" />
              </div>
              <h1 className="text-4xl font-bold text-[#F81629]">
                Get an Instant Courier Quote
              </h1>
              <p className="text-[#48AEDD] mt-2">
                Request an instant quote for same day courier delivery across
                the UK. No booking required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ── PICKUP ─────────────────────────────────────── */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg text-[#134467]">Pickup</h2>

                <Input
                  name="pickupName"
                  placeholder="Pickup Name"
                  required
                  value={form.pickupName}
                  onChange={handleChange}
                />
                <Input
                  name="pickupPostcode"
                  placeholder="Pickup Postcode"
                  required
                  value={form.pickupPostcode}
                  onChange={handleChange}
                />

                {/* Pickup Date — labelled */}
                <div className="space-y-1">
                  <Label
                    htmlFor="pickupDate"
                    className="text-sm text-[#134467]/70 font-medium"
                  >
                    Pickup Date
                  </Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    name="pickupDate"
                    required
                    min={today}
                    value={form.pickupDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Pickup From / To — labelled */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="pickupFrom"
                      className="text-sm text-[#134467]/70 font-medium"
                    >
                      Pickup From
                    </Label>
                    <Input
                      id="pickupFrom"
                      type="time"
                      name="pickupFrom"
                      required
                      value={form.pickupFrom}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="pickupTo"
                      className="text-sm text-[#134467]/70 font-medium"
                    >
                      Pickup To
                    </Label>
                    <Input
                      id="pickupTo"
                      type="time"
                      name="pickupTo"
                      required
                      value={form.pickupTo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              {/* ── DROP ───────────────────────────────────────── */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg text-[#134467]">Drop</h2>

                <Input
                  name="dropName"
                  placeholder="Drop Name"
                  required
                  value={form.dropName}
                  onChange={handleChange}
                />
                <Input
                  name="dropPostcode"
                  placeholder="Drop Postcode"
                  required
                  value={form.dropPostcode}
                  onChange={handleChange}
                />

                {/* Drop Date — labelled */}
                <div className="space-y-1">
                  <Label
                    htmlFor="dropDate"
                    className="text-sm text-[#134467]/70 font-medium"
                  >
                    Drop Date
                  </Label>
                  <Input
                    id="dropDate"
                    type="date"
                    name="dropDate"
                    required
                    min={today}
                    value={form.dropDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Drop Time — labelled + ASAP toggle */}
                {/* Drop Time — now two fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="dropTime"
                      className="text-sm text-[#134467]/70 font-medium"
                    >
                      Drop Time
                    </Label>
                    <Input
                      id="dropTime"
                      type="time"
                      name="dropTime"
                      required={!form.asap}
                      disabled={form.asap}
                      value={form.dropTime}
                      onChange={handleChange}
                      className={
                        form.asap ? "opacity-40 cursor-not-allowed" : ""
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="asap"
                    checked={form.asap}
                    onCheckedChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        asap: !!v,
                        dropTime: v ? "" : prev.dropTime,
                      }))
                    }
                  />
                  <Label htmlFor="asap" className="cursor-pointer font-medium">
                    ASAP
                  </Label>
                </div>

                {/* </div> */}
              </Card>

              {/* ── JOB DETAILS ────────────────────────────────── */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg text-[#134467]">
                  Job Details
                </h2>

                <Input
                  type="number"
                  name="distanceMiles"
                  placeholder="Distance (Miles)"
                  required
                  min="0.1"
                  step="0.1"
                  value={form.distanceMiles}
                  onChange={handleChange}
                />

                <select
                  name="jobDescription"
                  required
                  value={form.jobDescription}
                  className="w-full border rounded-md p-2 text-sm"
                  onChange={handleChange}
                >
                  <option value="">Job Description</option>
                  <option>Same Day – Timed</option>
                  <option>Same Day – Non Timed</option>
                  <option>Next Day – Timed</option>
                  <option>Next Day – Non Timed</option>
                  <option>3–5 Days</option>
                  <option>Multi-Drop</option>
                  <option>Deliver Direct</option>
                </select>

                <select
                  name="suggestedVehicle"
                  required
                  value={form.suggestedVehicle}
                  className="w-full border rounded-md p-2 text-sm"
                  onChange={handleChange}
                >
                  <option value="">Suggested Vehicle</option>
                  <option>Motorcycle</option>
                  <option>Car</option>
                  <option>Small Van</option>
                  <option>Midi Van</option>
                  <option>SWB up to 2.4m</option>
                  <option>MWB up to 3m</option>
                  <option>LWB up to 4m</option>
                  <option>XLWB 4m+</option>
                  <option>Luton</option>
                  <option>7.5T</option>
                </select>

                <Textarea
                  name="notes"
                  placeholder="Additional Notes"
                  value={form.notes}
                  onChange={handleChange}
                />
              </Card>
              {/* CONTACT */}
              <Card className="p-6 space-y-4">
                <h2 className="font-semibold text-lg text-[#134467]">
                  Contact Details
                </h2>

                <Input
                  name="contactName"
                  placeholder="Your Name"
                  required
                  value={form.contactName}
                  onChange={handleChange}
                />
                <Input
                  type="email"
                  name="contactEmail"
                  placeholder="Email Address"
                  required
                  value={form.contactEmail}
                  onChange={handleChange}
                />
                <Input
                  type="tel"
                  name="contactPhone"
                  placeholder="Phone Number"
                  required
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </Card>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-lg py-6"
              >
                {loading ? "Submitting..." : "Request Quote"}
              </Button>
            </form>
          </Card>
        </div>
        <div
          className="flex items-start justify-center gap-2.5 max-w-xl mx-auto
  mt-6 mb-10 px-4 py-3 rounded-2xl
  bg-[#134467]/4 border border-[#134467]/10"
        >
          <span className="text-[#134467]/50 mt-0.5 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
          <p className="text-xs text-[#134467]/55 font-medium leading-relaxed text-left">
            <span className="font-bold text-[#134467]/70">Disclaimer: </span>
            Submitting this form does not confirm a booking. Our team will
            review your request and provide a courier quote shortly.
          </p>
        </div>

        <Footer />
      </div>
    </>
  );
}
