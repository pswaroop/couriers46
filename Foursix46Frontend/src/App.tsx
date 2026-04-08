// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import {
// //   BrowserRouter,
// //   Routes,
// //   Route,
// //   Outlet,
// //   Navigate,
// // } from "react-router-dom";
// // import { lazy, Suspense } from "react";
// // import { HelmetProvider } from "react-helmet-async";
// // import { ErrorBoundary, FallbackProps } from "react-error-boundary";

// // // --- Eager load critical components ---
// // import { Navigation } from "@/components/Navigation";
// // import { Chatbot } from "@/components/Chatbot";
// // import ScrollToTop from "@/components/ScrollToTop";
// // import QuickQuoteThankYouPage from "./pages/QuickQuoteThankYouPage";
// // import BlogPostPage from "./pages/BlogPostPage";
// // import BlogsPage from "./pages/BlogsPage";

// // // --- Lazy load all page components ---
// // const HomePage = lazy(() => import("@/pages/HomePage"));
// // const QuickQuotePage = lazy(() => import("@/pages/QuickQuotePage"));
// // const BecomeDriverPage = lazy(() => import("@/pages/BecomeDriverPage"));
// // const ForBusinessesPage = lazy(() => import("@/pages/ForBusinessesPage"));
// // const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
// // const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
// // const SectorsPage = lazy(() => import("@/pages/SectorsPage"));
// // const SectorDetailPage = lazy(() => import("@/pages/SectorDetailPage"));
// // const AboutPage = lazy(() => import("@/pages/AboutPage"));
// // const PayPage = lazy(() => import("@/pages/PayPage"));
// // const PaySuccessPage = lazy(() => import("@/pages/PaySuccessPage"));
// // const PayCancelPage = lazy(() => import("@/pages/PayCancelPage"));
// // const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
// // const LocationDetailPage = lazy(() => import("@/pages/LocationDetailPage"));

// // // ✅ LocationServicePage — full-bleed layout, kept outside PublicLayout
// // const LocationServicePage = lazy(() => import("@/pages/LocationServicePage"));

// // const ContactPage = lazy(() => import("@/pages/ContactPage"));
// // const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
// // const TermsPage = lazy(() => import("@/pages/TermsPage"));
// // const CookiesPage = lazy(() => import("@/pages/CookiesPage"));
// // const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage"));
// // const FAQSPage = lazy(() => import("@/pages/FAQSPage"));
// // const AccreditedTrustedPage = lazy(
// //   () => import("@/pages/AccreditedTrustedPage"),
// // );
// // const NotFound = lazy(() => import("@/pages/NotFound"));
// // const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
// // const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
// // const RHAPage = lazy(() => import("@/pages/RHAPage"));
// // const DriverThankYouPage = lazy(() => import("@/pages/DriverThankYouPage"));
// // const ShipperThankYouPage = lazy(() => import("@/pages/ShipperThankYouPage"));
// // const ContactThankYouPage = lazy(() => import("@/pages/ContactThankYouPage"));
// // const BookingThankYouPage = lazy(() => import("@/pages/BookingThankYouPage"));

// // // TestimonialsPage uses named export
// // const TestimonialsPageLazy = lazy(async () => {
// //   const module = await import("@/pages/TestimonialsPage");
// //   return { default: module.TestimonialsPage };
// // });

// // const queryClient = new QueryClient();

// // // --- Global Loading Spinner ---
// // const PageLoader = () => (
// //   <div className="min-h-screen flex items-center justify-center bg-slate-50">
// //     <div className="flex flex-col items-center gap-4">
// //       <div className="w-16 h-16 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin" />
// //       <p className="text-[#134467] font-semibold">Loading...</p>
// //     </div>
// //   </div>
// // );

