<script setup lang="ts">
interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_id?: string | null;
  url?: string | null;
  icon?: string;
  skills?: string[];
}

defineProps<{
  certifications: Certification[];
}>();
</script>

<template>
  <div
    class="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800/80">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Icon name="lucide:award" class="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 class="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
            Licenses & Certifications
          </h2>
        </div>
      </div>

      <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
        {{ certifications.length }} verified
      </span>
    </div>

    <!-- Certification Items -->
    <div class="space-y-2.5">
      <div
        v-for="cert in certifications"
        :key="cert.id"
        class="group p-2.5 sm:p-3 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all flex flex-col gap-2">
        
        <div class="flex items-start gap-2.5">
          <!-- Issuer Logo -->
          <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shrink-0 p-1.5 mt-0.5 group-hover:scale-105 transition-transform shadow-2xs">
            <Icon :name="cert.icon || 'lucide:award'" class="w-full h-full object-contain" />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {{ cert.name }}
            </h3>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5 leading-snug">
              {{ cert.issuer }}
            </p>
            <div class="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
              Issued {{ cert.issue_date }}
            </div>
            <div v-if="cert.credential_id" class="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Credential ID {{ cert.credential_id }}
            </div>
          </div>
        </div>

        <!-- Show Credential Button & Associated Skills -->
        <div class="pl-10.5 flex flex-col gap-1.5">
          <div v-if="cert.url">
            <a
              :href="cert.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-amber-500 dark:hover:border-amber-400 text-[10.5px] font-mono font-medium transition-all shadow-2xs hover:scale-102">
              <span>Show credential</span>
              <Icon name="lucide:external-link" class="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>

          <!-- Associated Skills -->
          <div v-if="cert.skills && cert.skills.length > 0" class="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <Icon name="lucide:sparkles" class="w-3 h-3 text-amber-500 shrink-0" />
            <span class="truncate">{{ cert.skills.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
