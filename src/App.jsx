import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./controllers/AuthController";
import { ThemeProvider } from "./controllers/ThemeController";
import Navbar       from "./views/components/layout/Navbar";
import PrivateRoute from "./views/components/common/PrivateRoute";
import AdminRoute   from "./views/components/common/AdminRoute";
import Spinner      from "./views/components/common/Spinner";

// ── Lazy-loaded pages ─────────────────────────────────────────────────────
const HomePage           = lazy(() => import("./views/pages/HomePage"));
const SalonListingPage   = lazy(() => import("./views/pages/SalonListingPage"));
const SalonDetailPage    = lazy(() => import("./views/pages/SalonDetailPage"));
const AIFinderPage       = lazy(() => import("./views/pages/AIFinderPage"));
const LoginPage          = lazy(() => import("./views/pages/LoginPage"));
const SignupPage         = lazy(() => import("./views/pages/SignupPage"));
const AdminLoginPage     = lazy(() => import("./views/pages/AdminLoginPage"));
const AdminSignupPage    = lazy(() => import("./views/pages/AdminSignupPage"));
const DashboardPage      = lazy(() => import("./views/pages/DashboardPage"));
const ContactPage        = lazy(() => import("./views/pages/ContactPage"));
const PaymentPage        = lazy(() => import("./views/pages/PaymentPage"));
const BookingConfirmPage = lazy(() => import("./views/pages/BookingConfirmPage"));
const MyBookingsPage     = lazy(() => import("./views/pages/MyBookingsPage"));
const ProfilePage        = lazy(() => import("./views/pages/ProfilePage"));
const AdminDashboardPage = lazy(() => import("./views/pages/AdminDashboardPage"));
const EditSalonPage      = lazy(() => import("./views/pages/EditSalonPage"));
const OurStoryPage       = lazy(() => import("./views/pages/OurStoryPage"));
const CareersPage        = lazy(() => import("./views/pages/CareersPage"));
const PressPage          = lazy(() => import("./views/pages/PressPage"));
const BlogPage           = lazy(() => import("./views/pages/BlogPage"));

// ── Scroll to top on every route change ──────────────────────────────────
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* ── Public ─────────────────────────────────── */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/salons"     element={<SalonListingPage />} />
          <Route path="/salons/:id" element={<SalonDetailPage />} />
          <Route path="/ai-finder"  element={<AIFinderPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/signup"     element={<SignupPage />} />
          <Route path="/admin-login"  element={<AdminLoginPage />} />
          <Route path="/admin-signup" element={<AdminSignupPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/payment"  element={<PrivateRoute><PaymentPage /></PrivateRoute>} />

          {/* ── Footer pages ───────────────────────────── */}
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/careers"   element={<CareersPage />} />
          <Route path="/press"     element={<PressPage />} />
          <Route path="/blog"      element={<BlogPage />} />

          {/* ── Authenticated ──────────────────────────── */}
          <Route path="/dashboard"
            element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/booking/:id/confirm"
            element={<PrivateRoute><BookingConfirmPage /></PrivateRoute>} />
          <Route path="/my-bookings"
            element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
          <Route path="/profile"
            element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          {/* ── Admin ──────────────────────────────────── */}
          <Route path="/admin"
            element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/salons/edit"
            element={<AdminRoute><EditSalonPage /></AdminRoute>} />

          {/* ── Fallback ───────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}