// // // --- Admin Error Fallback ---
// // const AdminErrorFallback = ({ error }: { error: Error }) => (
// //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //     <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
// //       <h2 className="text-xl font-bold text-red-600 mb-2">Admin Page Error</h2>
// //       <p className="text-gray-600 mb-4 text-sm">
// //         The page failed to load. Check the browser console for details.
// //       </p>
// //       <pre className="text-xs text-left bg-red-50 text-red-700 p-3 rounded overflow-auto mb-4">
// //         {error?.message}
// //       </pre>
// //       <button
// //         onClick={() => window.location.reload()}
// //         className="px-4 py-2 bg-[#134467] text-white rounded hover:bg-[#0e3352] transition-colors text-sm"
// //       >
// //         Reload Page
// //       </button>
// //     </div>
// //   </div>
// // );

// // // --- Public Layout (with Navigation sidebar) ---
// // const PublicLayout = () => (
// //   <div className="min-h-screen">
// //     <Navigation />
// //     <main className="pt-20 pb-24 lg:pt-0 lg:pb-0 lg:mr-72">
// //       <Outlet />
// //     </main>
// //   </div>
// // );

// // // --- Full Bleed Layout (Navigation only, no main padding) ---
// // // Used for pages with full-width hero sections that manage their own spacing
// // const FullBleedLayout = () => (
// //   <div className="min-h-screen">
// //     <Navigation />
// //     <Outlet />
// //   </div>
// // );

// // // --- Admin Layout ---
// // const AdminLayout = () => (
// //   <div className="min-h-screen bg-gray-100">
// //     <Outlet />
// //   </div>
// // );

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <HelmetProvider>
// //         <Toaster />
// //         <Sonner />
// //         <BrowserRouter
// //           future={{
// //             v7_startTransition: true,
// //             v7_relativeSplatPath: true,
// //           }}
// //         >
// //           <ScrollToTop />
// //           <Suspense fallback={<PageLoader />}>
// //             <Routes>
// //               {/* ── ADMIN ROUTES ─────────────────────────────────────── */}
// //               <Route
// //                 element={
// //                   <ErrorBoundary
// //                     FallbackComponent={
// //                       AdminErrorFallback as React.ComponentType<FallbackProps>
// //                     }
// //                   >
// //                     <AdminLayout />
// //                   </ErrorBoundary>
// //                 }
// //               >
// //                 <Route path="/admin/login" element={<AdminLoginPage />} />
// //                 <Route
// //                   path="/admin/dashboard"
// //                   element={<AdminDashboardPage />}
// //                 />
// //               </Route>

// //               {/* ── LOCATION SERVICE PAGES (full-bleed, no main padding) ── */}
// //               {/* ✅ Must be BEFORE PublicLayout's locations/:slug route    */}
// //               {/* ✅ Uses FullBleedLayout so hero isn't offset by pt-20     */}
// //               <Route element={<FullBleedLayout />}>
// //                 <Route
// //                   path="locations/:locationSlug/:serviceSlug"
// //                   element={<LocationServicePage />}
// //                 />
// //               </Route>

// //               {/* ── PUBLIC ROUTES ────────────────────────────────────── */}
// //               <Route element={<PublicLayout />}>
// //                 <Route index element={<HomePage />} />
// //                 <Route path="quick-quote" element={<QuickQuotePage />} />
// //                 <Route path="become-driver" element={<BecomeDriverPage />} />
// //                 <Route path="for-businesses" element={<ForBusinessesPage />} />
// //                 <Route path="testimonials" element={<TestimonialsPageLazy />} />
// //                 <Route path="/blog" element={<BlogsPage />} />
// //                 <Route path="/blog/:slug" element={<BlogPostPage />} />
// //                 <Route path="services">
// //                   <Route index element={<ServicesPage />} />
// //                   <Route path=":slug" element={<ServiceDetailPage />} />
// //                 </Route>
// //                 <Route path="sectors" element={<SectorsPage />} />
// //                 <Route path="sectors/:slug" element={<SectorDetailPage />} />
// //                 <Route path="locations" element={<LocationsPage />} />
// //                 <Route
// //                   path="locations/:slug"
// //                   element={<LocationDetailPage />}
// //                 />
// //                 <Route path="about" element={<AboutPage />} />
// //                 <Route path="pay" element={<PayPage />} />
// //                 <Route path="pay/success" element={<PaySuccessPage />} />
// //                 <Route path="pay/cancel" element={<PayCancelPage />} />
// //                 <Route path="contact" element={<ContactPage />} />
// //                 <Route path="privacy" element={<PrivacyPolicyPage />} />
// //                 <Route path="terms" element={<TermsPage />} />
// //                 <Route path="cookies" element={<CookiesPage />} />
// //                 <Route path="refund-policy" element={<RefundPolicyPage />} />
// //                 <Route path="faqs" element={<FAQSPage />} />
// //                 <Route
// //                   path="accredited-trusted"
// //                   element={<AccreditedTrustedPage />}
// //                 />
// //                 <Route path="rha-summary" element={<RHAPage />} />
// //                 <Route
// //                   path="/get-a-quote/thank-you"
// //                   element={<QuickQuoteThankYouPage />}
// //                 />

