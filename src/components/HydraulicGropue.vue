<template>
  <div class="button-container">
    <h2 class="title">Axle Layout Generator</h2>
    <div class="input-panel">
      <div class="input-group">
        <label>Axle Type:</label>
        <div>
          <label v-for="option in axleOptions" :key="option.value" class="mr-4">
            <input
              type="radio"
              name="axleType"
              :value="option.value"
              v-model="selectedAxle"
            />
            {{ option.label }}
          </label>
        </div>
      </div>
      <div class="input-group">
        <label>Number of Rows:</label>
        <input type="number" min="1" v-model.number="rows" class="input-field" />
      </div>
      <button @click="draw" class="calculate-results-button">Draw</button>
    </div>
    <canvas
  ref="canvasRef"
  width="1200"
  height="3000"
  class="border"
  style="width: 100%; max-width: 1200px; height: auto"
/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const axleOptions = [
  { label: '1 File', value: 1 },
  { label: '2 File', value: 2 },
  { label: '3 File', value: 3 },
  { label: '4 File', value: 4 },
]

const selectedAxle = ref(1)
const rows = ref(1)
const canvasRef = ref<HTMLCanvasElement | null>(null)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const rectWidth = 116
  const rectHeight = 150
  const spacingX = 50
  const spacingY = 40
  const startX = 100
  const startY = 50

  for (let r = 0; r < rows.value; r++) {
    for (let f = 0; f < selectedAxle.value; f++) {
      let x = startX + f * rectWidth
      let y = startY + r * rectHeight

      if (f >1){
        x = x+spacingX


      }
      
      


      // Fill with blue
      ctx.fillStyle = 'orange'
      ctx.fillRect(x, y, rectWidth, rectHeight)

      // Outline with red
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, rectWidth, rectHeight)
    }
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  margin: 2rem;
}
.input-panel {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #28a745;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-group {
  margin-bottom: 15px;
}
.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  font-size: 14px;
}
.input-field {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
.calculate-results-button {
  width: 100%;
  padding: 10px;
  border: 2px solid #28a745;
  border-radius: 5px;
  background: #28a745;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}
.calculate-results-button:hover {
  background: #218838;
  border-color: #1e7e34;
}
#cadCanvas {
  border: 1px solid #ccc;
  background: white;
  margin-left: 2rem;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style> 