import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layout, Download, ExternalLink, Check, Upload, User, Briefcase, Settings2, FileText, RefreshCw, Edit3 } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePortfolioTypeChange = (type: PortfolioType) => {
    setPortfolioType(type);
    if (type === "student") {
      setSelectedSections(prev => ({ ...prev, experience: false }));
    } else if (type === "experienced") {
      setSelectedSections(prev => ({ ...prev, experience: true }));
    }
    // Custom type doesn't change anything
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
              <Button variant="ghost" size="sm" className="h-8 text-xs">
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
    </DashboardLayout>
  );
};

export default PortfolioGenerator;
