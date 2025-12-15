import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, FileSearch, TrendingUp, Lightbulb } from "lucide-react";

const ResumeMatcher = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    matchPercentage: number;
    recommendedSkills: string[];
    improvements: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        matchPercentage: 68,
        recommendedSkills: ["React.js", "Node.js", "PostgreSQL", "GraphQL", "CI/CD", "System Design"],
        improvements: [
          "Add more projects showcasing full-stack development",
          "Include experience with cloud platforms (AWS/GCP/Azure)",
          "Highlight leadership and mentoring experience",
          "Add certifications relevant to the role",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl coral-gradient flex items-center justify-center">
            <FileSearch className="w-7 h-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resume Matcher</h1>
            <p className="text-muted-foreground">
              Match your resume to job roles and get recommendations
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
                Target Job Role
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the job title you're targeting
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
              onClick={handleAnalyze}
              disabled={!file || !targetRole || isAnalyzing}
            >
              {isAnalyzing ? "Matching..." : "Match Resume"}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Match Percentage
                  </h2>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold gradient-text">
                        {result.matchPercentage}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {result.matchPercentage >= 70 ? "Good Match" : "Needs Improvement"}
                      </span>
                    </div>
                    <Progress value={result.matchPercentage} className="h-3" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your resume matches {result.matchPercentage}% of the requirements for {targetRole}
                  </p>
                </div>

                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4">Recommended Skills to Add</h2>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    Improvement Suggestions
                  </h2>
                  <ul className="space-y-3">
                    {result.improvements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="glass-card p-12 text-center">
                <FileSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  Upload your resume and enter a target role to see matching results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeMatcher;
