import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout, Download, ExternalLink, Check, Upload, User, Briefcase, Settings2, FileText, RefreshCw, Edit3, Plus, Trash2, Save } from "lucide-react";

const sections = [
  { id: "about", label: "About Me", default: true },
  { id: "skills", label: "Skills", default: true },
  { id: "experience", label: "Work Experience", default: true },
  { id: "projects", label: "Projects", default: true },
  { id: "education", label: "Education", default: true },
  { id: "contact", label: "Contact", default: true },
];

type PortfolioType = "student" | "experienced" | "custom";
type TemplateType = "minimal" | "modern" | "creative";

interface ResumeData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  about: string;
  skills: string[];
  experience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    tech: string;
    link: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
  }>;
}

const defaultResumeData: ResumeData = {
  personal: {
    fullName: "John Doe",
    title: "Full Stack Developer",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
  about: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Love turning complex problems into elegant solutions.",
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      role: "Senior Developer",
      duration: "2021 - Present",
      description: "Led development of customer-facing applications serving 100K+ users.",
    },
    {
      id: "2",
      company: "StartupXYZ",
      role: "Full Stack Developer",
      duration: "2019 - 2021",
      description: "Built MVP from scratch, contributed to 3x revenue growth.",
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Full-featured online store with payment integration",
      tech: "React, Node.js, Stripe",
      link: "github.com/johndoe/ecommerce",
    },
    {
      id: "2",
      name: "Task Management App",
      description: "Real-time collaborative task board",
      tech: "Next.js, Supabase",
      link: "github.com/johndoe/taskapp",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California",
      degree: "B.S. Computer Science",
      year: "2019",
    },
  ],
};

const portfolioTypes = [
  { id: "student" as PortfolioType, label: "Student / Fresher", icon: User, description: "No work experience" },
  { id: "experienced" as PortfolioType, label: "Experienced", icon: Briefcase, description: "With work history" },
  { id: "custom" as PortfolioType, label: "Custom", icon: Settings2, description: "Manual control" },
];

const templates = [
  { 
    id: "minimal" as TemplateType, 
    label: "Minimal", 
    description: "Clean, ATS-friendly, single-column",
    colors: { primary: "hsl(var(--primary))", bg: "hsl(var(--background))", accent: "hsl(var(--muted))" }
  },
  { 
    id: "modern" as TemplateType, 
    label: "Modern", 
    description: "Subtle colors, section cards, two-column",
    colors: { primary: "hsl(220 60% 50%)", bg: "hsl(var(--card))", accent: "hsl(220 30% 90%)" }
  },
  { 
    id: "creative" as TemplateType, 
    label: "Creative", 
    description: "Bold headings, portfolio-style layout",
    colors: { primary: "hsl(280 60% 50%)", bg: "hsl(var(--background))", accent: "hsl(280 30% 90%)" }
  },
];

interface ValidationErrors {
  fullName?: string;
  email?: string;
  title?: string;
}

