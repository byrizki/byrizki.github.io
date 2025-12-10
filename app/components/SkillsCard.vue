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
    "Objective-C": "vscode-icons:file-type-objectivec",
    "Android Java": "logos:java",
    "Linux Bash": "logos:bash-icon",
    // Frontend
    "Vue.js": "logos:vue",
    React: "logos:react",
    "React Native": "logos:react",
    "Next.js": "logos:nextjs-icon",
    "Nuxt": "simple-icons:nuxt",
    SvelteKit: "logos:svelte-icon",
    "Tailwind CSS": "simple-icons:tailwindcss",
    HTML: "logos:html-5",
    CSS: "logos:css-3",
    // Backend
    "Node.js": "logos:nodejs-icon",
    ".NET": "logos:dotnet",
    Laravel: "logos:laravel",
    CodeIgniter: "simple-icons:codeigniter",
    // Database
    PostgreSQL: "logos:postgresql",
    MongoDB: "logos:mongodb-icon",
    MySQL: "logos:mysql",
    MSSQL: "logos:microsoft-sql-server",
    SQLite: "logos:sqlite",
    CouchDB: "simple-icons:couchdb",
    Prisma: "simple-icons:prisma",
    NHibernate: "simple-icons:hibernate",
    TypeORM: "simple-icons:typeorm",
    Drizzle: "simple-icons:drizzle", // Note: Might need fallback if not in common sets
    // Testing
    Jest: "logos:jest",
    xUnit: "simple-icons:xunit",
    Detox: "logos:detox",
    Maestro: "simple-icons:maestro",
    Selenium: "logos:selenium",
    Katalon: "simple-icons:katalon",
    // DevOps
    Docker: "logos:docker-icon",
    Kubernetes: "logos:kubernetes",
    AWS: "logos:aws",
    "Azure DevOps": "logos:azure-icon",
    "Github Actions CI/CD": "logos:github-actions",
    AppCenter: "logos:visual-studio-app-center",
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

// Category Icon Mapping
const getCategoryIcon = (category: string) => {
  const map: Record<string, string> = {
    Languages: "lucide:languages",
    Frontend: "lucide:layout-template",
    Backend: "lucide:server",
    Database: "lucide:database",
    DevOps: "lucide:container",
    Tools: "lucide:wrench",
  };
  return map[category] || "lucide:folder";
};
</script>

<template>
  <div
    class="lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl p-0 lg:p-4 lg:bg-white lg:dark:bg-slate-900/50 lg:backdrop-blur-sm flex-1 flex flex-col h-auto min-h-0">
    <div class="items-center justify-between mb-4 shrink-0 px-4 lg:px-0 hidden lg:flex">
      <div class="flex items-center gap-2">
        <Icon name="lucide:cpu" class="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <h2 class="font-mono text-sm text-slate-900 dark:text-white">
          skills
        </h2>
      </div>
    </div>

    <div
      class="lg:flex-1 w-full lg:overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 space-y-4 px-4 lg:px-0 pb-4 lg:pb-0 lg:pr-2 lg:-mr-2">
      <div v-for="(categorySkills, category, index) in groupedSkills" :key="category"
        class="animate-slide-up bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50"
        :style="{ animationDelay: `${index * 100}ms` }">

        <!-- Category Header -->
        <div class="flex items-center gap-2 mb-3">
          <Icon :name="getCategoryIcon(String(category))" class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <h3 class="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {{ category }}
          </h3>
        </div>

        <!-- Tech Chips Grid -->
        <div class="flex flex-wrap gap-2">
          <div v-for="(skill, i) in categorySkills" :key="skill.id"
            class="group relative flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-lg hover:border-emerald-500/50 dark:hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-default">

            <!-- Skill Icon -->
            <Icon :name="getIcon(skill.name)"
              class="w-4 h-4 grayscale group-hover:grayscale-0 transition-all duration-300" />

            <!-- Skill Name -->
            <span
              class="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {{ skill.name }}
            </span>

            <!-- Subtle Glow Effect -->
            <div
              class="absolute inset-0 rounded-lg bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
