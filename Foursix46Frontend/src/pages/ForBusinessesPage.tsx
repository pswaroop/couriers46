// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // <-- Make sure Label is imported
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { FormProgress } from "@/components/shared/FormProgress";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Building2,
//   Award,
//   Briefcase,
//   Loader2, // <-- ADDED
// } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import Footer from "@/components/Footer";
// import { LoadingAnimation } from "@/components/shared/LoadingAnimation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// // --- Zod Validation Schemas ---
// const step1Schema = z.object({
//   companyName: z.string().min(1, "Company name is required"),
//   registrationNumber: z.string().regex(/^\d{8}$/, "Must be exactly 8 numbers"),
//   vatNumber: z
//     .string()
//     .optional()
//     .refine(
//       (val) => {
//         // If the value is empty, null, or undefined, it's valid (it's optional)
//         if (!val) return true;

//         // If it's not empty, it MUST match the 'GB' + 9 digits format
//         return /^gb\d{9}$/i.test(val); // /i makes 'gb' case-insensitive
//       },
//       {
//         message:
//           "VAT Number must be GB followed by 9 digits (e.g., GB123456789) or left empty",
//       },
//     ),
//   businessType: z.string().min(1, "Business type is required"),
//   companyAddress: z.string().min(1, "Company address is required"),
// });

// const step2Schema = z.object({
//   contactFirstName: z.string().min(1, "First name is required"),
//   contactLastName: z.string().min(1, "Last name is required"),
//   contactEmail: z.string().email("Invalid email address"),
//   contactPhone: z
//     .string()
//     .min(13, "Phone number must start with +44 and contain exactly 10 digits"),
//   jobTitle: z.string().min(1, "Job title is required"),
// });

// const step3Schema = z.object({
//   monthlyShipments: z.string().min(1, "Please select an option"),
//   parcelTypes: z.string().min(1, "Please list typical parcel types"),
//   deliveryAreas: z.string().min(1, "Please list primary delivery areas"),
//   specialRequirements: z.string().optional(),
// });

// const step4Schema = z.object({
//   billingMethod: z.string().min(1, "Please select a billing method"),
//   billingEmail: z
//     .string()
//     .email("Invalid email address")
//     .optional()
//     .or(z.literal("")),
//   // Use boolean + refine so the inferred TS type is `boolean` (defaults can be false)
//   termsAccepted: z.boolean().refine((val) => val === true, {
//     message: "You must accept the terms and conditions",
//   }),
// });

// // Combine schemas for validation
// const fullBusinessSchema = step1Schema
//   .merge(step2Schema)
//   .merge(step3Schema)
//   .merge(step4Schema);

// type BusinessData = z.infer<typeof fullBusinessSchema>;

// // Lists of fields for each step
// const step1Fields: (keyof BusinessData)[] = [
//   "companyName",
//   "registrationNumber",
//   "businessType",
//   "companyAddress",
// ];
// const step2Fields: (keyof BusinessData)[] = [
//   "contactFirstName",
//   "contactLastName",
//   "contactEmail",
//   "contactPhone",
//   "jobTitle",
// ];
// const step3Fields: (keyof BusinessData)[] = [
//   "monthlyShipments",
//   "parcelTypes",
//   "deliveryAreas",
// ];
// const step4Fields: (keyof BusinessData)[] = [
//   "billingMethod",
//   "termsAccepted",
//   "billingEmail",
// ];

// const steps = [
//   "Company Information",
//   "Primary Contact",
//   "Shipping Profile",
//   "Billing Preferences",
// ];

// export default function ForBusinessesPage() {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Scroll to top on step change
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentStep]);

//   // --- Setup React Hook Form ---
//   const form = useForm<BusinessData>({
//     resolver: zodResolver(fullBusinessSchema),
//     mode: "onBlur",
//     defaultValues: {
//       companyName: "",
//       registrationNumber: "",
//       vatNumber: "",
//       businessType: "",
//       companyAddress: "",
//       contactFirstName: "",
//       contactLastName: "",
//       contactEmail: "",
//       contactPhone: "",
//       jobTitle: "",
//       monthlyShipments: "",
//       parcelTypes: "",
//       deliveryAreas: "",
//       specialRequirements: "",
//       billingMethod: "",
//       billingEmail: "",
//       termsAccepted: false,
//     },
//   });
//   const apiUrl = import.meta.env.VITE_API_URL;
//   // --- Updated handleNext ---
//   const handleNext = async () => {
//     if (isSubmitting) return;

