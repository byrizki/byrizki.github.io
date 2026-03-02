<script setup lang="ts">
import { useServiceWorkerCleanup } from "~/composables/useServiceWorkerCleanup";

useServiceWorkerCleanup();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
