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
import { ref, onMounted, watch,onBeforeMount } from 'vue'
import { useHydraulicStore } from '../stores/Hydraulic'
import { CalcCenters } from '@/utils/centers'
const hydroStore = useHydraulicStore()

const axleOptions = [
  { label: '1 File', value: 1 },
  { label: '2 File', value: 2 },
  { label: '3 File', value: 3 },
  { label: '4 File', value: 4 },
]

const selectedAxle = ref(1)
const rows = ref(1)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const selectedRects = ref<{ row: number, col: number }[]>([])
// Each group: { color: string, rects: {row, col}[] }
const groups = ref<{ color: string, rects: { row: number, col: number }[] }[]>([])
let groupid = ref(0)

// Color palette for groups
const groupColors = [
  '#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#B10DC9', '#FFDC00', '#001f3f', '#39CCCC', '#01FF70', '#F012BE', '#85144b', '#3D9970', '#111111', '#AAAAAA'
]
function getNextGroupColor() {
  return groupColors[groups.value.length % groupColors.length]
}

function draw() {
  
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const rectWidth = 150
  const rectHeight = 116
  const spacingX = 50
  const spacingY = 40
  const startX = 100
  const startY = 50

  for (let r = 0; r < rows.value; r++) {
    for (let f = 0; f < selectedAxle.value; f++) {
      let x = startX + f * rectWidth
      let y = startY + r * rectHeight
      if (f > 1) {
        x = x + spacingX
      }
      // Determine color: group color if in a group, else blue if selected, else orange
      let filled = false
      for (const group of groups.value) {
        if (group.rects.some(sel => sel.row === r && sel.col === f)) {
          ctx.fillStyle = group.color
          filled = true
          break
        }
      }
      if (!filled) {
        if (selectedRects.value.some(sel => sel.row === r && sel.col === f)) {
          ctx.fillStyle = 'blue'
        } else {
          ctx.fillStyle = 'orange'
        }
      }
      ctx.fillRect(x, y, rectWidth, rectHeight)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, rectWidth, rectHeight)
    }
  }
}
function drawHydraulicGroup() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  //ctx.clearRect(0, 0, canvas.width, canvas.height) // Optionally clear

  // Collect all group centers
  const centers = hydroStore.h_GroupList
    .map(group => group.center)
    .filter(center => center && typeof center.x === 'number' && typeof center.y === 'number')

  if (centers.length < 2) return // Need at least 2 centers to draw a line

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(centers[0].x, centers[0].y)
  for (let i = 1; i < centers.length; i++) {
    ctx.lineTo(centers[i].x, centers[i].y)
  }
  ctx.stroke()
}

function zeroID(){
  groupid.value = 0
}

function canvasClick(event: MouseEvent) {
  if (event.button !== 0) return; // Only left click
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const rectWidth = 150
  const rectHeight = 116
  const spacingX = 50
  const spacingY = 40
  const startX = 100
  const startY = 50

  for (let r = 0; r < rows.value; r++) {
    for (let f = 0; f < selectedAxle.value; f++) {
      let x = startX + f * rectWidth
      let y = startY + r * rectHeight
      if (f > 1) {
        x = x + spacingX
      }
      if (
        mouseX >= x && mouseX <= x + rectWidth &&
        mouseY >= y && mouseY <= y + rectHeight
      ) {
        const idx = selectedRects.value.findIndex(sel => sel.row === r && sel.col === f)
        if (idx === -1) {
          selectedRects.value.push({ row: r, col: f })
        } else {
          selectedRects.value.splice(idx, 1)
        }
        draw()
        return
      }
    }
  }
}

function canvasRightClick(event: MouseEvent) {
  event.preventDefault()
  hydroStore.CreateGroup(groupid.value)
  console.log('slcr',selectedRects.value)
  const rectWidth = 150
  const rectHeight = 116
  const spacingX = 50
  const spacingY = 40
  const startX = 100
  const startY = 50

  if (selectedRects.value.length > 0) {
    // Add as a new group with a unique color
    groups.value.push({
      color: getNextGroupColor(),
      rects: selectedRects.value.map(item => ({ row: item.row, col: item.col }))
    })
  }
 

  selectedRects.value.forEach((item) =>{
    let x = startX+ item.col*rectWidth+rectWidth/2
    let y = startY+ item.row*rectHeight+rectHeight/2
    if (item.col > 1) {
        x = x + spacingX
      }


    hydroStore.addPoints(groupid.value,[{x,y}])

    console.log(x,y)

    console.log(groupid.value,item.row,item.col)
  })
  CalcCenters(groupid.value,hydroStore)

  groupid.value = groupid.value+1
  selectedRects.value = []
  draw()
}

// Helper to always draw both rectangles and lines
function drawBoth() {
  draw();
  drawHydraulicGroup();
}

onMounted(() => {
  drawBoth();
  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('click', canvasClick)
    canvas.addEventListener('contextmenu', canvasRightClick)
  }
})

watch([selectedAxle, rows], drawBoth)
watch([selectedAxle, rows], zeroID)
watch([groupid], drawBoth)
watch([groups], drawBoth)

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