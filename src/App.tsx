import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import CreateAccount from "./pages/CreateAccount";
import NotFound from "./pages/NotFound";
import Billing from "./pages/Billing";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import NavLayout from "./components/NavLayout";
import SplashScreen from './components/SplashScreen';

const queryClient = new QueryClient();

function RequireAuth() {
  const isLoggedIn = sessionStorage.getItem('logged-in') === 'true';
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}

function RequireGuest() {
  const isLoggedIn = sessionStorage.getItem('logged-in') === 'true';
  return !isLoggedIn ? <Outlet /> : <Navigate to="/billing" replace />;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<RequireGuest />}>
                <Route path="/" element={<Index />} />
                <Route path="/create-account" element={<CreateAccount />} />
              </Route>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<NavLayout />}>
                  <Route path="billing" element={<Billing />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
