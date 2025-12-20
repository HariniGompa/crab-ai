import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileEdit, Plus, Trash2, Download, Eye, Upload, Check, ArrowLeft, ArrowRight, Briefcase, GraduationCap, Loader2, Save, Github, Linkedin, Globe, Award, BadgeCheck, Building2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useResumes, Resume } from "@/hooks/useResumes";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

interface ProfileLink {
  id: string;
  platform: string;
  url: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Internship {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

type UserType = "fresher" | "experienced" | null;
type BuilderStep = "user-type" | "template" | "form";

const templates = [
  { id: "professional", name: "Professional", description: "Clean and modern design for corporate roles" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant with focus on content" },
  { id: "creative", name: "Creative", description: "Stand out with a unique layout" },
  { id: "academic", name: "Academic", description: "Perfect for research and academic positions" },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canCreateResume, createResume, resumeCount, maxResumes } = useResumes();
  
  const [step, setStep] = useState<BuilderStep>("user-type");
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTemplate, setCustomTemplate] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("My Resume");
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", title: "", company: "", duration: "", description: "" }
  ]);
  
  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "", institution: "", year: "" }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "", description: "", technologies: "" }
  ]);

  const [profileLinks, setProfileLinks] = useState<ProfileLink[]>([
    { id: "1", platform: "", url: "" }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", title: "", description: "" }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "1", name: "", issuer: "", date: "" }
  ]);

  const [internships, setInternships] = useState<Internship[]>([
    { id: "1", title: "", company: "", duration: "", description: "" }
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!resumeRef.current) {
      toast.error("Please switch to preview mode first");
      return;
    }

    setIsExporting(true);
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      const fileName = formData.fullName 
        ? `${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";
      
      pdf.save(fileName);
      toast.success("Resume exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveResume = async () => {
    if (!user) {
      toast.error("Please sign in to save your resume");
      navigate("/auth");
      return;
    }

    if (!canCreateResume()) {
      toast.error(`Maximum of ${maxResumes} resumes allowed. Please delete an existing resume first.`);
      return;
    }

    setIsSaving(true);
    try {
      await createResume({
        name: resumeName || "Untitled Resume",
        user_type: userType as 'fresher' | 'experienced',
        template: selectedTemplate || "custom",
        form_data: formData,
        experiences,
        education,
        projects,
        profile_links: profileLinks,
        achievements,
        certifications,
        internships,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep("template");
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCustomTemplate(null);
  };

  const handleCustomTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomTemplate(file);
      setSelectedTemplate(null);
    }
  };

  const handleContinueToForm = () => {
    if (selectedTemplate || customTemplate) {
      setStep("form");
    }
  };

  // Experience handlers
  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), title: "", company: "", duration: "", description: "" }]);
  };
  const removeExperience = (id: string) => {
    if (experiences.length > 1) setExperiences(experiences.filter(e => e.id !== id));
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Education handlers
  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), degree: "", institution: "", year: "" }]);
  };
  const removeEducation = (id: string) => {
    if (education.length > 1) setEducation(education.filter(e => e.id !== id));
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Project handlers
  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), name: "", description: "", technologies: "" }]);
  };
  const removeProject = (id: string) => {
    if (projects.length > 1) setProjects(projects.filter(p => p.id !== id));
  };
  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Profile Links handlers
  const addProfileLink = () => {
    setProfileLinks([...profileLinks, { id: Date.now().toString(), platform: "", url: "" }]);
  };
  const removeProfileLink = (id: string) => {
    if (profileLinks.length > 1) setProfileLinks(profileLinks.filter(p => p.id !== id));
  };
  const updateProfileLink = (id: string, field: keyof ProfileLink, value: string) => {
    setProfileLinks(profileLinks.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Achievements handlers
  const addAchievement = () => {
    setAchievements([...achievements, { id: Date.now().toString(), title: "", description: "" }]);
  };
  const removeAchievement = (id: string) => {
    if (achievements.length > 1) setAchievements(achievements.filter(a => a.id !== id));
  };
  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  // Certifications handlers
  const addCertification = () => {
    setCertifications([...certifications, { id: Date.now().toString(), name: "", issuer: "", date: "" }]);
  };
  const removeCertification = (id: string) => {
    if (certifications.length > 1) setCertifications(certifications.filter(c => c.id !== id));
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Internships handlers
  const addInternship = () => {
    setInternships([...internships, { id: Date.now().toString(), title: "", company: "", duration: "", description: "" }]);
  };
  const removeInternship = (id: string) => {
    if (internships.length > 1) setInternships(internships.filter(i => i.id !== id));
  };
  const updateInternship = (id: string, field: keyof Internship, value: string) => {
    setInternships(internships.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // User Type Selection Step
  if (step === "user-type") {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Resume Builder</h1>
              <p className="text-muted-foreground text-sm">Let's create your professional resume</p>
            </div>
          </div>

          {user && (
            <div className="mb-6 p-4 glass-card">
              <p className="text-sm text-muted-foreground">
                Resumes saved: <span className="font-semibold text-foreground">{resumeCount}/{maxResumes}</span>
              </p>
            </div>
          )}

          <div className="glass-card p-8 text-center">
            <h2 className="text-lg font-semibold mb-2">What describes you best?</h2>
            <p className="text-muted-foreground text-sm mb-8">This helps us customize your resume sections</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleUserTypeSelect("fresher")}
                className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Fresher / Student</h3>
                <p className="text-sm text-muted-foreground">
                  New to the workforce or recent graduate with limited work experience
                </p>
              </button>

              <button
                onClick={() => handleUserTypeSelect("experienced")}
                className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Experienced Professional</h3>
                <p className="text-sm text-muted-foreground">
                  Have relevant work experience to showcase
                </p>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Template Selection Step
  if (step === "template") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep("user-type")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Choose a Template</h1>
              <p className="text-muted-foreground text-sm">Select a template or upload your own</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="aspect-[8.5/11] bg-muted rounded mb-3 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">Preview</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Template Upload */}
          <div className="glass-card p-5 mb-6">
            <h3 className="font-medium mb-3">Use Your Own Template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your own resume template (PDF/DOC). Your template will be used for formatting only.
            </p>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCustomTemplateUpload}
                  className="hidden"
                />
                <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                  customTemplate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}>
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  {customTemplate ? (
                    <p className="text-sm font-medium">{customTemplate.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click to upload PDF or DOC</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleContinueToForm}
              disabled={!selectedTemplate && !customTemplate}
            >
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Form Step
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setStep("template")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Resume Builder</h1>
              <p className="text-muted-foreground text-sm">
                {userType === "fresher" ? "Fresher Resume" : "Professional Resume"} • {selectedTemplate || "Custom Template"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={handleSaveResume}
              disabled={isSaving || !user}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button 
              size="sm" 
              onClick={handleExportPDF}
              disabled={isExporting || !showPreview}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1.5" />
              )}
              {isExporting ? "Exporting..." : "Download PDF"}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div ref={resumeRef} className="bg-white text-black p-8 max-w-3xl mx-auto rounded-lg shadow-lg">
            <div className="text-center border-b border-gray-200 pb-5 mb-5">
              <h2 className="text-2xl font-bold mb-1 text-gray-900">{formData.fullName || "Your Name"}</h2>
              <p className="text-gray-600 text-sm">
                {formData.email} {formData.phone && `• ${formData.phone}`}
              </p>
              {profileLinks.some(p => p.url) && (
                <div className="flex justify-center gap-3 mt-2 flex-wrap">
                  {profileLinks.filter(p => p.url).map((link) => (
                    <span key={link.id} className="text-xs text-blue-600">
                      {link.platform}: {link.url}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {formData.summary && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-gray-600 text-sm">{formData.summary}</p>
              </div>
            )}

            {formData.skills && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.split(",").map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience - only for experienced users */}
            {userType === "experienced" && experiences.some(e => e.title) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Experience</h3>
                {experiences.filter(e => e.title).map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{exp.title}</h4>
                        <p className="text-blue-600 text-sm">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">{exp.duration}</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Internships */}
            {internships.some(i => i.title) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Internships</h3>
                {internships.filter(i => i.title).map((intern) => (
                  <div key={intern.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{intern.title}</h4>
                        <p className="text-blue-600 text-sm">{intern.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">{intern.duration}</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-xs">{intern.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.some(p => p.name) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Projects</h3>
                {projects.filter(p => p.name).map((project) => (
                  <div key={project.id} className="mb-3">
                    <h4 className="font-medium text-sm text-gray-900">{project.name}</h4>
                    <p className="text-gray-600 mt-1 text-xs">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-blue-600 mt-1">Tech: {project.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.some(e => e.degree) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Education</h3>
                {education.filter(e => e.degree).map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{edu.degree}</h4>
                        <p className="text-blue-600 text-sm">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-gray-500">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certifications.some(c => c.name) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Certifications</h3>
                {certifications.filter(c => c.name).map((cert) => (
                  <div key={cert.id} className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{cert.name}</h4>
                        <p className="text-blue-600 text-sm">{cert.issuer}</p>
                      </div>
                      <span className="text-xs text-gray-500">{cert.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            {achievements.some(a => a.title) && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Achievements</h3>
                {achievements.filter(a => a.title).map((achievement) => (
                  <div key={achievement.id} className="mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                    <p className="text-gray-600 text-xs">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resume Name */}
            <div className="glass-card p-5">
              <h2 className="font-medium mb-3">Resume Name</h2>
              <Input
                placeholder="My Resume"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
              />
            </div>

            {/* Personal Info */}
            <div className="glass-card p-5">
              <h2 className="font-medium mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Profile Links */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Profile Links</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addProfileLink}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {profileLinks.map((link) => (
                  <div key={link.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {profileLinks.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeProfileLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Platform (e.g., GitHub, LinkedIn)</Label>
                        <Input
                          placeholder="GitHub"
                          value={link.platform}
                          onChange={(e) => updateProfileLink(link.id, "platform", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          placeholder="https://github.com/username"
                          value={link.url}
                          onChange={(e) => updateProfileLink(link.id, "url", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-5">
              <h2 className="font-medium mb-3">Professional Summary</h2>
              <Textarea
                placeholder="Brief summary of your professional background..."
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Skills */}
            <div className="glass-card p-5">
              <h2 className="font-medium mb-3">Skills</h2>
              <Input
                placeholder="JavaScript, React, Node.js, Python (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            {/* Experience - only for experienced users */}
            {userType === "experienced" && (
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h2 className="font-medium">Work Experience</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 bg-muted/50 rounded-lg relative">
                      {experiences.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <Label className="text-xs">Job Title</Label>
                          <Input
                            placeholder="Software Engineer"
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Company</Label>
                          <Input
                            placeholder="Tech Corp"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="Jan 2020 - Present"
                          value={exp.duration}
                          onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities..."
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          className="mt-1 min-h-[60px] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internships */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Internships</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addInternship}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {internships.map((intern) => (
                  <div key={intern.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {internships.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeInternship(intern.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          placeholder="Software Engineering Intern"
                          value={intern.title}
                          onChange={(e) => updateInternship(intern.id, "title", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Company</Label>
                        <Input
                          placeholder="Tech Startup"
                          value={intern.company}
                          onChange={(e) => updateInternship(intern.id, "company", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label className="text-xs">Duration</Label>
                      <Input
                        placeholder="Jun 2023 - Aug 2023"
                        value={intern.duration}
                        onChange={(e) => updateInternship(intern.id, "duration", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        placeholder="Describe your internship responsibilities..."
                        value={intern.description}
                        onChange={(e) => updateInternship(intern.id, "description", e.target.value)}
                        className="mt-1 min-h-[60px] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Projects</h2>
                <Button variant="outline" size="sm" onClick={addProject}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {projects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="mb-3">
                      <Label className="text-xs">Project Name</Label>
                      <Input
                        placeholder="Portfolio Website"
                        value={project.name}
                        onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        placeholder="Describe your project..."
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        className="mt-1 min-h-[60px] resize-none"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Technologies Used</Label>
                      <Input
                        placeholder="React, Node.js, MongoDB"
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Education</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Degree</Label>
                        <Input
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Institution</Label>
                        <Input
                          placeholder="University Name"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Year</Label>
                        <Input
                          placeholder="2020"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Certifications</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addCertification}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Certification Name</Label>
                        <Input
                          placeholder="AWS Solutions Architect"
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Issuing Organization</Label>
                        <Input
                          placeholder="Amazon Web Services"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Date</Label>
                        <Input
                          placeholder="Jan 2024"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Achievements</h2>
                </div>
                <Button variant="outline" size="sm" onClick={addAchievement}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {achievements.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeAchievement(achievement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="mb-3">
                      <Label className="text-xs">Achievement Title</Label>
                      <Input
                        placeholder="Dean's List"
                        value={achievement.title}
                        onChange={(e) => updateAchievement(achievement.id, "title", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        placeholder="Describe your achievement..."
                        value={achievement.description}
                        onChange={(e) => updateAchievement(achievement.id, "description", e.target.value)}
                        className="mt-1 min-h-[60px] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
