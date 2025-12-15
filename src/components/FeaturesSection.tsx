import { 
  Target, 
  FileSearch, 
  FileEdit, 
  Layout, 
  MessageSquare 
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Scoring",
    description: "Get your resume scored against ATS systems. Identify missing keywords and formatting issues instantly.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileSearch,
    title: "Resume Matcher",
    description: "Match your resume to job descriptions. Get skill recommendations and improvement suggestions.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: FileEdit,
    title: "Resume Builder",
    description: "Create professional resumes with our intelligent builder. Export to PDF or DOC formats.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Layout,
    title: "Portfolio Generator",
    description: "Generate beautiful HTML portfolios to showcase your work. Stand out from the crowd.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Get personalized interview questions based on your resume and target role. Practice with confidence.",
    color: "bg-accent/10 text-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Five Powerful <span className="gradient-text">AI Bots</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each bot is designed to help you with a specific aspect of your job search journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
