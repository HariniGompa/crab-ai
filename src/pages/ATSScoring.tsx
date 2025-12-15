import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle, Target } from "lucide-react";

const ATSScoring = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    missingSkills: string[];
    feedback: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Placeholder for API call
    setTimeout(() => {
      setResult({
        score: 72,
        missingSkills: ["TypeScript", "AWS", "Docker", "Agile Methodology"],
        feedback: [
          "Add more quantifiable achievements",
          "Include relevant keywords from the job description",
          "Consider adding a skills section at the top",
          "Use action verbs to start bullet points",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
            <Target className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ATS Scoring</h1>
            <p className="text-muted-foreground">
              Score your resume against ATS systems
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
                      <p className="text-sm text-muted-foreground">
                        PDF or DOC (max 5MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="glass-card p-6">
              <Label htmlFor="job-description" className="text-base font-semibold">
                Job Description
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Paste the job description to compare against
              </p>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleAnalyze}
              disabled={!file || !jobDescription || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4">ATS Score</h2>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${result.score * 3.52} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold gradient-text">
                          {result.score}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Your resume scores {result.score}% against ATS requirements
                    </p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    Missing Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {result.feedback.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
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
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  Upload your resume and paste a job description to see your ATS score.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ATSScoring;