const PortfolioGenerator = () => {
  const [portfolioType, setPortfolioType] = useState<PortfolioType>("custom");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("minimal");
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, s) => ({ ...acc, [s.id]: s.default }), {})
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);
  const [customTemplateFile, setCustomTemplateFile] = useState<File | null>(null);
  const [resumeLinked, setResumeLinked] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [newSkill, setNewSkill] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!resumeData.personal.fullName.trim()) {
      errors.fullName = "Name is required";
    } else if (resumeData.personal.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }
    
    if (!resumeData.personal.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(resumeData.personal.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!resumeData.personal.title.trim()) {
      errors.title = "Professional title is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validateForm()) {
      setIsEditorOpen(false);
    }
  };

  const clearFieldError = (field: keyof ValidationErrors) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePortfolioTypeChange = (type: PortfolioType) => {
    setPortfolioType(type);
    if (type === "student") {
      setSelectedSections(prev => ({ ...prev, experience: false }));
    } else if (type === "experienced") {
      setSelectedSections(prev => ({ ...prev, experience: true }));
    }
  };

  const toggleSection = (id: string) => {
    setSelectedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPortfolioGenerated(true);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.html', '.zip'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (validTypes.includes(ext)) {
        setCustomTemplateFile(file);
      }
    }
  };

  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: "", role: "", duration: "", description: "" }]
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now().toString(), name: "", description: "", tech: "", link: "" }]
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), institution: "", degree: "", year: "" }]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate)!;
  const enabledSections = Object.entries(selectedSections).filter(([_, enabled]) => enabled);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Portfolio Generator</h1>
            <p className="text-muted-foreground text-sm">
              Auto-populates from your resume with full customization
            </p>
          </div>
        </div>

        {/* Resume Data Source Indicator */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Data Source: Your Resume</h3>
                <p className="text-xs text-muted-foreground">
                  {resumeLinked 
                    ? "Portfolio will be auto-populated from your latest resume" 
                    : "Enter all information manually"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch 
                  id="resume-link" 
                  checked={resumeLinked} 
                  onCheckedChange={setResumeLinked}
                />
                <Label htmlFor="resume-link" className="text-xs text-muted-foreground cursor-pointer">
                  Use resume data
                </Label>
              </div>
              {resumeLinked && (
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setIsEditorOpen(true)}>
                <Edit3 className="w-3 h-3 mr-1" />
                Customize
              </Button>
            </div>
          </div>
          {resumeLinked && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" /> Name & Contact
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" /> Skills
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" /> Experience
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" /> Education
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Portfolio Type Selection */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-foreground mb-3">Portfolio Type</h2>
              <div className="grid grid-cols-3 gap-2">
                {portfolioTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handlePortfolioTypeChange(type.id)}
                    className={`p-3 rounded-md border text-left transition-all ${
                      portfolioType === type.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <type.icon className={`w-4 h-4 mb-1 ${portfolioType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-xs font-medium text-foreground">{type.label}</div>
                    <div className="text-[10px] text-muted-foreground">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Toggles */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-foreground mb-3">Select Sections</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Choose which sections to include in your portfolio
              </p>
              <div className="space-y-2">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-md"
                  >
                    <Label htmlFor={section.id} className="cursor-pointer text-sm text-foreground">
                      {section.label}
                    </Label>
                    <Switch
                      id={section.id}
                      checked={selectedSections[section.id]}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-foreground mb-3">Choose Template</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-3 rounded-md border text-left transition-all flex items-center gap-3 ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {/* Mini thumbnail */}
                    <div 
                      className="w-12 h-16 rounded border border-border flex-shrink-0 overflow-hidden"
                      style={{ background: template.colors.bg }}
                    >
                      <div className="h-3 w-full" style={{ background: template.colors.primary }} />
                      <div className="p-1 space-y-1">
                        <div className="h-1 w-6 rounded-sm" style={{ background: template.colors.accent }} />
                        <div className="h-1 w-8 rounded-sm" style={{ background: template.colors.accent }} />
                        <div className="h-1 w-5 rounded-sm" style={{ background: template.colors.accent }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{template.label}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                    {selectedTemplate === template.id && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Template Upload */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">Upload Custom Template</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Advanced</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 border border-dashed border-border rounded-md text-center hover:bg-muted/30 transition-colors"
                >
                  <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  {customTemplateFile ? (
                    <span className="text-xs text-foreground">{customTemplateFile.name}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Upload HTML or ZIP</span>
                  )}
                </button>
                <p className="text-[10px] text-muted-foreground mt-1">
                  For advanced users. Does not replace default templates.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating || !Object.values(selectedSections).some(Boolean)}
              >
                {isGenerating ? "Generating..." : "Generate My Portfolio Website"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your portfolio will be generated as a responsive HTML website
              </p>
            </div>
          </div>

          {/* Preview Section */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">Portfolio Preview</span>
              {portfolioGenerated && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            
            <div className="aspect-[4/3] bg-muted/20 p-4 overflow-hidden">
              {portfolioGenerated ? (
                <div className="bg-card rounded border border-border h-full overflow-hidden animate-scale-in">
                  <div className="h-full flex flex-col">
                    {/* Header styled by template */}
                    <div 
                      className="p-4 text-primary-foreground"
                      style={{ background: currentTemplate.colors.primary }}
                    >
                      <div className="w-14 h-14 rounded-full bg-white/20 mx-auto mb-2" />
                      <div className="h-3 w-20 bg-white/30 rounded mx-auto mb-1" />
                      <div className="h-2 w-28 bg-white/20 rounded mx-auto" />
                    </div>
                    
                    {/* Sections */}
                    <div className="flex-1 p-4 space-y-2 overflow-auto">
                      {enabledSections.slice(0, 5).map(([id]) => (
                        <div key={id} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <div className="h-2 w-full bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col bg-card rounded border border-border overflow-hidden">
                  {/* Wireframe preview header */}
                  <div 
                    className="p-4"
                    style={{ background: currentTemplate.colors.primary, opacity: 0.7 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 mx-auto mb-2 animate-pulse" />
                    <div className="h-2 w-16 bg-white/30 rounded mx-auto mb-1 animate-pulse" />
                    <div className="h-1.5 w-24 bg-white/20 rounded mx-auto animate-pulse" />
                  </div>
                  
                  {/* Wireframe sections */}
                  <div className="flex-1 p-4 space-y-3">
                    {enabledSections.length > 0 ? (
                      enabledSections.slice(0, 4).map(([id], index) => (
                        <div 
                          key={id} 
                          className="space-y-1 animate-pulse"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="h-2 w-16 bg-muted rounded" />
                          <div className="h-1.5 w-full bg-muted/60 rounded" />
                          <div className="h-1.5 w-3/4 bg-muted/40 rounded" />
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Layout className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">
                            Select sections to preview
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {enabledSections.length > 0 && (
                    <div className="p-3 border-t border-border text-center">
                      <p className="text-[10px] text-muted-foreground">
                        {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} template • {enabledSections.length} sections
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Data Editor Sheet */}
      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-background">
          <SheetHeader>
            <SheetTitle className="text-foreground">Edit Portfolio Data</SheetTitle>
            <SheetDescription>
              Customize the information that will appear in your portfolio
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-180px)] mt-4 pr-4">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={resumeData.personal.fullName}
                      onChange={(e) => {
                        updatePersonal('fullName', e.target.value);
                        clearFieldError('fullName');
                      }}
                      className={`mt-1 ${validationErrors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Professional Title <span className="text-destructive">*</span></Label>
                    <Input
                      value={resumeData.personal.title}
                      onChange={(e) => {
                        updatePersonal('title', e.target.value);
                        clearFieldError('title');
                      }}
                      className={`mt-1 ${validationErrors.title ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {validationErrors.title && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.title}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email <span className="text-destructive">*</span></Label>
                    <Input
                      type="email"
                      value={resumeData.personal.email}
                      onChange={(e) => {
                        updatePersonal('email', e.target.value);
                        clearFieldError('email');
                      }}
                      className={`mt-1 ${validationErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input
                      value={resumeData.personal.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <Input
                      value={resumeData.personal.location}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Website</Label>
                    <Input
                      value={resumeData.personal.website}
                      onChange={(e) => updatePersonal('website', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                    <Input
                      value={resumeData.personal.linkedin}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">GitHub</Label>
                    <Input
                      value={resumeData.personal.github}
                      onChange={(e) => updatePersonal('github', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">About Me</h3>
                <Textarea
                  value={resumeData.about}
                  onChange={(e) => setResumeData(prev => ({ ...prev, about: e.target.value }))}
                  rows={4}
                  placeholder="Write a brief introduction about yourself..."
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-foreground"
                    >
                      {skill}
                      <button onClick={() => removeSkill(index)} className="hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Work Experience
                  </h3>
                  <Button size="sm" variant="ghost" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="p-3 border border-border rounded-md space-y-2 bg-muted/30">
                    <div className="flex justify-between">
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company"
                        className="flex-1"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeExperience(exp.id)} className="ml-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        placeholder="Role"
                      />
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        placeholder="Duration"
                      />
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Projects</h3>
                  <Button size="sm" variant="ghost" onClick={addProject}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="p-3 border border-border rounded-md space-y-2 bg-muted/30">
                    <div className="flex justify-between">
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        placeholder="Project Name"
                        className="flex-1"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeProject(proj.id)} className="ml-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={proj.tech}
                        onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                        placeholder="Technologies"
                      />
                      <Input
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        placeholder="Link"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Education</h3>
                  <Button size="sm" variant="ghost" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-3 border border-border rounded-md space-y-2 bg-muted/30">
                    <div className="flex justify-between">
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="Institution"
                        className="flex-1"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeEducation(edu.id)} className="ml-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree"
                      />
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        placeholder="Year"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default PortfolioGenerator;
