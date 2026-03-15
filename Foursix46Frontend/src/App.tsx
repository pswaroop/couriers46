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
// } from "react-router-dom";
// import { lazy, Suspense } from "react";
// import { HelmetProvider } from "react-helmet-async";
// import { ErrorBoundary, FallbackProps } from "react-error-boundary";

// // --- Eager load critical components ---
// import { Navigation } from "@/components/Navigation";
// import { Chatbot } from "@/components/Chatbot";
// import ScrollToTop from "@/components/ScrollToTop";

// // --- Lazy load all page components for code splitting ---
// const HomePage = lazy(() => import("@/pages/HomePage"));
// const QuickQuotePage = lazy(() => import("@/pages/QuickQuotePage"));
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
// const LocationServicePage = lazy(() => import("@/pages/LocationServicePage"));
// const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
// const LocationDetailPage = lazy(() => import("@/pages/LocationDetailPage"));
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

// // TestimonialsPage uses named export
// const TestimonialsPageLazy = lazy(async () => {
//   const module = await import("@/pages/TestimonialsPage");
//   return { default: module.TestimonialsPage };
// });

// const queryClient = new QueryClient();

// // --- Global Loading Spinner ---
// const PageLoader = () => (
//   <div className="min-h-screen flex items-center justify-center bg-slate-50">
//     <div className="flex flex-col items-center gap-4">
//       <div className="w-16 h-16 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin" />
//       <p className="text-[#134467] font-semibold">Loading...</p>
//     </div>
//   </div>
// );

// // --- Admin Error Fallback ---
// // Shown when an admin page crashes (instead of a blank screen)
// const AdminErrorFallback = ({ error }: { error: Error }) => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100">
//     <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
//       <h2 className="text-xl font-bold text-red-600 mb-2">Admin Page Error</h2>
//       <p className="text-gray-600 mb-4 text-sm">
//         The page failed to load. Check the browser console for details.
//       </p>
//       <pre className="text-xs text-left bg-red-50 text-red-700 p-3 rounded overflow-auto mb-4">
//         {error?.message}
//       </pre>
//       <button
//         onClick={() => window.location.reload()}
//         className="px-4 py-2 bg-[#134467] text-white rounded hover:bg-[#0e3352] transition-colors text-sm"
//       >
//         Reload Page
//       </button>
//     </div>
//   </div>
// );

// // --- Public Layout ---
// // Wraps all public pages with Navigation sidebar
// const PublicLayout = () => (
//   <div className="min-h-screen">
//     <Navigation />
//     <main className="pt-20 pb-24 lg:pt-0 lg:pb-0 lg:mr-72">
//       <Outlet />
//     </main>
//   </div>
// );

// // --- Admin Layout ---
// // Minimal wrapper for admin pages — no Navigation, clean background
// // FIX: Without this, admin pages may render invisibly (no height/styles)
// const AdminLayout = () => (
//   <div className="min-h-screen bg-gray-100">
//     <Outlet />
//   </div>
// );

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
//           <Suspense fallback={<PageLoader />}>
//             <Routes>
//               {/* ---------------------------------------- */}
//               {/* ADMIN ROUTES — Isolated layout, no Navigation */}
//               {/* FIX: Wrapped in AdminLayout so pages have a visible shell */}
//               {/* FIX: ErrorBoundary catches silent render crashes → no more blank pages */}
//               {/* ---------------------------------------- */}
//               <Route
//                 element={
//                   <ErrorBoundary
//                     FallbackComponent={
//                       AdminErrorFallback as React.ComponentType<FallbackProps>
//                     }
//                   >
//                     <AdminLayout />
//                   </ErrorBoundary>
//                 }
//               >
//                 <Route path="/admin/login" element={<AdminLoginPage />} />
//                 <Route
//                   path="/admin/dashboard"
//                   element={<AdminDashboardPage />}
//                 />
//               </Route>

