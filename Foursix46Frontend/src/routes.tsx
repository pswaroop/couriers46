import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { RouteRecord } from "vite-react-ssg";
import {
  RootLayout,
  PublicLayout,
  FullBleedLayout,
  AdminLayout,
  PageLoader,
} from "./App";

// ── Lazy Pages ────────────────────────────────────────────────────────────────
const HomePage = lazy(() => import("@/pages/HomePage"));
const QuickQuotePage = lazy(() => import("@/pages/QuickQuotePage"));
const QuickQuoteThankYouPage = lazy(
  () => import("@/pages/QuickQuoteThankYouPage"),
);
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
const BlogsPage = lazy(() => import("@/pages/BlogsPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const TestimonialsPage = lazy(() =>
  import("@/pages/TestimonialsPage").then((m) => ({
    default: m.TestimonialsPage,
  })),
);

// ── Wrap lazy page in Suspense for SSG entry points ───────────────────────────
const s = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes: RouteRecord[] = [
  {
    // ── Root: provides QueryClient, HelmetProvider, Toaster, ScrollToTop ──
    path: "/",
    Component: RootLayout,
    children: [
      // ── ADMIN ─────────────────────────────────────────────────────────────
      {
        Component: AdminLayout,
        children: [
          { path: "admin/login", element: s(AdminLoginPage) },
          { path: "admin/dashboard", element: s(AdminDashboardPage) },
        ],
      },

      // ── FULL-BLEED (location service pages) ───────────────────────────────
      {
        Component: FullBleedLayout,
        children: [
          {
            path: "locations/:locationSlug/:serviceSlug",
            lazy: async () => {
              const mod = await import("@/pages/LocationServicePage");
              return {
                Component: mod.default,
                ...(mod.loader && { loader: mod.loader }),
              };
            },
          },
        ],
      },

      // ── PUBLIC ────────────────────────────────────────────────────────────
      {
        Component: PublicLayout,
        children: [
          // Core
          { index: true, element: s(HomePage) },
          { path: "quick-quote", element: s(QuickQuotePage) },
          { path: "get-a-quote/thank-you", element: s(QuickQuoteThankYouPage) },
          { path: "become-driver", element: s(BecomeDriverPage) },
          { path: "for-businesses", element: s(ForBusinessesPage) },
          { path: "testimonials", element: s(TestimonialsPage) },

          // Blog
          { path: "blog", element: s(BlogsPage) },
          {
            path: "blog/:slug",
            lazy: async () => {
              const mod = await import("@/pages/BlogPostPage");
              return {
                Component: mod.default,
                ...(mod.loader && { loader: mod.loader }),
              };
            },
          },

          // Services
          { path: "services", element: s(ServicesPage) },
          {
            path: "services/:slug",
            lazy: async () => {
              const mod = await import("@/pages/ServiceDetailPage");
              return {
                Component: mod.default,
                ...(mod.loader && { loader: mod.loader }),
              };
            },
          },

          // Sectors
          { path: "sectors", element: s(SectorsPage) },
          {
            path: "sectors/:slug",
            lazy: async () => {
              const mod = await import("@/pages/SectorDetailPage");
              return {
                Component: mod.default,
                ...(mod.loader && { loader: mod.loader }),
              };
            },
          },

          // Locations
          { path: "locations", element: s(LocationsPage) },
          {
            path: "locations/:slug",
            lazy: async () => {
              const mod = await import("@/pages/LocationDetailPage");
              return {
                Component: mod.default,
                ...(mod.loader && { loader: mod.loader }),
              };
            },
          },

          // Pay
          { path: "pay", element: s(PayPage) },
          { path: "pay/success", element: s(PaySuccessPage) },
          { path: "pay/cancel", element: s(PayCancelPage) },

          // Info
          { path: "about", element: s(AboutPage) },
          { path: "contact", element: s(ContactPage) },
          { path: "privacy", element: s(PrivacyPolicyPage) },
          { path: "terms", element: s(TermsPage) },
          { path: "cookies", element: s(CookiesPage) },
          { path: "refund-policy", element: s(RefundPolicyPage) },
          { path: "faqs", element: s(FAQSPage) },
          { path: "accredited-trusted", element: s(AccreditedTrustedPage) },
          { path: "rha-summary", element: s(RHAPage) },

          // Thank You
          { path: "driver-thank-you", element: s(DriverThankYouPage) },
          { path: "shipper-thank-you", element: s(ShipperThankYouPage) },
          { path: "contact-thank-you", element: s(ContactThankYouPage) },
          { path: "booking-thank-you", element: s(BookingThankYouPage) },

          // Redirect
          {
            path: "send-parcel",
            element: <Navigate to="/quick-quote" replace />,
          },
        ],
      },

      // ── 404 ───────────────────────────────────────────────────────────────
      { path: "*", element: s(NotFound) },
    ],
  },
];