// //                 <Route
// //                   path="driver-thank-you"
// //                   element={<DriverThankYouPage />}
// //                 />
// //                 <Route
// //                   path="shipper-thank-you"
// //                   element={<ShipperThankYouPage />}
// //                 />
// //                 <Route
// //                   path="contact-thank-you"
// //                   element={<ContactThankYouPage />}
// //                 />
// //                 <Route
// //                   path="booking-thank-you"
// //                   element={<BookingThankYouPage />}
// //                 />
// //                 <Route
// //                   path="send-parcel"
// //                   element={<Navigate to="/quick-quote" replace />}
// //                 />
// //               </Route>

// //               {/* ── 404 ──────────────────────────────────────────────── */}
// //               <Route path="*" element={<NotFound />} />
// //             </Routes>
// //           </Suspense>

// //           <Chatbot />
// //         </BrowserRouter>
// //       </HelmetProvider>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Outlet,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";
// import { lazy, Suspense, Component, ReactNode } from "react";
// import { HelmetProvider } from "react-helmet-async";

// // ── Always-on Global Components ───────────────────────────────────────────────
// import { Navigation } from "@/components/Navigation";
// import { Chatbot } from "@/components/Chatbot";
// import ScrollToTop from "@/components/ScrollToTop";

// // ── Lazy Pages ────────────────────────────────────────────────────────────────
// const HomePage = lazy(() => import("@/pages/HomePage"));
// const QuickQuotePage = lazy(() => import("@/pages/QuickQuotePage"));
// const QuickQuoteThankYouPage = lazy(
//   () => import("@/pages/QuickQuoteThankYouPage"),
// );
// const BecomeDriverPage = lazy(() => import("@/pages/BecomeDriverPage"));
// const ForBusinessesPage = lazy(() => import("@/pages/ForBusinessesPage"));
// const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
// const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
// const SectorsPage = lazy(() => import("@/pages/SectorsPage"));
// const SectorDetailPage = lazy(() => import("@/pages/SectorDetailPage"));
// const AboutPage = lazy(() => import("@/pages/AboutPage"));
// const PayPage = lazy(() => import("@/pages/PayPage"));
// const PaySuccessPage = lazy(() => import("@/pages/PaySuccessPage"));
// const PayCancelPage = lazy(() => import("@/pages/PayCancelPage"));
// const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
// const LocationDetailPage = lazy(() => import("@/pages/LocationDetailPage"));
// const LocationServicePage = lazy(() => import("@/pages/LocationServicePage"));
// const ContactPage = lazy(() => import("@/pages/ContactPage"));
// const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
// const TermsPage = lazy(() => import("@/pages/TermsPage"));
// const CookiesPage = lazy(() => import("@/pages/CookiesPage"));
// const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage"));
// const FAQSPage = lazy(() => import("@/pages/FAQSPage"));
// const AccreditedTrustedPage = lazy(
//   () => import("@/pages/AccreditedTrustedPage"),
// );
// const NotFound = lazy(() => import("@/pages/NotFound"));
// const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
// const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
// const RHAPage = lazy(() => import("@/pages/RHAPage"));
// const DriverThankYouPage = lazy(() => import("@/pages/DriverThankYouPage"));
// const ShipperThankYouPage = lazy(() => import("@/pages/ShipperThankYouPage"));
// const ContactThankYouPage = lazy(() => import("@/pages/ContactThankYouPage"));
// const BookingThankYouPage = lazy(() => import("@/pages/BookingThankYouPage"));
// const BlogsPage = lazy(() => import("@/pages/BlogsPage"));
// const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
// const TestimonialsPageLazy = lazy(async () => {
//   const module = await import("@/pages/TestimonialsPage");
//   return { default: module.TestimonialsPage };
// });