//               {/* ---------------------------------------- */}
//               {/* PUBLIC ROUTES — Wrapped in PublicLayout */}
//               {/* FIX: path="*" REMOVED from here (was intercepting admin routes) */}
//               {/* ---------------------------------------- */}
//               <Route element={<PublicLayout />}>
//                 <Route index element={<HomePage />} />
//                 <Route path="quick-quote" element={<QuickQuotePage />} />
//                 <Route path="become-driver" element={<BecomeDriverPage />} />
//                 <Route path="for-businesses" element={<ForBusinessesPage />} />
//                 <Route path="testimonials" element={<TestimonialsPageLazy />} />
//                 <Route path="services">
//                   <Route index element={<ServicesPage />} />
//                   <Route path=":slug" element={<ServiceDetailPage />} />
//                 </Route>
//                 <Route path="sectors" element={<SectorsPage />} />
//                 <Route path="sectors/:slug" element={<SectorDetailPage />} />
//                 <Route path="locations" element={<LocationsPage />} />
//                 <Route
//                   path="locations/:slug"
//                   element={<LocationDetailPage />}
//                 />
//                 <Route
//                   path="locations/:locationSlug/:serviceSlug"
//                   element={<LocationServicePage />}
//                 />
//                 <Route path="about" element={<AboutPage />} />
//                 <Route path="pay" element={<PayPage />} />
//                 <Route path="pay/success" element={<PaySuccessPage />} />
//                 <Route path="pay/cancel" element={<PayCancelPage />} />
//                 <Route path="contact" element={<ContactPage />} />
//                 <Route path="privacy" element={<PrivacyPolicyPage />} />
//                 <Route path="terms" element={<TermsPage />} />
//                 <Route path="cookies" element={<CookiesPage />} />
//                 <Route path="refund-policy" element={<RefundPolicyPage />} />
//                 <Route path="faqs" element={<FAQSPage />} />
//                 <Route
//                   path="accredited-trusted"
//                   element={<AccreditedTrustedPage />}
//                 />
//                 <Route path="rha-summary" element={<RHAPage />} />
//                 <Route
//                   path="driver-thank-you"
//                   element={<DriverThankYouPage />}
//                 />
//                 <Route
//                   path="shipper-thank-you"
//                   element={<ShipperThankYouPage />}
//                 />
//                 <Route
//                   path="contact-thank-you"
//                   element={<ContactThankYouPage />}
//                 />
//                 <Route
//                   path="booking-thank-you"
//                   element={<BookingThankYouPage />}
//                 />
//                 {/* FIX: Removed leading slash — paths inside layout routes must be relative */}
//                 <Route
//                   path="send-parcel"
//                   element={<Navigate to="/quick-quote" replace />}
//                 />
//               </Route>

//               {/* ---------------------------------------- */}
//               {/* GLOBAL 404 — Must be OUTSIDE all layout routes */}
//               {/* FIX: Moved here so it only fires when NO route matches at all */}
//               {/* ---------------------------------------- */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>

//           {/* Chatbot — available on all public pages */}
//           <Chatbot />
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
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

// --- Eager load critical components ---
import { Navigation } from "@/components/Navigation";
import { Chatbot } from "@/components/Chatbot";
import ScrollToTop from "@/components/ScrollToTop";

