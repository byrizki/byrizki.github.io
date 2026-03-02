<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import data from "~/assets/data.json";

import Header from "~/components/Header.vue";
import ProfileCard from "~/components/ProfileCard.vue";
import SkillsCard from "~/components/SkillsCard.vue";
import StatsGrid from "~/components/StatsGrid.vue";
import ProjectList from "~/components/ProjectList.vue";
import ExperienceList from "~/components/ExperienceList.vue";
import MobileNav from "~/components/MobileNav.vue";
import ThemeToggle from "~/components/ThemeToggle.vue";
import SocialLinks from "~/components/SocialLinks.vue";

const profile = data.profile;
const social_links = data.social_links;
const projects = data.projects;
const skills = data.skills;
const experience = data.experience;

// Tab State
const activeTab = ref("profile");

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
    <Header :profile="profile" :socialLinks="social_links" />

    <!-- Desktop View -->
    <div class="hidden lg:grid flex-1 max-w-[1600px] mx-auto w-full p-6 gap-6 min-h-0 grid-cols-12">

      <!-- Left Column: Profile & Skills -->
      <aside class="col-span-3 flex flex-col gap-6 overflow-hidden scrollbar-hide h-full min-h-0">
        <ProfileCard :profile="profile" />
        <SkillsCard :skills="skills" />
      </aside>

      <!-- Center Column: Projects -->
      <main class="col-span-5 flex flex-col min-w-0 min-h-0 overflow-hidden h-full">
        <ProjectList :projects="projects" />
      </main>

      <!-- Right Column: Experience -->
      <aside class="col-span-4 flex flex-col gap-6 min-w-0 min-h-0 overflow-y-auto scrollbar-hide h-full">
        <ExperienceList :experience="experience" />
      </aside>
    </div>

    <!-- Mobile View -->
    <div class="lg:hidden flex-1 min-h-0 flex flex-col">
      <div ref="scrollContainer" class="flex-1 overflow-y-auto scrollbar-hide">
        <div
          class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-2 flex items-center justify-between">
          <Logo class="h-6 w-auto text-slate-900 dark:text-white" />
          <ThemeToggle />
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="activeTab === 'profile'" key="profile" class="h-full flex flex-col">
            <div class="p-4 space-y-3 pb-32">
              <ProfileCard :profile="profile" />

              <div v-if="social_links.length > 0"
                class="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm animate-slide-up"
                style="animation-delay: 300ms">
                <div class="flex items-center gap-2 mb-4">
                  <Icon name="lucide:link" class="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <h2 class="font-bold font-mono text-sm text-slate-900 dark:text-white">Connect</h2>
                </div>
                <SocialLinks :links="social_links" mode="grid" />
              </div>

              <StatsGrid
                :project-count="projects.length"
                :skill-count="skills.length"
                :role-count="experience.length"
              />
            </div>
          </div>

          <div v-else-if="activeTab === 'projects'" key="projects">
            <div class="py-4 min-h-0 pb-32">
              <ProjectList :projects="projects" />
            </div>
          </div>

          <div v-else-if="activeTab === 'skills'" key="skills">
            <div class="py-4 min-h-0 pb-32">
              <SkillsCard :skills="skills" />
            </div>
          </div>

          <div v-else-if="activeTab === 'experience'" key="experience">
            <div class="py-4 min-h-0 pb-32">
              <ExperienceList :experience="experience" />
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <MobileNav v-model="activeTab" />
  </div>
</template>
