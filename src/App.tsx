import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ATSScoring from "./pages/ATSScoring";
import ResumeMatcher from "./pages/ResumeMatcher";
import ResumeBuilder from "./pages/ResumeBuilder";
import PortfolioGenerator from "./pages/PortfolioGenerator";
import SkillRecommendation from "./pages/SkillRecommendation";
import InterviewPrep from "./pages/InterviewPrep";
import Profile from "./pages/Profile";
import FileLibrary from "./pages/FileLibrary";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/ats-scoring" element={<ATSScoring />} />
              <Route path="/dashboard/resume-matcher" element={<ResumeMatcher />} />
              <Route path="/dashboard/resume-builder" element={<ResumeBuilder />} />
              <Route path="/dashboard/portfolio" element={<PortfolioGenerator />} />
              <Route path="/dashboard/skill-recommendation" element={<SkillRecommendation />} />
              <Route path="/dashboard/interview" element={<InterviewPrep />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/files" element={<FileLibrary />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
