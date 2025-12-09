/*
  # Personal Branding Website Schema

  1. New Tables
    - `profile`
      - `id` (uuid, primary key)
      - `name` (text) - Full name
      - `title` (text) - Professional title/tagline
      - `bio` (text) - Brief bio/introduction
      - `email` (text) - Contact email
      - `location` (text) - Current location
      - `avatar_url` (text) - Profile picture URL
      - `resume_url` (text) - Link to full resume/CV
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text) - Project name
      - `description` (text) - Project description
      - `image_url` (text) - Project screenshot/image
      - `project_type` (text) - 'web' or 'app'
      - `technologies` (text[]) - Array of technologies used
      - `demo_url` (text) - Live demo link
      - `github_url` (text) - GitHub repository link
      - `featured` (boolean) - Whether to feature prominently
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
    
    - `experience`
      - `id` (uuid, primary key)
      - `company` (text) - Company name
      - `role` (text) - Job title/role
      - `start_date` (date) - Start date
      - `end_date` (date) - End date (null if current)
      - `description` (text) - Job description/achievements
      - `location` (text) - Work location
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text) - Skill name
      - `category` (text) - Skill category (e.g., 'Frontend', 'Backend', 'Tools')
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
    
    - `social_links`
      - `id` (uuid, primary key)
      - `platform` (text) - Platform name (e.g., 'GitHub', 'LinkedIn')
      - `url` (text) - Profile URL
      - `icon` (text) - Icon identifier for lucide-react
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for all tables (portfolio is public)
    - No write policies needed (data managed separately)
*/

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  resume_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  project_type text NOT NULL DEFAULT 'web',
  technologies text[] DEFAULT '{}',
  demo_url text DEFAULT '',
  github_url text DEFAULT '',
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text NOT NULL DEFAULT '',
  location text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL DEFAULT 'link',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio is publicly viewable)
CREATE POLICY "Anyone can view profile"
  ON profile FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view experience"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view social links"
  ON social_links FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample data
INSERT INTO profile (name, title, bio, email, location) VALUES (
  'Your Name',
  'Full Stack Developer & Designer',
  'Passionate developer with expertise in creating beautiful, functional web applications and mobile apps. I love turning ideas into reality through clean code and intuitive design.',
  'your.email@example.com',
  'San Francisco, CA'
);

INSERT INTO projects (title, description, image_url, project_type, technologies, demo_url, github_url, featured, display_order) VALUES
  (
    'E-Commerce Platform',
    'A modern e-commerce platform with real-time inventory management, payment processing, and customer analytics.',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    'web',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    'https://example.com',
    'https://github.com',
    true,
    1
  ),
  (
    'Task Management App',
    'Cross-platform mobile app for team collaboration and project management with real-time sync.',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    'app',
    ARRAY['React Native', 'Firebase', 'TypeScript'],
    'https://example.com',
    'https://github.com',
    true,
    2
  ),
  (
    'Portfolio CMS',
    'Content management system designed specifically for creative professionals to showcase their work.',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    'web',
    ARRAY['Vue.js', 'Express', 'MongoDB'],
    'https://example.com',
    'https://github.com',
    false,
    3
  ),
  (
    'Fitness Tracker',
    'Mobile app for tracking workouts, nutrition, and health metrics with AI-powered recommendations.',
    'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg',
    'app',
    ARRAY['Flutter', 'Python', 'TensorFlow'],
    'https://example.com',
    'https://github.com',
    false,
    4
  );

INSERT INTO experience (company, role, start_date, end_date, description, location, display_order) VALUES
  (
    'Tech Innovations Inc.',
    'Senior Full Stack Developer',
    '2022-01-01',
    NULL,
    'Leading development of customer-facing web applications. Architected and implemented microservices infrastructure that improved system reliability by 40%.',
    'San Francisco, CA',
    1
  ),
  (
    'Digital Solutions Co.',
    'Full Stack Developer',
    '2020-03-01',
    '2021-12-31',
    'Developed and maintained multiple client projects using modern web technologies. Collaborated with design team to create responsive, user-friendly interfaces.',
    'Remote',
    2
  ),
  (
    'StartUp Labs',
    'Junior Developer',
    '2018-06-01',
    '2020-02-28',
    'Built features for SaaS platform serving 10k+ users. Participated in agile development process and code reviews.',
    'New York, NY',
    3
  );

INSERT INTO skills (name, category, display_order) VALUES
  ('React', 'Frontend', 1),
  ('TypeScript', 'Frontend', 2),
  ('Vue.js', 'Frontend', 3),
  ('Tailwind CSS', 'Frontend', 4),
  ('Node.js', 'Backend', 5),
  ('Python', 'Backend', 6),
  ('PostgreSQL', 'Backend', 7),
  ('MongoDB', 'Backend', 8),
  ('React Native', 'Mobile', 9),
  ('Flutter', 'Mobile', 10),
  ('Git', 'Tools', 11),
  ('Docker', 'Tools', 12);

INSERT INTO social_links (platform, url, icon, display_order) VALUES
  ('GitHub', 'https://github.com/yourusername', 'github', 1),
  ('LinkedIn', 'https://linkedin.com/in/yourusername', 'linkedin', 2),
  ('Twitter', 'https://twitter.com/yourusername', 'twitter', 3),
  ('Email', 'mailto:your.email@example.com', 'mail', 4);