// const queryClient = new QueryClient();

// // ── Page Loader (shown during lazy chunk download) ────────────────────────────
// const PageLoader = () => (
//   <div className="min-h-screen flex items-center justify-center bg-white">
//     <div className="flex flex-col items-center gap-5">
//       {/* Animated logo-coloured ring */}
//       <div className="relative w-16 h-16">
//         <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
//         <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
//       </div>
//       <p className="text-[#134467] font-semibold text-sm tracking-wide">
//         Loading…
//       </p>
//     </div>
//   </div>
// );

// // ── Route Error Fallback (shown when a page component crashes) ────────────────
// const RouteErrorFallback = ({
//   error,
//   onReset,
// }: {
//   error: Error;
//   onReset: () => void;
// }) => (
//   <div className="min-h-screen flex items-center justify-center bg-white px-6">
//     <div className="max-w-md w-full text-center space-y-6">
//       {/* Accent line */}
//       <div className="w-full h-1 bg-gradient-to-r from-[#48AEDD] via-[#F5EB18] to-[#E53935] rounded-full" />
//       <div className="space-y-2">
//         <h1 className="text-4xl font-black text-[#E53935]">Oops!</h1>
//         <p className="text-[#134467] font-semibold text-lg">
//           Something went wrong loading this page.
//         </p>
//         <p className="text-slate-400 text-sm">
//           This is usually a temporary issue. Try refreshing or go back home.
//         </p>
//       </div>
//       {/* Error detail (dev-friendly) */}
//       {error?.message && (
//         <pre className="text-xs text-left bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-xl overflow-auto max-h-32">
//           {error.message}
//         </pre>
//       )}
//       <div className="flex flex-col sm:flex-row gap-3 justify-center">
//         <button
//           onClick={onReset}
//           className="px-6 py-3 bg-[#134467] text-white font-semibold rounded-xl hover:bg-[#0d2f4a] transition-colors text-sm"
//         >
//           Try Again
//         </button>
//         <button
//           onClick={() => (window.location.href = "/")}
//           className="px-6 py-3 border border-[#134467] text-[#134467] font-semibold rounded-xl hover:bg-[#134467]/5 transition-colors text-sm"
//         >
//           Go Home
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ── Class-based ErrorBoundary (required by React) ─────────────────────────────
// interface EBState {
//   hasError: boolean;
//   error: Error | null;
// }
// interface EBProps {
//   children: ReactNode;
// }

// class PageErrorBoundary extends Component<EBProps, EBState> {
//   constructor(props: EBProps) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }
//   static getDerivedStateFromError(error: Error): EBState {
//     return { hasError: true, error };
//   }
//   componentDidCatch(error: Error, info: React.ErrorInfo) {
//     console.error("[PageErrorBoundary]", error, info);
//   }
//   reset = () => this.setState({ hasError: false, error: null });
//   render() {
//     if (this.state.hasError) {
//       return (
//         <RouteErrorFallback error={this.state.error!} onReset={this.reset} />
//       );
//     }
//     return this.props.children;
//   }
// }

// // ── Layouts ───────────────────────────────────────────────────────────────────

