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

const groupedSkills = computed(() => {
  return props.skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
});

// Icon Mapping Helper
const getIcon = (name: string) => {
  const map: Record<string, string> = {
    // Languages
    JavaScript: "logos:javascript",
    TypeScript: "logos:typescript-icon",
    Python: "logos:python",
    "C#": "logos:c-sharp",
    PHP: "simple-icons:php",
    Rust: "logos:rust",
    Go: "logos:go",
    Swift: "logos:swift",
    Kotlin: "logos:kotlin-icon",
    "Objective-C": "logos:c",
    "Android Java": "logos:java",
    "Linux Bash": "logos:bash-icon",
    // Frontend
    "Vue.js": "logos:vue",
    Vue: "logos:vue",
    React: "logos:react",
    "React Native": "logos:react",
    "Next.js": "logos:nextjs-icon",
    NextJS: "logos:nextjs-icon",
    Nuxt: "simple-icons:nuxt",
    SvelteKit: "logos:svelte-icon",
    "Tailwind CSS": "simple-icons:tailwindcss",
    TailwindCSS: "simple-icons:tailwindcss",
    HTML: "logos:html-5",
    CSS: "logos:css-3",
    // Backend
    "Node.js": "logos:nodejs-icon",
    NodeJS: "logos:nodejs-icon",
    ".NET": "logos:dotnet",
    Laravel: "logos:laravel",
    CodeIgniter: "simple-icons:codeigniter",
    // Database
    PostgreSQL: "logos:postgresql",
    MongoDB: "logos:mongodb-icon",
    MySQL: "logos:mysql",
    MSSQL: "simple-icons:microsoftsqlserver",
    SQLite: "logos:sqlite",
    CouchDB: "logos:couchdb",
    Prisma: "simple-icons:prisma",
    NHibernate: "simple-icons:hibernate",
    TypeORM: "simple-icons:typeorm",
    Drizzle: "simple-icons:drizzle",
    // Testing
    Jest: "logos:jest",
    xUnit: "lucide:flask-conical",
    Detox: "lucide:shield-check",
    Maestro: "logos:maestro",
    Selenium: "logos:selenium",
    Katalon: "logos:katalon",
    // DevOps
    Docker: "logos:docker-icon",
    Kubernetes: "logos:kubernetes",
    AWS: "logos:aws",
    "Azure DevOps": "logos:azure-icon",
    "Github Actions CI/CD": "logos:github-actions",
    AppCenter: "simple-icons:visualstudioappcenter",
    Cloudflare: "simple-icons:cloudflare",
    Vercel: "logos:vercel-icon",
    Git: "logos:git-icon",
    // API & Data
    "RESTful API": "lucide:arrow-left-right",
    GraphQL: "logos:graphql",
    JSON: "logos:json",
    Markdown: "logos:markdown",
    // Methodologies
    Agile: "lucide:refresh-cw",
    Scrum: "lucide:users",
    TDD: "lucide:test-tube-2",
    "Clean Code": "lucide:sparkles",
    "Design Patterns": "lucide:boxes",
  };
  return map[name] || "lucide:code-2";
};

const getCategoryIcon = (category: string) => {
  const map: Record<string, string> = {
    Languages: "lucide:code-2",
    Frontend: "lucide:layout",
    Backend: "lucide:server",
    Database: "lucide:database",
    DevOps: "lucide:container",
    Testing: "lucide:flask-conical",
    "API & Data": "lucide:network",
    Methodologies: "lucide:sparkles",
    Tools: "lucide:wrench",
  };
  return map[category] || "lucide:layers";
};
</script>

<template>
  <div
    class="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Icon name="lucide:cpu" class="w-4 h-4" />
        </div>
        <div>
          <h2 class="font-bold text-base text-slate-900 dark:text-white tracking-tight">
            Skills & Technologies
          </h2>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-mono">
            Categorized technical stack & proficiencies
          </p>
        </div>
      </div>

      <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 font-medium">
        {{ skills.length }} skills
      </span>
    </div>

    <!-- Grouped Skills in a Responsive Grid for the Wide Card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
      <div
        v-for="(categorySkills, category, index) in groupedSkills"
        :key="category"
        class="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        
        <!-- Category Header -->
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <Icon :name="getCategoryIcon(String(category))" class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <h3 class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {{ category }}
            </h3>
          </div>
          <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {{ categorySkills.length }}
          </span>
        </div>

        <!-- Skills Chips -->
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="skill in categorySkills"
            :key="skill.id"
            class="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-500/50 dark:hover:border-teal-400/50 hover:shadow-2xs transition-all duration-200 select-none cursor-default">
            
            <!-- Skill Logo/Icon -->
            <Icon
              :name="getIcon(skill.name)"
              class="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110"
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
