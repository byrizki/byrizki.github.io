<script setup lang="ts">
const activeTab = defineModel<string>({ required: true });

const tabs = [
  { id: "profile", icon: "lucide:user", label: "profile" },
  { id: "projects", icon: "lucide:code-2", label: "projects" },
  { id: "skills", icon: "lucide:terminal", label: "skills" },
  { id: "experience", icon: "lucide:briefcase", label: "experience" },
] as const;
</script>

<template>
  <div class="lg:hidden fixed bottom-4 left-4 right-4 z-20">
    <div
      class="grid grid-cols-4 h-14 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-400/10">
      <button v-for="(tab, i) in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="flex flex-col items-center justify-center gap-0.5 transition-all relative" :class="[
          activeTab === tab.id
            ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300',
          i === 0 ? 'rounded-l-2xl' : '',
          i === 3 ? 'rounded-r-2xl' : '',
        ]">
        <Icon :name="tab.icon" class="w-5 h-5" />
        <span class="text-[10px] font-mono">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>
