<script setup lang="ts">
import ExperienceList from "./ExperienceList.vue";
import EducationCard from "./EducationCard.vue";
import SkillsCard from "./SkillsCard.vue";
import CertificationsCard from "./CertificationsCard.vue";

defineProps<{
  experience: any[];
  skills: any[];
  education?: any[];
  certifications?: any[];
}>();
</script>

<template>
  <div class="w-full flex flex-col gap-4 md:gap-5 animate-slide-up">
    <!-- Top Row: Experience (Left) & Education + Certifications (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-start">
      <!-- Left Column: Work Experience Timeline (7 cols) -->
      <div class="lg:col-span-7 flex flex-col">
        <ExperienceList :experience="experience" class="h-full" />
      </div>

      <!-- Right Column: Education & Licenses/Certifications (5 cols) -->
      <div class="lg:col-span-5 flex flex-col gap-4 md:gap-5">
        <EducationCard v-if="education && education.length > 0" :education="education" />
        <CertificationsCard v-if="certifications && certifications.length > 0" :certifications="certifications" />
      </div>
    </div>

    <!-- Bottom Row: Skills as a single full-width wide card -->
    <div class="w-full">
      <SkillsCard :skills="skills" />
    </div>
  </div>
</template>
