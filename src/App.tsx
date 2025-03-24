import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { ThemeProvider } from "./lib/theme-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import Index from "./pages/Index";
import RuleEditor from "./pages/RuleEditor";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import YnabSettings from "./pages/YnabSettings";
import Profile from "./pages/Profile";
import TransactionPreviewPage from "./pages/TransactionPreview";
import RuleExecutionsPage from "./pages/RuleExecutions";
import CategoryMappingPage from "./pages/CategoryMapping";
import TransactionsPage from "./pages/TransactionsPage";
import { RulesPage } from "./pages/RulesPage";
import { RuleDetailPage } from "./pages/RuleDetailPage";
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
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
                  <Route path="/rules" element={
                    <ProtectedRoute>
                      <RulesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/rules/:id" element={
                    <ProtectedRoute>
                      <RuleDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/rules/new" element={
                    <ProtectedRoute>
                      <RuleEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/rules/:id/edit" element={
                    <ProtectedRoute>
                      <RuleEditor />
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
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/transaction-preview" element={
                    <ProtectedRoute>
                      <TransactionPreviewPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/rule-executions" element={
                    <ProtectedRoute>
                      <RuleExecutionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/category-mapping" element={
                    <ProtectedRoute>
                      <CategoryMappingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/ynab-settings" element={
                    <ProtectedRoute>
                      <YnabSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
