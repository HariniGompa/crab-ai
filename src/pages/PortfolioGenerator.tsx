import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layout, Download, ExternalLink, Check } from "lucide-react";

const sections = [
  { id: "about", label: "About Me", default: true },
  { id: "skills", label: "Skills", default: true },
  { id: "experience", label: "Work Experience", default: true },
  { id: "projects", label: "Projects", default: true },
  { id: "education", label: "Education", default: true },
  { id: "contact", label: "Contact", default: true },
];

const PortfolioGenerator = () => {
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, s) => ({ ...acc, [s.id]: s.default }), {})
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);

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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl coral-gradient flex items-center justify-center">
            <Layout className="w-7 h-7 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Portfolio Generator</h1>
            <p className="text-muted-foreground">
              Generate a beautiful HTML portfolio
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Select Sections</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choose which sections to include in your portfolio
              </p>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <Label htmlFor={section.id} className="cursor-pointer font-medium">
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

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating || !Object.values(selectedSections).some(Boolean)}
            >
              {isGenerating ? "Generating..." : "Generate Portfolio"}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-medium">Portfolio Preview</span>
              {portfolioGenerated && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="default" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 p-4 overflow-hidden">
              {portfolioGenerated ? (
                <div className="bg-card rounded-lg shadow-lg h-full overflow-hidden animate-scale-in">
                  {/* Mini portfolio mockup */}
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 ocean-gradient text-primary-foreground">
                      <div className="w-16 h-16 rounded-full bg-card/20 mx-auto mb-2" />
                      <div className="h-4 w-24 bg-card/30 rounded mx-auto mb-1" />
                      <div className="h-3 w-32 bg-card/20 rounded mx-auto" />
                    </div>
                    
                    {/* Sections */}
                    <div className="flex-1 p-4 space-y-3">
                      {Object.entries(selectedSections)
                        .filter(([_, enabled]) => enabled)
                        .slice(0, 4)
                        .map(([id]) => (
                          <div key={id} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <div className="h-3 w-full bg-muted rounded" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Layout className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No Preview Yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Select sections and generate to see preview
                    </p>
                  </div>
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
