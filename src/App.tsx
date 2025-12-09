import { useEffect, useState } from 'react';
import { supabase, Profile, Project, Experience, Skill, SocialLink } from './lib/supabase';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Briefcase, Code2, MapPin, Calendar, Link as LinkIcon, Terminal, ArrowRight, User, Moon, Sun } from 'lucide-react';

const iconMap: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  link: LinkIcon,
};

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web' | 'app'>('all');
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience'>('profile');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    fetchData();
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, experienceRes, skillsRes, socialRes] = await Promise.all([
        supabase.from('profile').select('*').maybeSingle(),
        supabase.from('projects').select('*').order('display_order'),
        supabase.from('experience').select('*').order('display_order'),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('social_links').select('*').order('display_order'),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (experienceRes.data) setExperience(experienceRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (socialRes.data) setSocialLinks(socialRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const groupSkillsByCategory = () => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  };

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.project_type === selectedCategory);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <Terminal className="w-12 h-12 text-emerald-400 animate-pulse" />
          <div className="font-mono text-emerald-400">Loading...</div>
        </div>
      </div>
    );
  }

  const skillsGrouped = groupSkillsByCategory();

  return (
    <div className="h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Main Container */}
      <div className="h-screen flex flex-col relative z-10">
        {/* Header - Hidden on mobile */}
        <header className="hidden lg:block border-b border-slate-800/50 bg-black/80 backdrop-blur-xl flex-shrink-0">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <Terminal className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="font-bold text-sm md:text-lg truncate">{profile?.name || 'Portfolio'}</h1>
                <p className="text-xs text-slate-500 font-mono hidden sm:block truncate">{profile?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {socialLinks.slice(0, 4).map(link => {
                const Icon = iconMap[link.icon] || LinkIcon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 md:p-2 border border-slate-800 hover:border-emerald-400/50 rounded transition-all hover:bg-emerald-400/5"
                    title={link.platform}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 hover:text-emerald-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </header>

        {/* Content Grid - Desktop */}
        <div className="hidden lg:grid flex-1 grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6 overflow-hidden min-h-0">
          {/* Left Column - Profile & Skills */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto min-h-0">
            {/* Profile Card */}
            <div className="border border-slate-800 rounded-lg p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-3 px-2 py-1 border border-emerald-400/30 rounded inline-flex">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  Available
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {profile?.bio}
              </p>
              {profile?.location && (
                <div className="flex items-center gap-2 text-slate-500 font-mono text-xs mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-400 text-black rounded font-mono text-xs font-medium hover:bg-emerald-300 transition-all"
                >
                  <Mail className="w-3 h-3" />
                  Contact
                </a>
              )}
            </div>

            {/* Skills Card */}
            <div className="border border-slate-800 rounded-lg p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-bold font-mono text-sm">$ tech-stack --list</h2>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
                {Object.entries(skillsGrouped).map(([category, categorySkills]) => (
                  <div key={category} className="border border-slate-800/50 rounded p-3 bg-black/30">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-400 font-mono text-xs">{'>'}</span>
                      <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{category}</h3>
                    </div>
                    <div className="space-y-2">
                      {categorySkills.map(skill => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 group"
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-slate-600 font-mono text-xs">└─</span>
                            <span className="text-slate-300 font-mono text-xs group-hover:text-emerald-400 transition-colors">
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-3 rounded-sm ${
                                  i < 4
                                    ? 'bg-emerald-400'
                                    : 'bg-slate-700'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Projects */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
            <div className="border border-slate-800 rounded-lg p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="mb-4">
                <div className="font-mono text-xs text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded inline-block mb-3">
                  &lt;projects /&gt;
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-400 text-black'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    all
                  </button>
                  <button
                    onClick={() => setSelectedCategory('web')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'web'
                        ? 'bg-emerald-400 text-black'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    web
                  </button>
                  <button
                    onClick={() => setSelectedCategory('app')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'app'
                        ? 'bg-emerald-400 text-black'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    mobile
                  </button>
                  <div className="ml-auto text-slate-500 font-mono text-xs flex items-center gap-1">
                    <span>{filteredProjects.length}</span>
                    <span>projects</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="border border-slate-800 hover:border-emerald-400/30 rounded-lg overflow-hidden transition-all group"
                  >
                    {project.image_url && (
                      <div className="relative h-32 bg-slate-800">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-emerald-400/30 text-emerald-400 text-xs font-mono rounded">
                            {project.project_type}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold mb-2 text-sm group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-0.5 text-slate-500 text-xs font-mono">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-400 text-black rounded font-mono text-xs hover:bg-emerald-300 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1 border border-slate-700 hover:border-emerald-400/50 rounded font-mono text-xs text-slate-300 hover:text-emerald-400 transition-all"
                          >
                            <Github className="w-3 h-3" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-slate-500 font-mono text-xs">
                    No projects found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Experience */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            <div className="border border-slate-800 rounded-lg p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h2 className="font-bold font-mono text-sm">Experience</h2>
                <div className="ml-auto text-slate-500 font-mono text-xs">
                  {experience.length} roles
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
                {experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="border-l-2 border-emerald-400 pl-4 pb-4 last:pb-0 relative group"
                  >
                    <div className="absolute left-0 top-0 w-2 h-2 bg-emerald-400 rounded-full -translate-x-[5px] group-hover:scale-150 transition-transform"></div>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
                    <div className="text-emerald-400 font-mono text-xs mb-2">
                      {exp.company}
                    </div>
                    <div className="text-slate-500 text-xs font-mono mb-2">
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab View */}
        <div className="lg:hidden flex-1 overflow-hidden min-h-0 pb-20">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="h-full flex flex-col">
                {/* Sticky Header Section */}
                <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-mono text-xs px-2 py-1 border border-emerald-500/30 dark:border-emerald-400/30 rounded-full bg-emerald-500/5 dark:bg-emerald-400/5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></div>
                      Available
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>

                  <h1 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{profile?.name}</h1>
                  <p className="text-emerald-500 dark:text-emerald-400 font-mono text-xs">{profile?.title}</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Bio and Contact Card */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                      {profile?.bio}
                    </p>

                    {profile?.location && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs mb-6 px-3 py-2 bg-slate-100 dark:bg-black/30 rounded-lg border border-slate-200 dark:border-slate-800/50">
                        <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    {profile?.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 dark:bg-emerald-400 text-white dark:text-black rounded-lg font-mono text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Mail className="w-4 h-4" />
                        Get in touch
                      </a>
                    )}
                  </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <LinkIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <h2 className="font-bold font-mono text-sm text-slate-900 dark:text-white">Connect</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {socialLinks.map(link => {
                        const Icon = iconMap[link.icon] || LinkIcon;
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 rounded-lg bg-slate-100 dark:bg-black/30 hover:bg-emerald-500/5 dark:hover:bg-emerald-400/5 transition-all group"
                          >
                            <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate block">
                                {link.platform}
                              </span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50 backdrop-blur-sm text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{projects.length}</div>
                      <div className="text-xs font-mono text-slate-500">Projects</div>
                    </div>
                    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50 backdrop-blur-sm text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{skills.length}</div>
                      <div className="text-xs font-mono text-slate-500">Skills</div>
                    </div>
                    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/50 backdrop-blur-sm text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{experience.length}</div>
                      <div className="text-xs font-mono text-slate-500">Roles</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="h-full flex flex-col">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-2.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded-lg">
                      <Code2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold font-mono text-sm text-slate-900 dark:text-white">projects</h2>
                    </div>
                    <div className="px-1.5 py-0.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded font-mono text-xs text-emerald-500 dark:text-emerald-400">
                      {filteredProjects.length}
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    all
                  </button>
                  <button
                    onClick={() => setSelectedCategory('web')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'web'
                        ? 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    web
                  </button>
                  <button
                    onClick={() => setSelectedCategory('app')}
                    className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                      selectedCategory === 'app'
                        ? 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    mobile
                  </button>
                </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 rounded-lg overflow-hidden transition-all group"
                    >
                      {project.image_url && (
                        <div className="relative h-32 bg-slate-200 dark:bg-slate-800">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-slate-900 via-white/40 dark:via-slate-900/40 to-transparent"></div>
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-emerald-500/30 dark:border-emerald-400/30 text-emerald-500 dark:text-emerald-400 text-xs font-mono rounded">
                              {project.project_type}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold mb-2 text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono rounded border border-slate-300 dark:border-slate-700"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-0.5 text-slate-400 dark:text-slate-500 text-xs font-mono">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-500 dark:bg-emerald-400 text-white dark:text-black rounded font-mono text-xs hover:bg-emerald-600 dark:hover:bg-emerald-300 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Demo
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 border border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 rounded font-mono text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                            >
                              <Github className="w-3 h-3" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 font-mono text-xs">
                      No projects found
                    </div>
                  )}
                </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="h-full flex flex-col">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded-lg">
                      <Terminal className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold font-mono text-sm text-slate-900 dark:text-white">tech-stack</h2>
                    </div>
                    <div className="px-1.5 py-0.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded font-mono text-xs text-emerald-500 dark:text-emerald-400">
                      {skills.length}
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(skillsGrouped).map(([category, categorySkills]) => (
                  <div key={category} className="border border-slate-200 dark:border-slate-800/50 rounded p-3 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-500 dark:text-emerald-400 font-mono text-xs">{'>'}</span>
                      <h3 className="text-xs font-mono text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">{category}</h3>
                    </div>
                    <div className="space-y-2">
                      {categorySkills.map(skill => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-2 group"
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-slate-300 dark:text-slate-600 font-mono text-xs">└─</span>
                            <span className="text-slate-700 dark:text-slate-300 font-mono text-xs group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-3 rounded-sm ${
                                  i < 4
                                    ? 'bg-emerald-500 dark:bg-emerald-400'
                                    : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="h-full flex flex-col">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded-lg">
                      <Briefcase className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold font-mono text-sm text-slate-900 dark:text-white">experience</h2>
                    </div>
                    <div className="px-1.5 py-0.5 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/30 rounded font-mono text-xs text-emerald-500 dark:text-emerald-400">
                      {experience.length}
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-4 pb-4 last:pb-0 relative group"
                  >
                    <div className="absolute left-0 top-0 w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full -translate-x-[5px] group-hover:scale-150 transition-transform"></div>
                    <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
                    <div className="text-emerald-500 dark:text-emerald-400 font-mono text-xs mb-2">
                      {exp.company}
                    </div>
                    <div className="text-slate-400 dark:text-slate-500 text-xs font-mono mb-2">
                      {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
                </div>
              </div>
            )}
        </div>

        {/* Mobile Bottom Tab Navigation */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
          <div className="grid grid-cols-4 h-14 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-400/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all rounded-l-2xl relative ${
                activeTab === 'profile'
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-mono">profile</span>
              {activeTab === 'profile' && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                activeTab === 'projects'
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Code2 className="w-5 h-5" />
              <span className="text-[10px] font-mono">projects</span>
              {activeTab === 'projects' && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                activeTab === 'skills'
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Terminal className="w-5 h-5" />
              <span className="text-[10px] font-mono">skills</span>
              {activeTab === 'skills' && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all rounded-r-2xl relative ${
                activeTab === 'experience'
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px] font-mono">work</span>
              {activeTab === 'experience' && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="hidden lg:block border-t border-slate-800/50 px-6 py-3 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>&copy; {new Date().getFullYear()} {profile?.name}</span>
            <span>Built with React + Supabase</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
