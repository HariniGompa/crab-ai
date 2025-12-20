import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Trash2, Calendar, Edit, Plus } from "lucide-react";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const FileLibrary = () => {
  const { resumes, loading, resumeCount, maxResumes, deleteResume, canCreateResume } = useResumes();
  const navigate = useNavigate();

  const handleEdit = (resumeId: string) => {
    navigate(`/resume-builder?id=${resumeId}`);
  };

  const handleDelete = async (resumeId: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      await deleteResume(resumeId);
    }
  };

  const handleCreate = () => {
    navigate("/resume-builder");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resume Library</h1>
              <p className="text-muted-foreground">
                Manage your saved resumes (max {maxResumes})
              </p>
            </div>
          </div>
          
          {canCreateResume() && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              New Resume
            </Button>
          )}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              {resumeCount} of {maxResumes} resumes stored
            </p>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading resumes...</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {resumes.map((resume) => (
                  <div 
                    key={resume.id}
                    className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{resume.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs capitalize">
                          {resume.user_type}
                        </span>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs capitalize">
                          {resume.template}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(resume.updated_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => handleEdit(resume.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {resumes.length === 0 && (
                <div className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No Resumes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first resume to get started.
                  </p>
                  <Button onClick={handleCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Resume
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FileLibrary;
