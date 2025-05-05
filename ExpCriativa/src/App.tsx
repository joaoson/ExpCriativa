
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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/organization" element={<OrganizationProfile />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            {/* Add other protected routes here */}
          </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
      </AuthProvider>

    </QueryClientProvider>
  );
};

export default App;
