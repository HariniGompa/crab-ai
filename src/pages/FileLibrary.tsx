import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Download, Trash2, Calendar } from "lucide-react";

const files = [
  {
    id: "1",
    name: "My_Resume_v3.pdf",
    type: "Resume",
    uploadedAt: "Dec 10, 2024",
    size: "245 KB",
  },
  {
    id: "2",
    name: "Portfolio_Generated.html",
    type: "Portfolio",
    uploadedAt: "Dec 8, 2024",
    size: "128 KB",
  },
  {
    id: "3",
    name: "Resume_ATS_Optimized.pdf",
    type: "Resume",
    uploadedAt: "Dec 5, 2024",
    size: "312 KB",
  },
  {
    id: "4",
    name: "Cover_Letter_TechCorp.docx",
    type: "Cover Letter",
    uploadedAt: "Dec 3, 2024",
    size: "85 KB",
  },
];

const FileLibrary = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
            <FolderOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">File Library</h1>
            <p className="text-muted-foreground">
              Access your uploaded and generated files
            </p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              {files.length} files stored
            </p>
          </div>
          
          <div className="divide-y divide-border">
            {files.map((file) => (
              <div 
                key={file.id}
                className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{file.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                      {file.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {file.uploadedAt}
                    </span>
                    <span>{file.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {files.length === 0 && (
            <div className="p-12 text-center">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No Files Yet</h3>
              <p className="text-muted-foreground">
                Your uploaded and generated files will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FileLibrary;
