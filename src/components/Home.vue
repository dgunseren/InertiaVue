<template>
  <div class="home">
    <h1>Welcome!</h1>
    <button @click="goTo('moment')">Go to Moment of Inertia App</button>
    <button @click="goTo('lashing')">Go to Hydraulic Grouping App</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goTo(route: string) {
  router.push({ name: route === 'moment' ? 'MomentApp' : 'HydraulicGropue' })
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}
button {
  padding: 0.5rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}
</style> 