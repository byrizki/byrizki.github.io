import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  avatar_url?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  project_type: 'web' | 'app';
  technologies: string[];
  demo_url?: string;
  github_url?: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
  location?: string;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  created_at: string;
}
