<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import data from "~/assets/data.json";
import { useGithubData } from "~/composables/useGithubData";

import SocialLinks from "~/components/SocialLinks.vue";
import ThemeToggle from "~/components/ThemeToggle.vue";
import GithubHeroHeader from "~/components/github/GithubHeroHeader.vue";
import GithubDashboard from "~/components/github/GithubDashboard.vue";
import ProjectList from "~/components/ProjectList.vue";
import ExperienceAndSkills from "~/components/ExperienceAndSkills.vue";

const social_links = data.social_links;
const projects = data.projects;
const skills = data.skills;
const experience = data.experience;
const education = (data as any).education || [];
const certifications = (data as any).certifications || [];

const { profile } = useGithubData();

// Tab State (3 unified tabs)
const activeTab = ref("overview");

const navItems = [
  { id: "overview", label: "Overview", icon: "lucide:layout-dashboard" },
  { id: "projects", label: "Projects", icon: "lucide:folder-git-2" },
  { id: "experience", label: "Experience", icon: "lucide:briefcase" },
] as const;

// Scroll Container Ref
const scrollContainer = ref<HTMLElement | null>(null);

// Watch for tab changes to reset scroll
watch(activeTab, async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});
</script>

<template>
  <div
    class="h-screen w-full flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
    
    <!-- Main Scrollable Content Area -->
    <div ref="scrollContainer" class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-[1440px] mx-auto p-4 sm:p-6 lg:py-6 flex flex-col gap-4 md:gap-5">
        
        <!-- Top Toolbar: Social Links & Theme Toggle above Header Card -->
        <div class="flex items-center justify-end gap-3 px-1">
          <SocialLinks :links="social_links" mode="row" />
          <div class="w-px h-5 bg-slate-200 dark:bg-slate-800"></div>
          <ThemeToggle />
        </div>

        <!-- Persistent Header Card across all tabs -->
        <GithubHeroHeader :profile="profile" />

        <!-- Navigation Tabs Bar Under Header Card -->
        <div class="flex items-center justify-between gap-4 pb-2">
          <nav class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <button
              v-for="item in navItems"
              :key="item.id"
              @click="activeTab = item.id"
              class="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer"
              :class="[
                activeTab === item.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              ]">
              <Icon :name="item.icon" class="w-3.5 h-3.5" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>

        <!-- Dynamic Tab Content -->
        <Transition name="fade" mode="out-in">
          <!-- Overview: GitHub Dashboard Stats + Quote Footer -->
          <div v-if="activeTab === 'overview'" key="overview">
            <GithubDashboard />
          </div>

          <!-- Projects -->
          <div v-else-if="activeTab === 'projects'" key="projects" class="w-full">
            <ProjectList :projects="projects" />
          </div>

          <!-- Experience, Education, Skills & Certifications -->
          <div v-else-if="activeTab === 'experience'" key="experience" class="w-full">
            <ExperienceAndSkills
              :experience="experience"
              :skills="skills"
              :education="education"
              :certifications="certifications"
            />
          </div>
        </Transition>

        <!-- Always-visible Centered Footer Text across all tabs -->
        <div class="flex items-center justify-center gap-1.5 pt-2 pb-6 text-xs font-mono text-slate-400 dark:text-slate-500 select-none">
          <span>made with</span>
          <Icon name="lucide:heart" class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse" />
          <span>by Rizki</span>
        </div>

      </div>
    </div>
  </div>
</template>
