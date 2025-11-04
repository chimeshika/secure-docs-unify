import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Folders from "./pages/Folders";
import SearchPage from "./pages/SearchPage";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import AccessRequests from "./pages/AccessRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/documents" element={<Documents />} />
          <Route path="/dashboard/folders" element={<Folders />} />
          <Route path="/dashboard/search" element={<SearchPage />} />
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/dashboard/access-requests" element={<AccessRequests />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
