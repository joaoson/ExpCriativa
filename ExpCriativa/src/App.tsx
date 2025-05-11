
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
import TermsOfService from './pages/TermsOfService';


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

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard/>} />
            {/* Add other protected routes here */}
            </Route>
            <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/donors" element={<NotFound />} />
              <Route path="/donations" element={<NotFound />} />
              <Route path="/reports" element={<NotFound />} />
              <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
      </AuthProvider>

    </QueryClientProvider>
  );
};

export default App;