// // Standard public pages — Navigation sidebar + content offset
// const PublicLayout = () => (
//   <PageErrorBoundary>
//     <div className="min-h-screen">
//       <Navigation />
//       <main className="pt-20 pb-24 lg:pt-0 lg:pb-0 lg:mr-72">
//         <Suspense fallback={<PageLoader />}>
//           <Outlet />
//         </Suspense>
//       </main>
//     </div>
//   </PageErrorBoundary>
// );

// // Full-bleed pages — Navigation only, page controls its own spacing
// const FullBleedLayout = () => (
//   <PageErrorBoundary>
//     <div className="min-h-screen">
//       <Navigation />
//       <Suspense fallback={<PageLoader />}>
//         <Outlet />
//       </Suspense>
//     </div>
//   </PageErrorBoundary>
// );

// // Admin pages — plain bg, own error message
// const AdminLayout = () => (
//   <PageErrorBoundary>
//     <div className="min-h-screen bg-gray-100">
//       <Suspense fallback={<PageLoader />}>
//         <Outlet />
//       </Suspense>
//     </div>
//   </PageErrorBoundary>
// );

// // ── App ───────────────────────────────────────────────────────────────────────
// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <HelmetProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter
//           future={{
//             v7_startTransition: true,
//             v7_relativeSplatPath: true,
//           }}
//         >
//           <ScrollToTop />

//           <Routes>
//             {/* ── ADMIN ────────────────────────────────────────────────── */}
//             <Route element={<AdminLayout />}>
//               <Route path="/admin/login" element={<AdminLoginPage />} />
//               <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
//             </Route>

//             {/* ── FULL-BLEED (must be before PublicLayout locations/:slug) */}
//             <Route element={<FullBleedLayout />}>
//               <Route
//                 path="locations/:locationSlug/:serviceSlug"
//                 element={<LocationServicePage />}
//               />
//             </Route>

//             {/* ── PUBLIC ───────────────────────────────────────────────── */}
//             <Route element={<PublicLayout />}>
//               {/* Core */}
//               <Route index element={<HomePage />} />
//               <Route path="quick-quote" element={<QuickQuotePage />} />
//               <Route
//                 path="/get-a-quote/thank-you"
//                 element={<QuickQuoteThankYouPage />}
//               />
//               <Route path="become-driver" element={<BecomeDriverPage />} />
//               <Route path="for-businesses" element={<ForBusinessesPage />} />
//               <Route path="testimonials" element={<TestimonialsPageLazy />} />

//               {/* Blog */}
//               <Route path="/blog" element={<BlogsPage />} />
//               <Route path="/blog/:slug" element={<BlogPostPage />} />

//               {/* Services */}
//               <Route path="services">
//                 <Route index element={<ServicesPage />} />
//                 <Route path=":slug" element={<ServiceDetailPage />} />
//               </Route>

//               {/* Sectors */}
//               <Route path="sectors" element={<SectorsPage />} />
//               <Route path="sectors/:slug" element={<SectorDetailPage />} />

//               {/* Locations */}
//               <Route path="locations" element={<LocationsPage />} />
//               <Route path="locations/:slug" element={<LocationDetailPage />} />

//               {/* Pay */}
//               <Route path="pay" element={<PayPage />} />
//               <Route path="pay/success" element={<PaySuccessPage />} />
//               <Route path="pay/cancel" element={<PayCancelPage />} />

//               {/* Info */}
//               <Route path="about" element={<AboutPage />} />
//               <Route path="contact" element={<ContactPage />} />
//               <Route path="privacy" element={<PrivacyPolicyPage />} />
//               <Route path="terms" element={<TermsPage />} />
//               <Route path="cookies" element={<CookiesPage />} />
//               <Route path="refund-policy" element={<RefundPolicyPage />} />
//               <Route path="faqs" element={<FAQSPage />} />
//               <Route
//                 path="accredited-trusted"
//                 element={<AccreditedTrustedPage />}
//               />
//               <Route path="rha-summary" element={<RHAPage />} />

