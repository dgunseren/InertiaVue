<template>
  <div>

    <!-- Existing content below -->
    <div class="home">
      <h1>Welcome!</h1>
      <button @click="goTo('moment')">Go to Moment of Inertia App</button>
      <button @click="goTo('lashing')">Go to Hydraulic Grouping App</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue';
const router = useRouter()
function goTo(route: string) {
  router.push({ name: route === 'moment' ? 'MomentApp' : 'HydraulicGropue' })
}

const inputX = ref(0);
const inputY = ref(0);
const inputRadius = ref(50);
const circles = ref<{x: number, y: number, radius: number}[]>([]);

function addCircle() {
  circles.value.push({
    x: inputX.value,
    y: inputY.value,
    radius: 20000
  });
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