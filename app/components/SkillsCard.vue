<script setup lang="ts">
import { computed } from "vue";

interface Skill {
  id: string;
  name: string;
  category: string;
  [key: string]: any;
}

const props = defineProps<{
  skills: Skill[];
}>();

const categoryOrder = [
  "Frontend",
  "Backend",
  "Mobile",
  "Database",
  "Testing",
  "DevOps",
  "API & Data",
  "Methodologies",
];

const groupedSkills = computed(() => {
  const groups = props.skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Return sorted according to categoryOrder
  const sorted: Record<string, Skill[]> = {};
  for (const cat of categoryOrder) {
    if (groups[cat]) {
      sorted[cat] = groups[cat];
    }
  }
  // Any extra categories not in categoryOrder
  for (const cat of Object.keys(groups)) {
    if (!sorted[cat]) {
      sorted[cat] = groups[cat];
    }
  }
  return sorted;
});

// Icon Mapping Helper
const getIcon = (name: string) => {
  const map: Record<string, string> = {
    // Frontend
    JavaScript: "logos:javascript",
    TypeScript: "logos:typescript-icon",
    React: "logos:react",
    "Next.js": "logos:nextjs-icon",
    NextJS: "logos:nextjs-icon",
    Nuxt: "logos:nuxt-icon",
    "Vue.js": "logos:vue",
    Vue: "logos:vue",
    "Tailwind CSS": "logos:tailwindcss-icon",
    TailwindCSS: "logos:tailwindcss-icon",
    HTML: "logos:html-5",
    CSS: "logos:css-3",

    // Backend
    "Node.js": "logos:nodejs-icon",
    NodeJS: "logos:nodejs-icon",
    "C#": "logos:c-sharp",
    ".NET": "logos:dotnet",
    Python: "logos:python",
    Rust: "logos:rust",
    PHP: "logos:php",
    Laravel: "logos:laravel",
    CodeIgniter: "logos:codeigniter-icon",

    // Mobile
    "React Native": "logos:react",
    Swift: "logos:swift",
    Kotlin: "logos:kotlin-icon",
    "Android Java": "logos:android-icon",
    "Objective-C": "logos:apple",

    // Database
    PostgreSQL: "logos:postgresql",
    MySQL: "logos:mysql-icon",
    MSSQL: "simple-icons:microsoftsqlserver",
    SQLite: "simple-icons:sqlite",
    MongoDB: "logos:mongodb-icon",
    CouchDB: "simple-icons:apachecouchdb",
    Prisma: "simple-icons:prisma",
    NHibernate: "lucide:database",
    TypeORM: "simple-icons:typeorm",
    Drizzle: "simple-icons:drizzle",

    // Testing
    Jest: "logos:jest",
    xUnit: "lucide:flask-conical",
    Detox: "lucide:shield-check",
    Maestro: "lucide:play-circle",
    Selenium: "logos:selenium",
    Katalon: "lucide:check-check",

    // DevOps
    Docker: "logos:docker-icon",
    Git: "logos:git-icon",
    "Github Actions CI/CD": "logos:github-actions",
    "Azure DevOps": "logos:azure-icon",
    AWS: "logos:aws",
    Cloudflare: "logos:cloudflare-icon",
    Vercel: "logos:vercel-icon",
    "Linux Bash": "logos:bash-icon",

    // API & Data
    "RESTful API": "lucide:arrow-left-right",
    GraphQL: "logos:graphql",
    JSON: "simple-icons:json",
    Markdown: "simple-icons:markdown",

    // Methodologies
    Agile: "lucide:refresh-cw",
    Scrum: "lucide:users",
    TDD: "lucide:test-tube-2",
    "Clean Code": "lucide:sparkles",
    "Design Patterns": "lucide:boxes",
  };
  return map[name] || "lucide:code-2";
};

const getIconClass = (name: string) => {
  const needsInvert = ["Rust", "Prisma", "Vercel", "Objective-C", "JSON", "Markdown", "Next.js", "NextJS"];
  if (needsInvert.includes(name)) {
    return "dark:invert";
  }
  return "";
};

const getCategoryMeta = (category: string) => {
  const map: Record<string, { icon: string; text: string; bg: string; border: string }> = {
    Frontend: {
      icon: "lucide:layout",
      text: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-950/50",
      border: "border-cyan-200/60 dark:border-cyan-800/50",
    },
    Backend: {
      icon: "lucide:server",
      text: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      border: "border-indigo-200/60 dark:border-indigo-800/50",
    },
    Mobile: {
      icon: "lucide:smartphone",
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
      border: "border-purple-200/60 dark:border-purple-800/50",
    },
    Database: {
      icon: "lucide:database",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      border: "border-emerald-200/60 dark:border-emerald-800/50",
    },
    Testing: {
      icon: "lucide:flask-conical",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
      border: "border-amber-200/60 dark:border-amber-800/50",
    },
    DevOps: {
      icon: "lucide:container",
      text: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/50",
      border: "border-sky-200/60 dark:border-sky-800/50",
    },
    "API & Data": {
      icon: "lucide:network",
      text: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-950/50",
      border: "border-pink-200/60 dark:border-pink-800/50",
    },
    Methodologies: {
      icon: "lucide:sparkles",
      text: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/50",
      border: "border-teal-200/60 dark:border-teal-800/50",
    },
  };
  return map[category] || {
    icon: "lucide:layers",
    text: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/50",
    border: "border-teal-200/60 dark:border-teal-800/50",
  };
};
</script>

<template>
  <div
    class="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-xs flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100 dark:border-slate-800/80">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Icon name="lucide:cpu" class="w-3.5 h-3.5" />
        </div>
        <h2 class="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
          Skills & Technologies
        </h2>
      </div>

      <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
        {{ skills.length }} skills
      </span>
    </div>

    <!-- Grouped Skills in a Responsive Grid for the Wide Card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-start">
      <div
        v-for="(categorySkills, category) in groupedSkills"
        :key="category"
        class="h-full p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/80 transition-all flex flex-col justify-start gap-2.5">
        
        <!-- Category Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="w-6 h-6 rounded-md flex items-center justify-center border text-xs"
              :class="[getCategoryMeta(String(category)).bg, getCategoryMeta(String(category)).text, getCategoryMeta(String(category)).border]">
              <Icon :name="getCategoryMeta(String(category)).icon" class="w-3.5 h-3.5" />
            </span>
            <h3 class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {{ category }}
            </h3>
          </div>
          <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
            {{ categorySkills.length }}
          </span>
        </div>

        <!-- Skills Chips (Top-aligned) -->
        <div class="flex flex-wrap gap-1.5 content-start items-start">
          <div
            v-for="skill in categorySkills"
            :key="skill.id"
            class="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-2xs transition-all duration-200 select-none cursor-default">
            
            <!-- Skill Logo/Icon -->
            <Icon
              :name="getIcon(skill.name)"
              class="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110"
              :class="getIconClass(skill.name)"
            />

            <!-- Skill Name -->
            <span class="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
