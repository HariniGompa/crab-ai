import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Resume {
  id: string;
  user_id: string;
  name: string;
  user_type: 'fresher' | 'experienced';
  template: string;
  form_data: {
    fullName?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills?: string;
  };
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
  }>;
  profile_links: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  internships: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  created_at: string;
  updated_at: string;
}

const MAX_RESUMES = 3;

export const useResumes = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeCount, setResumeCount] = useState(0);

  const fetchResumes = async () => {
    if (!user) {
      setResumes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Type-cast the data since we know the structure
      const typedData = (data || []).map((item: Record<string, unknown>) => ({
        ...item,
        form_data: item.form_data as Resume['form_data'],
        experiences: item.experiences as Resume['experiences'],
        education: item.education as Resume['education'],
        projects: item.projects as Resume['projects'],
        profile_links: item.profile_links as Resume['profile_links'],
        achievements: item.achievements as Resume['achievements'],
        certifications: item.certifications as Resume['certifications'],
        internships: item.internships as Resume['internships'],
      })) as Resume[];
      
      setResumes(typedData);
      setResumeCount(typedData.length);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [user]);

  const canCreateResume = () => resumeCount < MAX_RESUMES;

  const createResume = async (resumeData: Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return null;
    }

    if (!canCreateResume()) {
      toast.error(`Maximum of ${MAX_RESUMES} resumes allowed. Please delete an existing resume first.`);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          name: resumeData.name,
          user_type: resumeData.user_type,
          template: resumeData.template,
          form_data: resumeData.form_data,
          experiences: resumeData.experiences,
          education: resumeData.education,
          projects: resumeData.projects,
          profile_links: resumeData.profile_links,
          achievements: resumeData.achievements,
          certifications: resumeData.certifications,
          internships: resumeData.internships,
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('Maximum of 3 resumes')) {
          toast.error(`Maximum of ${MAX_RESUMES} resumes allowed. Please delete an existing resume first.`);
        } else {
          throw error;
        }
        return null;
      }

      await fetchResumes();
      toast.success('Resume saved successfully!');
      return data;
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to save resume');
      return null;
    }
  };

  const updateResume = async (id: string, resumeData: Partial<Resume>) => {
    if (!user) {
      toast.error('Please sign in to update your resume');
      return false;
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          name: resumeData.name,
          form_data: resumeData.form_data,
          experiences: resumeData.experiences,
          education: resumeData.education,
          projects: resumeData.projects,
          profile_links: resumeData.profile_links,
          achievements: resumeData.achievements,
          certifications: resumeData.certifications,
          internships: resumeData.internships,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchResumes();
      toast.success('Resume updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to update resume');
      return false;
    }
  };

  const deleteResume = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete your resume');
      return false;
    }

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchResumes();
      toast.success('Resume deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
      return false;
    }
  };

  return {
    resumes,
    loading,
    resumeCount,
    maxResumes: MAX_RESUMES,
    canCreateResume,
    createResume,
    updateResume,
    deleteResume,
    refetch: fetchResumes,
  };
};
