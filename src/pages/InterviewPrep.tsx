import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, MessageSquare, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Question {
  id: string;
  question: string;
  hint: string;
  isOpen: boolean;
}

const InterviewPrep = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setQuestions([
        {
          id: "1",
          question: "Tell me about yourself and your experience.",
          hint: "Focus on your relevant experience, key achievements, and what drives you professionally. Keep it concise (2-3 minutes) and tailor it to the role.",
          isOpen: false,
        },
        {
          id: "2",
          question: "What's your experience with React and modern frontend frameworks?",
          hint: "Discuss specific projects, challenges you've overcome, and your understanding of React concepts like hooks, state management, and performance optimization.",
          isOpen: false,
        },
        {
          id: "3",
          question: "Describe a challenging project you worked on and how you handled it.",
          hint: "Use the STAR method (Situation, Task, Action, Result). Focus on technical challenges and how you collaborated with your team.",
          isOpen: false,
        },
        {
          id: "4",
          question: "How do you approach debugging complex issues?",
          hint: "Walk through your systematic approach: reproducing the issue, isolating the problem, using debugging tools, and verifying the fix.",
          isOpen: false,
        },
        {
          id: "5",
          question: "Where do you see yourself in 5 years?",
          hint: "Show ambition while being realistic. Discuss skills you want to develop and how they align with the company's growth.",
          isOpen: false,
        },
        {
          id: "6",
          question: "How do you handle disagreements with team members?",
          hint: "Emphasize communication, active listening, and finding common ground. Give a specific example if possible.",
          isOpen: false,
        },
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const toggleQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isOpen: !q.isOpen } : q
    ));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Interview Preparation</h1>
            <p className="text-muted-foreground">
              Get personalized interview questions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Upload Resume</h2>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium mb-1">Click to upload resume</p>
                      <p className="text-sm text-muted-foreground">PDF or DOC (max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="glass-card p-6">
              <Label htmlFor="target-role" className="text-base font-semibold">
                Target Role
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the job title you're interviewing for
              </p>
              <Input
                id="target-role"
                placeholder="e.g., Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="h-12"
              />
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleGenerate}
              disabled={!file || !targetRole || isGenerating}
            >
              {isGenerating ? "Generating Questions..." : "Generate Interview Questions"}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            {questions.length > 0 ? (
              <>
                <h2 className="font-semibold">Interview Questions</h2>
                {questions.map((q, index) => (
                  <Collapsible 
                    key={q.id} 
                    open={q.isOpen} 
                    onOpenChange={() => toggleQuestion(q.id)}
                  >
                    <div className="glass-card overflow-hidden">
                      <CollapsibleTrigger className="w-full p-4 flex items-start gap-4 text-left hover:bg-muted/50 transition-colors">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1 font-medium">{q.question}</span>
                        {q.isOpen ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-0">
                          <div className="p-4 bg-accent/10 rounded-lg ml-12">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-accent mb-1">Hint</p>
                                <p className="text-sm text-muted-foreground">{q.hint}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </>
            ) : (
              <div className="glass-card p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
                <p className="text-muted-foreground">
                  Upload your resume and enter a target role to generate interview questions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
