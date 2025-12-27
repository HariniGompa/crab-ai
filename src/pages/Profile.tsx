import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  FolderOpen,
  FileText,
  Trash2,
  Calendar,
  Edit,
  Loader2,
  Globe,
  Eye,
  X,
  Pencil,
} from "lucide-react";
import { useResumes } from "@/hooks/useResumes";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { resumes, loading, resumeCount, maxResumes, deleteResume } =
    useResumes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");

  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Portfolio file state (UI-only, single file - stores bot-generated portfolio)
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioFileName, setPortfolioFileName] = useState<string | null>(null);

  const handleViewPortfolio = () => {
    if (portfolioFile) {
      const url = URL.createObjectURL(portfolioFile);
      window.open(url, '_blank');
    }
  };

  const handleRemovePortfolio = () => {
    setPortfolioFile(null);
    setPortfolioFileName(null);
    toast({ title: "Portfolio removed" });
  };

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.display_name) {
          setDisplayName(data.display_name);
          setOriginalName(data.display_name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const isDirty = displayName.trim() !== originalName;

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    if (!user || !isDirty || !displayName.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setOriginalName(displayName.trim());
      setIsEditing(false);

      toast({ title: "Profile updated" });
    } catch {
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- RESUME ACTIONS ---------------- */
  const handleEdit = (resumeId: string) => {
    navigate(`/resume-builder?id=${resumeId}`);
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Delete this resume permanently?")) return;

    setDeletingId(resumeId);
    try {
      await deleteResume(resumeId);
      toast({ title: "Resume deleted" });
    } catch {
      toast({
        title: "Failed to delete resume",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl ocean-gradient flex items-center justify-center">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings
            </p>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Personal Information</h2>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {profileLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Display Name</Label>
                {isEditing ? (
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                ) : (
                  <p className="text-sm py-2 px-3 bg-muted/40 rounded-md">
                    {displayName || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    disabled
                    value={user?.email || ""}
                    className="pl-10"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="hero"
                    size="sm"
                    disabled={saving || !isDirty}
                    onClick={handleSave}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDisplayName(originalName);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RESUME LIBRARY */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-primary" />
              <div>
                <h2 className="font-semibold">
                  Resume Library
                </h2>
                <p className="text-sm text-muted-foreground">
                  {resumeCount} of {maxResumes} resumes stored
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              Loading resumes…
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-6 text-center">
              No resumes yet
            </div>
          ) : (
            <div className="divide-y">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-4 flex items-center gap-4"
                >
                  <FileText className="text-primary" />

                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">
                      {resume.name}
                    </p>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span>{resume.template}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(
                          new Date(resume.updated_at),
                          "PP"
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={loading}
                    aria-label="Edit resume"
                    onClick={() =>
                      handleEdit(resume.id)
                    }
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      deletingId === resume.id
                    }
                    aria-label="Delete resume"
                    onClick={() =>
                      handleDelete(resume.id)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PORTFOLIO FILE SECTION */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Globe className="text-primary" />
              <div>
                <h2 className="font-semibold">Portfolio File</h2>
                <p className="text-sm text-muted-foreground">
                  Generated portfolios from Portfolio Generator bot
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {portfolioFileName ? (
              <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{portfolioFileName}</p>
                    <p className="text-xs text-muted-foreground">HTML Portfolio</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleViewPortfolio}
                    aria-label="View portfolio"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemovePortfolio}
                    aria-label="Remove portfolio"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-lg p-6 text-center">
                <Globe className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-sm mb-1">No Portfolio Generated</p>
                <p className="text-xs text-muted-foreground">
                  Use the Portfolio Generator bot to create your portfolio
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">
            Account Actions
          </h2>

          <Button variant="outline" disabled>
            Change Password (Coming soon)
          </Button>

          <Button
            variant="outline"
            disabled
            className="text-destructive"
          >
            Delete Account (Contact support)
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
