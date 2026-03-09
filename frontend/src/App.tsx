import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider, ProtectedRoute } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import PlanSelection from "./pages/onboarding/PlanSelection";
import DashboardHome from "./pages/DashboardHome";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Integrations from "./pages/Integrations";
import SettingsPage from "./pages/SettingsPage";
import Billing from "./pages/Billing";
import Upgrade from "./pages/Upgrade";
import Documentation from "./pages/Documentation";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ScrollToHash } from "./components/ScrollToHash";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000, // 30 seconds
    },
  },
});

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToHash />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/onboarding/profile" element={<ProfileSetup />} />
                <Route path="/onboarding/plan" element={<PlanSelection />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={<DashboardWrapper><DashboardHome /></DashboardWrapper>} />
                <Route path="/dashboard/reviews" element={<DashboardWrapper><Reviews /></DashboardWrapper>} />
                <Route path="/dashboard/analytics" element={<DashboardWrapper><Analytics /></DashboardWrapper>} />
                <Route path="/dashboard/integrations" element={<DashboardWrapper><Integrations /></DashboardWrapper>} />
                <Route path="/dashboard/settings" element={<DashboardWrapper><SettingsPage /></DashboardWrapper>} />
                <Route path="/dashboard/billing" element={<DashboardWrapper><Billing /></DashboardWrapper>} />
                <Route path="/dashboard/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
