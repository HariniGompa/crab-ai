import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Target, 
  FileSearch, 
  FileEdit, 
  Layout, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const bots = [
  {
    icon: Target,
    title: "ATS Scoring",
    description: "Score your resume against ATS systems and get detailed feedback on keywords and formatting.",
    path: "/dashboard/ats-scoring",
    color: "ocean-gradient",
  },
  {
    icon: FileSearch,
    title: "Resume Matcher",
    description: "Match your resume to specific job descriptions and get skill recommendations.",
    path: "/dashboard/resume-matcher",
    color: "coral-gradient",
  },
  {
    icon: FileEdit,
    title: "Resume Builder",
    description: "Create professional resumes with our intelligent form builder. Export to PDF or DOC.",
    path: "/dashboard/resume-builder",
    color: "ocean-gradient",
  },
  {
    icon: Layout,
    title: "Portfolio Generator",
    description: "Generate beautiful HTML portfolios to showcase your work and projects.",
    path: "/dashboard/portfolio",
    color: "coral-gradient",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    description: "Get personalized interview questions based on your resume and target role.",
    path: "/dashboard/interview",
    color: "ocean-gradient",
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Select a bot below to get started with your career enhancement journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot, index) => (
            <div 
              key={bot.title}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${bot.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <bot.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{bot.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{bot.description}</p>
              <Button variant="outline" asChild className="w-full group-hover:border-primary/50">
                <Link to={bot.path}>
                  Open Bot
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