// --- Lazy load all page components ---
const HomePage = lazy(() => import("@/pages/HomePage"));
const QuickQuotePage = lazy(() => import("@/pages/QuickQuotePage"));
const BecomeDriverPage = lazy(() => import("@/pages/BecomeDriverPage"));
const ForBusinessesPage = lazy(() => import("@/pages/ForBusinessesPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage"));
const SectorsPage = lazy(() => import("@/pages/SectorsPage"));
const SectorDetailPage = lazy(() => import("@/pages/SectorDetailPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PayPage = lazy(() => import("@/pages/PayPage"));
const PaySuccessPage = lazy(() => import("@/pages/PaySuccessPage"));
const PayCancelPage = lazy(() => import("@/pages/PayCancelPage"));
const LocationsPage = lazy(() => import("@/pages/LocationsPage"));
const LocationDetailPage = lazy(() => import("@/pages/LocationDetailPage"));

// ✅ LocationServicePage — full-bleed layout, kept outside PublicLayout
const LocationServicePage = lazy(() => import("@/pages/LocationServicePage"));

const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const CookiesPage = lazy(() => import("@/pages/CookiesPage"));
const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage"));
const FAQSPage = lazy(() => import("@/pages/FAQSPage"));
const AccreditedTrustedPage = lazy(
  () => import("@/pages/AccreditedTrustedPage"),
);
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const RHAPage = lazy(() => import("@/pages/RHAPage"));
const DriverThankYouPage = lazy(() => import("@/pages/DriverThankYouPage"));
const ShipperThankYouPage = lazy(() => import("@/pages/ShipperThankYouPage"));
const ContactThankYouPage = lazy(() => import("@/pages/ContactThankYouPage"));
const BookingThankYouPage = lazy(() => import("@/pages/BookingThankYouPage"));

// TestimonialsPage uses named export
const TestimonialsPageLazy = lazy(async () => {
  const module = await import("@/pages/TestimonialsPage");
  return { default: module.TestimonialsPage };
});

const queryClient = new QueryClient();

// --- Global Loading Spinner ---
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-[#48AEDD] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#134467] font-semibold">Loading...</p>
    </div>
  </div>
);

// --- Admin Error Fallback ---
const AdminErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Admin Page Error</h2>
      <p className="text-gray-600 mb-4 text-sm">
        The page failed to load. Check the browser console for details.
      </p>
      <pre className="text-xs text-left bg-red-50 text-red-700 p-3 rounded overflow-auto mb-4">
        {error?.message}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-[#134467] text-white rounded hover:bg-[#0e3352] transition-colors text-sm"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// --- Public Layout (with Navigation sidebar) ---
const PublicLayout = () => (
  <div className="min-h-screen">
    <Navigation />
    <main className="pt-20 pb-24 lg:pt-0 lg:pb-0 lg:mr-72">
      <Outlet />
    </main>
  </div>
);

// --- Full Bleed Layout (Navigation only, no main padding) ---
// Used for pages with full-width hero sections that manage their own spacing
const FullBleedLayout = () => (
  <div className="min-h-screen">
    <Navigation />
    <Outlet />
  </div>
);

// --- Admin Layout ---
const AdminLayout = () => (
  <div className="min-h-screen bg-gray-100">
    <Outlet />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── ADMIN ROUTES ─────────────────────────────────────── */}
              <Route
                element={
                  <ErrorBoundary
                    FallbackComponent={
                      AdminErrorFallback as React.ComponentType<FallbackProps>
                    }
                  >
                    <AdminLayout />
                  </ErrorBoundary>
                }
              >
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboardPage />}
                />
              </Route>

              {/* ── LOCATION SERVICE PAGES (full-bleed, no main padding) ── */}
              {/* ✅ Must be BEFORE PublicLayout's locations/:slug route    */}
              {/* ✅ Uses FullBleedLayout so hero isn't offset by pt-20     */}
              <Route element={<FullBleedLayout />}>
                <Route
                  path="locations/:locationSlug/:serviceSlug"
                  element={<LocationServicePage />}
                />
              </Route>

              {/* ── PUBLIC ROUTES ────────────────────────────────────── */}
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="quick-quote" element={<QuickQuotePage />} />
                <Route path="become-driver" element={<BecomeDriverPage />} />
                <Route path="for-businesses" element={<ForBusinessesPage />} />
                <Route path="testimonials" element={<TestimonialsPageLazy />} />
                <Route path="services">
                  <Route index element={<ServicesPage />} />
                  <Route path=":slug" element={<ServiceDetailPage />} />
                </Route>
                <Route path="sectors" element={<SectorsPage />} />
                <Route path="sectors/:slug" element={<SectorDetailPage />} />
                <Route path="locations" element={<LocationsPage />} />
                <Route
                  path="locations/:slug"
                  element={<LocationDetailPage />}
                />
                <Route path="about" element={<AboutPage />} />
                <Route path="pay" element={<PayPage />} />
                <Route path="pay/success" element={<PaySuccessPage />} />
                <Route path="pay/cancel" element={<PayCancelPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="cookies" element={<CookiesPage />} />
                <Route path="refund-policy" element={<RefundPolicyPage />} />
                <Route path="faqs" element={<FAQSPage />} />
                <Route
                  path="accredited-trusted"
                  element={<AccreditedTrustedPage />}
                />
                <Route path="rha-summary" element={<RHAPage />} />
                <Route
                  path="driver-thank-you"
                  element={<DriverThankYouPage />}
                />
                <Route
                  path="shipper-thank-you"
                  element={<ShipperThankYouPage />}
                />
                <Route
                  path="contact-thank-you"
                  element={<ContactThankYouPage />}
                />
                <Route
                  path="booking-thank-you"
                  element={<BookingThankYouPage />}
                />
                <Route
                  path="send-parcel"
                  element={<Navigate to="/quick-quote" replace />}
                />
              </Route>

              {/* ── 404 ──────────────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Chatbot />
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
