
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrganizationProfile from "./pages/Organization";
import SignUp from "./pages/SignUp";
import ProtectedRoute from './components/protected-route';
import { AuthProvider } from './components/auth-context';
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CookiePolicy from '@/pages/CookiesPolicy';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DonationHistory from "./pages/DonationHistory";
import ProfilePerson from "./pages/ProfilePerson";



// Create a QueryClient instance
const queryClient = new QueryClient();

// Refactor the App component to a function component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>

      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/organization" element={<OrganizationProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/donations" element={<DonationHistory />} />
                <Route path="/profile" element={<ProfilePerson />} />
            {/* Add other protected routes here */}
            </Route>
            <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/donors" element={<NotFound />} />
              <Route path="/reports" element={<NotFound />} />
              <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
      </AuthProvider>

    </QueryClientProvider>
  );
};

export default App;
