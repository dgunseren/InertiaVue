import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCGStore = defineStore('CG', () => {
    // === State ===
    const CG = ref<{ x: number, y: number }>({ x: 0, y: 0 })

    // Getter for CG
    function getCG() {
        return CG.value
    }

    // Setter for CG
    function setCG(value: { x: number, y: number }) {
        CG.value = value
    }

    return {
        CG,
        getCG,
        setCG
    }
})
  