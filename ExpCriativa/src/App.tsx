
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Organization from "./pages/Organization";
import SignUp from "./pages/SignUp";
import ProtectedRoute from './components/protected-route';
import { AuthProvider } from './components/auth-context';
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import DashboardPt from "./pages/DashboardPt";
import Test from "./pages/Test";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CookiePolicy from '@/pages/CookiesPolicy';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DonationHistory from "./pages/DonationHistory";
import ListedOrganizations from "./pages/ListedOrganizations";
import Donors from "./components/Donors";
import Donations from "./components/Donations";
import DonorsPt from "./components/DonorsPt";
import DonationsPt from "./components/DonationsPt";
import AnalyticsPt from "./pages/AnalyticsPt";
import SettingsPt from "./pages/SettingsPt";



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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/dashboardPt" element={<DashboardPt/>} />
              <Route path="/donations" element={<DonationHistory />} />
              <Route path="/donationsDash" element={<Donations />} />
              <Route path="/organization/:id" element={<Organization />} />
              <Route path="/search" element={<ListedOrganizations />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/donorsPt" element={<DonorsPt />} />
              <Route path="/donationsDashPt" element={<DonationsPt />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settingsPt" element={<SettingsPt />} />


            {/* Add other protected routes here */}
            </Route>
            <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/analyticsPt" element={<AnalyticsPt />} />
              <Route path="/reports" element={<NotFound />} />
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
