import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMomentStore = defineStore('moment', () => {
    // === State ===
    const Moment = ref<number>(0)
    const Inertia = ref<number>(0)
    const yDist = ref<number>(0)

    const getBendingStress = computed(() => {
        const M = Number(Moment.value)
        const I = Number(Inertia.value)*10**-12
        const y = Number(yDist.value)*10**-3
        if (!I || isNaN(M) || isNaN(I) || isNaN(y)) return null
        return (M * y / I)*10**-6
      })
  

  
    return {
        Moment,
        Inertia,
        yDist,
        getBendingStress
    }
  })
  