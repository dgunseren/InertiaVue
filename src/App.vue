<template>
    <div class="button-container">
      <button class="OutShape-button" @click="setMode('outside')">Outside Shape</button>
      <button class="InsideShape-button" @click="setMode('inside')">Inside Shape</button>
      <button class="Calculate-button" @click="concludeCurrentShape">Finish Current Shape</button>
    </div>
    <div class="mode-display">
      Current Mode: <span class="mode-text">{{ currentShapeType }}</span>
    </div>
    <canvas 
      ref="canvas" 
      id="cadCanvas" 
      width="2000" 
      height="2000"
      @contextmenu.prevent
    ></canvas>
</template>

<script>
import { ref, computed, reactive, watch } from "vue";

import { useShapeStore } from './stores/Shape'


export default {


  data() {
    return {
      currentShapeType: 'outside',
      scale: 1.0,
      lines: [],
      shapes: [],
      shapeTypes: [],
      startPoint: null,
      currentEnd: null,
      isDrawing: false,
      maxes: null,
      TotalInertia: 0,
      Returned: {x: 0, y: 0, width: 0, height: 0},
      pingrid: 0,
      maxMoment: 0,
      maxShear: 0,
      maxAxial: 0,
      totalArea: 0,
      showMomentPopup: false,
      showBeamCalculator: false,
      selectedMode: 'forces',
      gridSize: 10,
      snapToGrid: true,
      nearestVertex: null,
      currentDistance: 0,
      logMessages: [],
      currentShapeType: 'outside',
      isDrawingInside: false,
      isDrawingOutside: false,
      shapeCounter: 0,
      selectedShape: null,
      hoveredShape: null,
      prevPoint: null,
      ctx: null,
      shapeStore: null
    }
  },
  created() {
    this.shapeStore = useShapeStore();
  },
  mounted() {
    this.prevPoint = reactive({x: 0, y: 0})
    this.ctx = this.$refs.canvas.getContext('2d')
    const canvas = this.$refs.canvas
    canvas.addEventListener('mousedown', this.startDrawing)
    canvas.addEventListener('mousemove', this.handleMouseMove)
    canvas.addEventListener('mouseup', this.stopDrawing)
    canvas.addEventListener('mouseleave', this.stopDrawing)
    canvas.addEventListener('wheel', this.handleZoom)

  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('message', this.handleMessage)
    
    // Remove canvas event listeners
    const canvas = this.$refs.canvas
    canvas.removeEventListener('mousedown', this.startDrawing)
    canvas.removeEventListener('mousemove', this.handleMouseMove)
    canvas.removeEventListener('mouseup', this.stopDrawing)
    canvas.removeEventListener('mouseleave', this.stopDrawing)
  },
  methods: {
    initializeNewShape(type) {
      // Conclude current shape if one is in progress
      //if (this.isDrawing) {
      this.concludeCurrentShape()
      //}
      
      // Reset drawing state
      this.isDrawing = false
      this.startPoint = null
      this.currentEnd = null
      
      // Set new shape type and increment counter
      this.currentShapeType = type
      this.shapeCounter++
      
      // Create new shape in store with current mode
      //this.shapeStore.CreateShape(this.shapeCounter, this.currentShapeType)
    },

    concludeCurrentShape() {
      if (this.isDrawing && this.startPoint && this.currentEnd) {
        const currentStartPoint = this.shapeStore.getFinalPointOfShape(this.shapeCounter)


        if (currentStartPoint) {
          this.shapeStore.addPoint(this.shapeCounter, this.currentEnd)
          this.shapeStore.addLine(this.shapeCounter, {
            start: currentStartPoint,
            end: this.currentEnd
          })
          this.shapeStore.addFinalPoint(this.shapeCounter, this.currentEnd)
        }
      }
      const points = this.shapeStore.getPointsOfShape(this.shapeCounter)
      const FPofShape = points.length > 0 ? points[0] : null
      const LPOfShape = points.length > 0 ? points[points.length - 1] : null
      console.log('Points:', FPofShape)
      
      this.shapeStore.addLine(this.shapeCounter, {
            start: FPofShape,
            end: LPOfShape
          })
      console.log('Lines:', this.shapeStore.getLinesOfShape(this.shapeCounter))
      // Reset drawing state
      this.isDrawing = false
      this.startPoint = null
      this.currentEnd = null
      
      // Print shape list to console
      console.log('Shape List:', this.shapeStore.getShapes)
      console.log('Current Shape:', this.shapeStore.getShapes[this.shapeCounter - 1])
      
      // Redraw to show final state
      this.redraw()
    },

    handleMouseMove(event) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const x = (event.clientX - rect.left) / this.scale
      const y = (event.clientY - rect.top) / this.scale
      
      if (this.isDrawing && this.startPoint) {
        let snappedX = Math.abs(x - this.startPoint.x) < Math.abs(y - this.startPoint.y) ? this.startPoint.x : x
        let snappedY = Math.abs(x - this.startPoint.x) < Math.abs(y - this.startPoint.y) ? y : this.startPoint.y
        
        this.currentEnd = { x: snappedX, y: snappedY }
        this.redraw()
      }
    },

    startDrawing(event) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      if (event.button === 2) { 
        console.log("right click")
        if (this.lines.length > 0) {
          this.lines.pop()
          this.startPoint = this.lines.length > 0 ? this.lines[this.lines.length - 1].end : { x: (event.clientX - rect.left), y: (event.clientY - rect.top) }
          this.redraw()
          return
        }
        else {
          this.lines.pop()
          this.startPoint = { x: (event.clientX - rect.left), y: (event.clientY - rect.top) }
          this.redraw()
        }
      }

      const x = (event.clientX - rect.left) / this.scale
      const y = (event.clientY - rect.top) / this.scale

      if (!this.startPoint) {
        // Create a new shape when starting to draw
        //this.shapeCounter++
        this.shapeStore.CreateShape(this.shapeCounter, this.currentShapeType)
        this.startPoint = { x, y }
        this.shapeStore.addPoint(this.shapeCounter, this.startPoint)
        this.shapeStore.addFinalPoint(this.shapeCounter, this.startPoint)
      }

      this.isDrawing = true
    },
    stopDrawing() {
      if (this.isDrawing && this.startPoint && this.currentEnd) {
        const currentStartPoint = this.shapeStore.getFinalPointOfShape(this.shapeCounter)
        
        if (currentStartPoint) {
          this.shapeStore.addPoint(this.shapeCounter, this.currentEnd)
          this.shapeStore.addLine(this.shapeCounter, {
            start: currentStartPoint,
            end: this.currentEnd
          })
          this.shapeStore.addFinalPoint(this.shapeCounter, this.currentEnd)
          this.startPoint = this.currentEnd  // Update startPoint for next line
        }
        this.currentEnd = null
      }
      this.isDrawing = false
      this.redraw()
    },
    redraw() {
      const ctx = this.ctx
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      
      // Draw all shapes from the store
      const shapes = this.shapeStore.getShapes
      shapes.forEach((shape) => {
        shape.lineList.forEach((line, i) => {
          this.drawLine(line.start, line.end, false, i)
        })
      })
      
      // Draw preview line if drawing
      if (this.isDrawing && this.startPoint && this.currentEnd) {
        this.drawLine(this.startPoint, this.currentEnd, true)
      }
    },
    drawLine(p1, p2, preview = false, vertexNumber = null) {
      const ctx = this.ctx
      ctx.beginPath()
      ctx.moveTo(p1.x * this.scale, p1.y * this.scale)
      ctx.lineTo(p2.x * this.scale, p2.y * this.scale)
      ctx.strokeStyle = preview ? 'gray' : 'black'
      ctx.setLineDash(preview ? [5, 5] : [])
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.setLineDash([])

      if (vertexNumber !== null) {
        ctx.fillStyle = 'red'
        ctx.font = '14px sans-serif'
        ctx.fillText(vertexNumber.toString(), p1.x * this.scale - 10, p1.y * this.scale - 10)
      }

      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const length = Math.sqrt(dx * dx + dy * dy) * this.scale
      const midX = (p1.x + p2.x) / 2
      const midY = (p1.y + p2.y) / 2
      ctx.fillStyle = preview ? 'gray' : 'blue'
      ctx.font = '14px sans-serif'
      ctx.fillText((length / 10).toFixed(2) + ' units', midX * this.scale + 5, midY * this.scale - 5)
    },
    setMode(type) {
      this.currentShapeType = type
      this.initializeNewShape(this.currentShapeType)
    }
  }

}
</script>

<style>
.button-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
}

.shape-button {
  padding: 10px 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.shape-button:hover {
  background: #f0f0f0;
}

#cadCanvas {
  border: 1px solid #ccc;
  background: white;
}

.log-box {
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 100px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  font-family: monospace;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.input-mode {
  margin: 20px 0;
}

.radio-option {
  margin: 10px 0;
}

.input-section {
  margin: 20px 0;
}

.input-section input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-section button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.input-section button:hover {
  background: #0056b3;
}

.input-field {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.input-field::placeholder {
  color: #999;
  opacity: 1;
}

.input-field::-webkit-input-placeholder {
  color: #999;
  opacity: 1;
}

.input-field:-ms-input-placeholder {
  color: #999;
  opacity: 1;
}

.input-field::-ms-input-placeholder {
  color: #999;
  opacity: 1;
}

.mode-display {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 15px;
  border-radius: 8px;
  border: 2px solid #007bff;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mode-text {
  color: #007bff;
  text-transform: capitalize;
}
</style> 