//     let fieldsToValidate: (keyof BusinessData)[] = [];
//     let isValid = false;

//     if (currentStep === 1) fieldsToValidate = step1Fields;
//     if (currentStep === 2) fieldsToValidate = step2Fields;
//     if (currentStep === 3) fieldsToValidate = step3Fields;
//     if (currentStep === 4) fieldsToValidate = step4Fields;

//     isValid = await form.trigger(fieldsToValidate);

//     if (!isValid) {
//       toast.error("Please fill in all required fields correctly.");
//       return;
//     }

//     if (currentStep < 4) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       // --- Final Submission Logic ---
//       setIsSubmitting(true);
//       const allData = form.getValues();

//       try {
//         const response = await fetch(`${apiUrl}/api/businesses/apply`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(allData),
//         });

//         const result = await response.json();
//         if (!response.ok) {
//           throw new Error(result.message || "Failed to submit registration.");
//         }

//         toast.success("Business registration submitted successfully!");
//         setTimeout(() => navigate("/shipper-thank-you"), 1500);
//       } catch (error: any) {
//         console.error("Submission Error:", error);
//         toast.error(error.message || "An error occurred during submission.");
//         setIsSubmitting(false); // Re-enable button on error
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   return (
//     <>
//       {/* Loading Animation Overlay */}
//       {isSubmitting && (
//         <LoadingAnimation message="Submitting your business registration..." />
//       )}

//       <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
//         <div className="max-w-4xl mx-auto">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/")}
//             className="mb-8"
//             disabled={isSubmitting}
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Home
//           </Button>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 sm:p-10 mb-16 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5EB18]/100 mb-4">
//                 <Building2 className="w-8 h-8 text-[#134467]" />
//               </div>
//               <h1 className="text-4xl font-bold text-[#F81629] mb-2">
//                 Business Courier Services with Route46 Couriers
//               </h1>
//               <p className="text-[#48AEDD] font-medium text-lg">
//                 Reliable courier services designed for businesses that require
//                 fast, secure, and time-critical deliveries across the UK.
//               </p>
//             </div>

//             {/* ... [Benefits Section - no changes] ... */}
//             <div className="grid md:grid-cols-2 gap-6 mb-10">
//               <div className="group border border-[#48AEDD]/20 rounded-2xl p-6 bg-gradient-to-br from-[#48AEDD]/5 to-transparent hover:shadow-lg hover:border-[#48AEDD]/40 transition-all duration-300 hover:-translate-y-1">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Award className="w-6 h-6 text-[#48AEDD]" />
//                   <h3 className="text-xl font-bold text-[#134467]">
//                     Business Courier Benefits
//                   </h3>
//                 </div>
//                 <ul className="space-y-3">
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#48AEDD] mt-1">✓</span>
//                     <span className="text-muted-foreground">
//                       <strong>Priority Courier Support:</strong> Dedicated
//                       support for business deliveries and urgent shipments
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#48AEDD] mt-1">✓</span>
//                     <span className="text-muted-foreground">
//                       <strong>Flexible Billing Options:</strong> Convenient
//                       invoicing for businesses with regular delivery needs
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#48AEDD] mt-1">✓</span>
//                     <span className="text-muted-foreground">
//                       <strong>Reliable Same Day Delivery:</strong> Fast courier
//                       collection and direct delivery across the UK
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#48AEDD] mt-1">✓</span>
//                     <span className="text-muted-foreground">
//                       <strong>Nationwide Courier Network:</strong> Access to
//                       thousands of courier drivers and delivery vehicles across
//                       the UK
//                     </span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="group border border-[#E53935]/20 rounded-2xl p-6 bg-gradient-to-br from-[#E53935]/5 to-transparent hover:shadow-lg hover:border-[#E53935]/40 transition-all duration-300 hover:-translate-y-1">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Briefcase className="w-6 h-6 text-[#E53935]" />
//                   <h3 className="text-xl font-bold text-[#134467]">
//                     Ideal for Businesses That Need Reliable Delivery
//                   </h3>
//                 </div>
//                 <ul className="space-y-3">
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#E53935]">•</span>
//                     <span className="text-muted-foreground">
//                       E-commerce businesses - fast order fulfilment
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#E53935]">•</span>
//                     <span className="text-muted-foreground">
//                       Retail stores - urgent stock movement
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#E53935]">•</span>
//                     <span className="text-muted-foreground">
//                       Manufacturing – time-critical shipments
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#E53935]">•</span>
//                     <span className="text-muted-foreground">
//                       Legal & Financial Firms – secure document delivery
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-[#E53935]">•</span>
//                     <span className="text-muted-foreground">
//                       Medical & Healthcare Suppliers – urgent transport needs
//                     </span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="text-center max-w-3xl mx-auto">
//                 <span
//                   className="inline-block text-[11px] font-black uppercase tracking-[0.2em]
//     bg-[#134467]/5 text-[#134467] px-5 py-2 rounded-full border
//     border-[#134467]/10 mb-4"
//                 >
//                   Our Network
//                 </span>
//                 <h2
//                   className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#134467]
//     tracking-tight leading-tight mb-4"
//                 >
//                   Nationwide Business Courier Network
//                 </h2>
//                 <div className="w-12 h-1 rounded-full bg-[#E53935] mx-auto mb-5" />
//                 <p className="text-base sm:text-lg text-[#134467]/70 font-medium leading-[1.85]">
//                   Route46 Couriers supports businesses with urgent delivery
//                   needs through a nationwide courier network. With access to
//                   thousands of courier drivers and vehicles across the UK, we
//                   can respond quickly to time-critical shipments and business
//                   logistics requirements.
//                 </p>
//               </div>
//             </div>

//             <FormProgress steps={steps} currentStep={currentStep} />

//             {/* --- Wrap form in <Form> provider --- */}
//             <Form {...form}>
//               <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//                 {/* --- Step 1: Company Information --- */}
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <FormField
//                       control={form.control}
//                       name="companyName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Company Name *</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Acme Corporation Ltd"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="grid md:grid-cols-2 gap-6">
//                       <FormField
//                         control={form.control}
//                         name="registrationNumber"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Company Registration Number *</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="12345678"
//                                 maxLength={8}
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="vatNumber"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>VAT Number (optional)</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="GB123456789"
//                                 maxLength={11}
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="businessType"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Business Type *</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select business type" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="limited">
//                                 Limited Company
//                               </SelectItem>
//                               <SelectItem value="partnership">
//                                 Partnership
//                               </SelectItem>
//                               <SelectItem value="sole-trader">
//                                 Sole Trader
//                               </SelectItem>
//                               <SelectItem value="charity">Charity</SelectItem>
//                               <SelectItem value="other">Other</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="companyAddress"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Company Address *</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="123 Business Park, City, Postcode"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 )}

//                 {/* --- Step 2: Primary Contact --- */}
//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-6">
//                       <FormField
//                         control={form.control}
//                         name="contactFirstName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>First Name *</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Jane" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="contactLastName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Last Name *</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Doe" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                     <FormField
//                       control={form.control}
//                       name="contactEmail"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email Address *</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="email"
//                               placeholder="jane.doe@company.com"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="contactPhone"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Phone Number *</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="tel"
//                               placeholder="+44 7XXX XXXXXX"
//                               maxLength={13} // +44 (3) + 10 digits = 13
//                               {...field}
//                               onChange={(e) => {
//                                 const prefix = "+44";
//                                 let value = e.target.value;

//                                 // 1. If user tries to delete prefix, put it back
//                                 if (
//                                   value.length < prefix.length ||
//                                   !value.startsWith(prefix)
//                                 ) {
//                                   value = prefix;
//                                 }

//                                 // 2. Get everything AFTER the prefix, remove non-digits
//                                 const digits = value
//                                   .substring(prefix.length)
//                                   .replace(/[^\d]/g, "");

//                                 // 3. Re-assemble the value, limiting to 10 digits
//                                 const newValue = prefix + digits.slice(0, 10);

//                                 // 4. Update the form
//                                 field.onChange(newValue);
//                               }}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="jobTitle"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Job Title *</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="e.g., Operations Manager"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 )}

//                 {/* --- Step 3: Shipping Profile --- */}
//                 {currentStep === 3 && (
//                   <div className="space-y-6">
//                     <FormField
//                       control={form.control}
//                       name="monthlyShipments"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Expected Monthly Shipments *</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select volume" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="1-50">
//                                 1-50 shipments
//                               </SelectItem>
//                               <SelectItem value="51-200">
//                                 51-200 shipments
//                               </SelectItem>
//                               <SelectItem value="201-500">
//                                 201-500 shipments
//                               </SelectItem>
//                               <SelectItem value="500+">
//                                 500+ shipments
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="parcelTypes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Typical Parcel Types *</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="e.g., Documents, Small packages, Equipment"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="deliveryAreas"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Primary Delivery Areas *</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="e.g., London, Birmingham, Manchester"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="specialRequirements"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Special Requirements</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Any specific handling, timing, or service requirements..."
//                               {...field}
//                               rows={4}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 )}

//                 {/* --- Step 4: Billing Preferences --- */}
//                 {currentStep === 4 && (
//                   <div className="space-y-6">
//                     <FormField
//                       control={form.control}
//                       name="billingMethod"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Preferred Billing Method *</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select billing method" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="monthly">
//                                 Monthly Invoice
//                               </SelectItem>
//                               <SelectItem value="per-shipment">
//                                 Per Shipment
//                               </SelectItem>
//                               <SelectItem value="prepaid">
//                                 Prepaid Account
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="billingEmail"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Billing Email (if different)</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="email"
//                               placeholder="accounts@company.com"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {/* ... [Benefits Box - no changes] ... */}
//                     <div className="bg-muted/50 p-6 rounded-xl space-y-4">
//                       <h3 className="font-semibold text-secondary">
//                         Business Rate Benefits
//                       </h3>
//                       <ul className="space-y-2 text-sm text-muted-foreground">
//                         <li>✓ Get 20% off on standard rates</li>
//                         <li>✓ Dedicated account manager</li>
//                         <li>✓ Priority customer support</li>
//                         <li>✓ Monthly consolidated billing</li>
//                         <li>✓ Flexible payment terms</li>
//                       </ul>
//                     </div>

//                     {/* --- THIS IS THE FIX --- */}
//                     <FormField
//                       control={form.control}
//                       name="termsAccepted"
//                       render={({ field }) => (
//                         <FormItem className="flex items-start gap-3 p-4 border border-border rounded-xl">
//                           <FormControl>
//                             <Checkbox
//                               checked={!!field.value}
//                               onCheckedChange={(v) => field.onChange(!!v)}
//                               id="terms" // <-- 1. Add an ID here
//                               className="mt-3"
//                             />
//                           </FormControl>
//                           <div className="grid gap-1.5 leading-none">
//                             <Label // <-- 2. Use the shadcn/ui Label
//                               htmlFor="terms" // <-- 3. Link it to the Checkbox ID
//                               className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
//                             >
//                               I confirm that I have authority to register this
//                               business. I accept FourSix46's Terms and
//                               Conditions, and Privacy Policy.
//                             </Label>
//                             <FormMessage />
//                           </div>
//                         </FormItem>
//                       )}
//                     />
//                     {/* -------------------- */}
//                   </div>
//                 )}
//               </form>
//             </Form>

//             {/* --- Navigation Buttons --- */}
//             <div className="flex justify-between mt-10">
//               <Button
//                 variant="outline"
//                 onClick={handleBack}
//                 disabled={currentStep === 1 || isSubmitting}
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//               </Button>
//               <Button
//                 variant="brand"
//                 onClick={handleNext}
//                 disabled={isSubmitting}
//               >
//                 {currentStep === 4 ? (
//                   isSubmitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Submitting...
//                     </>
//                   ) : (
//                     "Submit Registration"
//                   )
//                 ) : (
//                   "Next"
//                 )}
//                 {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
//               </Button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormProgress } from "@/components/shared/FormProgress";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Award,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { LoadingAnimation } from "@/components/shared/LoadingAnimation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// --- Zod Validation Schemas ---
const step1Schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().regex(/^\d{8}$/, "Must be exactly 8 numbers"),
  vatNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^gb\d{9}$/i.test(val);
      },
      {
        message:
          "VAT Number must be GB followed by 9 digits (e.g., GB123456789) or left empty",
      },
    ),
  businessType: z.string().min(1, "Business type is required"),
  companyAddress: z.string().min(1, "Company address is required"),
});

