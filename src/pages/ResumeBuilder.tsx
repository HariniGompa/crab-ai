import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileEdit, Plus, Trash2, Download, Eye } from "lucide-react";

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

const ResumeBuilder = () => {
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

  const [showPreview, setShowPreview] = useState(false);

  const addExperience = () => {
    setExperiences([...experiences, { 
      id: Date.now().toString(), 
      title: "", 
      company: "", 
      duration: "", 
      description: "" 
    }]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(e => e.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const addEducation = () => {
    setEducation([...education, { 
      id: Date.now().toString(), 
      degree: "", 
      institution: "", 
      year: "" 
    }]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(e => e.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
              <FileEdit className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <p className="text-muted-foreground">
                Create a professional resume
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button variant="hero">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <div className="text-center border-b border-border pb-6 mb-6">
              <h2 className="text-3xl font-bold mb-2">{formData.fullName || "Your Name"}</h2>
              <p className="text-muted-foreground">
                {formData.email} {formData.phone && `• ${formData.phone}`}
              </p>
            </div>

            {formData.summary && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 gradient-text">Summary</h3>
                <p className="text-muted-foreground">{formData.summary}</p>
              </div>
            )}

            {formData.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 gradient-text">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(",").map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-muted rounded-lg text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 gradient-text">Experience</h3>
              {experiences.filter(e => e.title).map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{exp.duration}</span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 gradient-text">Education</h3>
              {education.filter(e => e.degree).map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-primary">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Professional Summary</h2>
              <Textarea
                placeholder="Brief summary of your professional background..."
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            {/* Skills */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Skills</h2>
              <Input
                placeholder="JavaScript, React, Node.js, Python (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            {/* Experience */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Work Experience</h2>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          placeholder="Software Engineer"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="Tech Corp"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Duration</Label>
                      <Input
                        placeholder="Jan 2020 - Present"
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Education</h2>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-muted/50 rounded-lg relative">
                    {education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          placeholder="University Name"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          placeholder="2020"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                        />
                      </div>
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
