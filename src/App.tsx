import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import Index from "./pages/Index";
import RuleEditor from "./pages/RuleEditor";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import YnabSettings from "./pages/YnabSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/rule-editor" element={
              <ProtectedRoute>
                <RuleEditor />
              </ProtectedRoute>
            } />
            <Route path="/rule-editor/:id" element={
              <ProtectedRoute>
                <RuleEditor />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
            <Route path="/ynab-settings" element={
  <ProtectedRoute>
    <YnabSettings />
  </ProtectedRoute>
} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