const step2Schema = z.object({
  contactFirstName: z.string().min(1, "First name is required"),
  contactLastName: z.string().min(1, "Last name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .min(13, "Phone number must start with +44 and contain exactly 10 digits"),
  jobTitle: z.string().min(1, "Job title is required"),
});

const step3Schema = z.object({
  monthlyShipments: z.string().min(1, "Please select an option"),
  parcelTypes: z.string().min(1, "Please list typical parcel types"),
  deliveryAreas: z.string().min(1, "Please list primary delivery areas"),
  specialRequirements: z.string().optional(),
});

const step4Schema = z.object({
  billingMethod: z.string().min(1, "Please select a billing method"),
  billingEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

const fullBusinessSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

type BusinessData = z.infer<typeof fullBusinessSchema>;

const step1Fields: (keyof BusinessData)[] = [
  "companyName",
  "registrationNumber",
  "businessType",
  "companyAddress",
];
const step2Fields: (keyof BusinessData)[] = [
  "contactFirstName",
  "contactLastName",
  "contactEmail",
  "contactPhone",
  "jobTitle",
];
const step3Fields: (keyof BusinessData)[] = [
  "monthlyShipments",
  "parcelTypes",
  "deliveryAreas",
];
const step4Fields: (keyof BusinessData)[] = [
  "billingMethod",
  "termsAccepted",
  "billingEmail",
];

const steps = [
  "Company Information",
  "Primary Contact",
  "Shipping Profile",
  "Billing Preferences",
];

export default function ForBusinessesPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const form = useForm<BusinessData>({
    resolver: zodResolver(fullBusinessSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      vatNumber: "",
      businessType: "",
      companyAddress: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      jobTitle: "",
      monthlyShipments: "",
      parcelTypes: "",
      deliveryAreas: "",
      specialRequirements: "",
      billingMethod: "",
      billingEmail: "",
      termsAccepted: false,
    },
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleNext = async () => {
    if (isSubmitting) return;

    let fieldsToValidate: (keyof BusinessData)[] = [];
    let isValid = false;

    if (currentStep === 1) fieldsToValidate = step1Fields;
    if (currentStep === 2) fieldsToValidate = step2Fields;
    if (currentStep === 3) fieldsToValidate = step3Fields;
    if (currentStep === 4) fieldsToValidate = step4Fields;

    isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      const allData = form.getValues();

      try {
        const response = await fetch(`${apiUrl}/api/businesses/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(allData),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to submit registration.");
        }

        toast.success("Business registration submitted successfully!");
        setTimeout(() => navigate("/shipper-thank-you"), 1500);
      } catch (error: any) {
        console.error("Submission Error:", error);
        toast.error(error.message || "An error occurred during submission.");
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {isSubmitting && (
        <LoadingAnimation message="Submitting your business registration..." />
      )}

      <div className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-br from-[#E53935]/5 via-white to-[#134467]/5">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 sm:p-10 mb-16 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {/* ── Page Header ── */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5EB18] mb-4">
                <Building2 className="w-8 h-8 text-[#134467]" />
              </div>
              <h1 className="text-4xl font-bold text-[#F81629] mb-2">
                Business Courier Services with Route46 Couriers
              </h1>
              <p className="text-[#48AEDD] font-medium text-lg">
                Reliable courier services designed for businesses that require
                fast, secure, and time-critical deliveries across the UK.
              </p>
            </div>

            {/* ── Benefits Grid (2 columns) ── */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Card 1 */}
              <div className="group border border-[#48AEDD]/20 rounded-2xl p-6 bg-gradient-to-br from-[#48AEDD]/5 to-transparent hover:shadow-lg hover:border-[#48AEDD]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-[#48AEDD]" />
                  <h3 className="text-xl font-bold text-[#134467]">
                    Business Courier Benefits
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[#48AEDD] mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Priority Courier Support:</strong> Dedicated
                      support for business deliveries and urgent shipments
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#48AEDD] mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Flexible Billing Options:</strong> Convenient
                      invoicing for businesses with regular delivery needs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#48AEDD] mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Reliable Same Day Delivery:</strong> Fast courier
                      collection and direct delivery across the UK
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#48AEDD] mt-1">✓</span>
                    <span className="text-muted-foreground">
                      <strong>Nationwide Courier Network:</strong> Access to
                      thousands of courier drivers and delivery vehicles across
                      the UK
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="group border border-[#E53935]/20 rounded-2xl p-6 bg-gradient-to-br from-[#E53935]/5 to-transparent hover:shadow-lg hover:border-[#E53935]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-[#E53935]" />
                  <h3 className="text-xl font-bold text-[#134467]">
                    Ideal for Businesses That Need Reliable Delivery
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E53935]">•</span>
                    <span className="text-muted-foreground">
                      E-commerce businesses - fast order fulfilment
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E53935]">•</span>
                    <span className="text-muted-foreground">
                      Retail stores - urgent stock movement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E53935]">•</span>
                    <span className="text-muted-foreground">
                      Manufacturing – time-critical shipments
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E53935]">•</span>
                    <span className="text-muted-foreground">
                      Legal & Financial Firms – secure document delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E53935]">•</span>
                    <span className="text-muted-foreground">
                      Medical & Healthcare Suppliers – urgent transport needs
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ── Nationwide Network — full width, OUTSIDE the grid ── */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span
                className="inline-block text-[11px] font-black uppercase
                tracking-[0.2em] bg-[#134467]/5 text-[#134467] px-5 py-2
                rounded-full border border-[#134467]/10 mb-4"
              >
                Our Network
              </span>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black
                text-[#134467] tracking-tight leading-tight mb-4"
              >
                Nationwide Business Courier Network
              </h2>
              <div className="w-12 h-1 rounded-full bg-[#E53935] mx-auto mb-5" />
              <p
                className="text-base sm:text-lg text-[#134467]/70 font-medium
                leading-[1.85]"
              >
                Route46 Couriers supports businesses with urgent delivery needs
                through a nationwide courier network. With access to thousands
                of courier drivers and vehicles across the UK, we can respond
                quickly to time-critical shipments and business logistics
                requirements.
              </p>
            </div>

            {/* ── Form Progress ── */}
            <FormProgress steps={steps} currentStep={currentStep} />

            {/* ── Multi-step Form ── */}
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Corporation Ltd"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Registration Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345678"
                                maxLength={8}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vatNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VAT Number (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="GB123456789"
                                maxLength={11}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="limited">
                                Limited Company
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership
                              </SelectItem>
                              <SelectItem value="sole-trader">
                                Sole Trader
                              </SelectItem>
                              <SelectItem value="charity">Charity</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Address *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Business Park, City, Postcode"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Primary Contact */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contactFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jane.doe@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+44 7XXX XXXXXX"
                              maxLength={13}
                              {...field}
                              onChange={(e) => {
                                const prefix = "+44";
                                let value = e.target.value;
                                if (
                                  value.length < prefix.length ||
                                  !value.startsWith(prefix)
                                ) {
                                  value = prefix;
                                }
                                const digits = value
                                  .substring(prefix.length)
                                  .replace(/[^\d]/g, "");
                                field.onChange(prefix + digits.slice(0, 10));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Operations Manager"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Shipping Profile */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="monthlyShipments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Monthly Shipments *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select volume" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-50">
                                1-50 shipments
                              </SelectItem>
                              <SelectItem value="51-200">
                                51-200 shipments
                              </SelectItem>
                              <SelectItem value="201-500">
                                201-500 shipments
                              </SelectItem>
                              <SelectItem value="500+">
                                500+ shipments
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parcelTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Typical Parcel Types *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Documents, Small packages, Equipment"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Delivery Areas *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., London, Birmingham, Manchester"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific handling, timing, or service requirements..."
                              {...field}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Billing Preferences */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="billingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Billing Method *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select billing method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">
                                Monthly Invoice
                              </SelectItem>
                              <SelectItem value="per-shipment">
                                Per Shipment
                              </SelectItem>
                              <SelectItem value="prepaid">
                                Prepaid Account
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Email (if different)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="accounts@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="bg-muted/50 p-6 rounded-xl space-y-4">
                      <h3 className="font-semibold text-secondary">
                        Business Rate Benefits
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>✓ Get 20% off on standard rates</li>
                        <li>✓ Dedicated account manager</li>
                        <li>✓ Priority customer support</li>
                        <li>✓ Monthly consolidated billing</li>
                        <li>✓ Flexible payment terms</li>
                      </ul>
                    </div>
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 p-4 border border-border rounded-xl">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={(v) => field.onChange(!!v)}
                              id="terms"
                              className="mt-3"
                            />
                          </FormControl>
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="terms"
                              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                            >
                              I confirm that I have authority to register this
                              business. I accept Route46's Terms and Conditions,
                              and Privacy Policy.
                            </Label>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </form>
            </Form>

            {/* ── Navigation Buttons ── */}
            <div className="flex justify-between mt-10">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="brand"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {currentStep === 4 ? (
                  isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )
                ) : (
                  "Next"
                )}
                {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
