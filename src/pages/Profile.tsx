import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Camera,
  FolderOpen,
  FileText,
  Trash2,
  Calendar,
  Edit,
  Loader2,
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const isDirty =
    displayName.trim().length > 0 &&
    displayName.trim() !== originalName;

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    if (!user || !isDirty) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName.trim() })
        .eq("user_id", user.id);

      if (error) throw error;

      setOriginalName(displayName.trim());
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

  /* ---------------- AVATAR UPLOAD ---------------- */
  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large (max 2MB)",
        variant: "destructive",
      });
      return;
    }

    setAvatarUploading(true);
    const filePath = `${user.id}/avatar.png`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("user_id", user.id);

      toast({ title: "Avatar updated" });
    } catch {
      toast({
        title: "Avatar upload failed",
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
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

        {/* AVATAR */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                id="avatar-upload"
                onChange={(e) =>
                  e.target.files &&
                  handleAvatarUpload(e.target.files[0])
                }
              />

              <button
                aria-label="Upload avatar"
                disabled={avatarUploading}
                onClick={() =>
                  document
                    .getElementById("avatar-upload")
                    ?.click()
                }
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow"
              >
                {avatarUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4">
            Personal Information
          </h2>

          {profileLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                />
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

        {/* SAVE */}
        <Button
          variant="hero"
          size="lg"
          disabled={saving || !isDirty}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