//               {/* Thank You */}
//               <Route path="driver-thank-you" element={<DriverThankYouPage />} />
//               <Route
//                 path="shipper-thank-you"
//                 element={<ShipperThankYouPage />}
//               />
//               <Route
//                 path="contact-thank-you"
//                 element={<ContactThankYouPage />}
//               />
//               <Route
//                 path="booking-thank-you"
//                 element={<BookingThankYouPage />}
//               />

//               {/* Redirect */}
//               <Route
//                 path="send-parcel"
//                 element={<Navigate to="/quick-quote" replace />}
//               />
//             </Route>

//             {/* ── 404 ──────────────────────────────────────────────────── */}
//             <Route
//               path="*"
//               element={
//                 <Suspense fallback={<PageLoader />}>
//                   <NotFound />
//                 </Suspense>
//               }
//             />
//           </Routes>

//           {/* <Chatbot /> */}
//         </BrowserRouter>
//       </HelmetProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { lazy, Suspense, Component, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";

// ── Always-on Global Components ───────────────────────────────────────────────
import { Navigation } from "@/components/Navigation";
import { Chatbot } from "@/components/Chatbot";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

// ── Page Loader ───────────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#134467]/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#E53935] border-r-[#48AEDD] border-b-[#F5EB18] border-l-transparent animate-spin" />
      </div>
      <p className="text-[#134467] font-semibold text-sm tracking-wide">
        Loading…
      </p>
    </div>
  </div>
);

// ── Route Error Fallback ──────────────────────────────────────────────────────
const RouteErrorFallback = ({
  error,
  onReset,
}: {
  error: Error;
  onReset: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-white px-6">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="w-full h-1 bg-gradient-to-r from-[#48AEDD] via-[#F5EB18] to-[#E53935] rounded-full" />
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-[#E53935]">Oops!</h1>
        <p className="text-[#134467] font-semibold text-lg">
          Something went wrong loading this page.
        </p>
        <p className="text-slate-400 text-sm">
          This is usually a temporary issue. Try refreshing or go back home.
        </p>
      </div>
      {error?.message && (
        <pre className="text-xs text-left bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-xl overflow-auto max-h-32">
          {error.message}
        </pre>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-[#134467] text-white font-semibold rounded-xl hover:bg-[#0d2f4a] transition-colors text-sm"
        >
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 border border-[#134467] text-[#134467] font-semibold rounded-xl hover:bg-[#134467]/5 transition-colors text-sm"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// ── Error Boundary ────────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
  error: Error | null;
}
interface EBProps {
  children: ReactNode;
}

export class PageErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[PageErrorBoundary]", error, info);
  }
  reset = () => this.setState({ hasError: false, error: null });
  render() {
    if (this.state.hasError) {
      return (
        <RouteErrorFallback error={this.state.error!} onReset={this.reset} />
      );
    }
    return this.props.children;
  }
}

// ── Root Layout — wraps EVERY route with providers ───────────────────────────
// This is the top-level component passed to vite-react-ssg.
// It must NOT contain a BrowserRouter — SSG provides the router.
export const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Outlet />
        {/* <Chatbot /> */}
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// ── Public Layout — Navigation sidebar + content offset ──────────────────────
export const PublicLayout = () => (
  <PageErrorBoundary>
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-24 lg:pt-0 lg:pb-0 lg:mr-72">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  </PageErrorBoundary>
);

// ── Full-bleed Layout — Navigation only, page controls own spacing ────────────
export const FullBleedLayout = () => (
  <PageErrorBoundary>
    <div className="min-h-screen">
      <Navigation />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  </PageErrorBoundary>
);

// ── Admin Layout ──────────────────────────────────────────────────────────────
export const AdminLayout = () => (
  <PageErrorBoundary>
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  </PageErrorBoundary>
);

// Default export kept for any legacy import references
export default RootLayout;
