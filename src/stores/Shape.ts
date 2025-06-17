import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// === Types ===
type Point = { x: number; y: number }
type Line = { start: Point; end: Point }
type Shape = {
  id: number
  lineList: Line[]
  PointList: Point[]
  finalPoint: Point | null
  type: string
}

// === Pinia Store ===
export const useShapeStore = defineStore('shape', () => {
  // === State ===
  const shapeList = ref<Shape[]>([])
  const lineList = ref<Line[]>([])
  const PointList = ref<Point[]>([])
  const finalPoint = ref<Point | null>(null)

  // === Getters ===
  const getShapes = computed(() => shapeList.value)
  const getLines = computed(() => lineList.value)
  const getPoints = computed(() => PointList.value)
  const getFinalPoint = computed(() => finalPoint.value)

  // === Actions ===

  function CreateShape(id: number, place: string) {
    shapeList.value.push({
      id,
      lineList: [],
      PointList: [],
      finalPoint: null,
      type: place,
    })
  }
  console.log('YO G STORE HERE')

  function addLine(shapeID: number, line: Line) {
    const shape = shapeList.value.find(s => s.id === shapeID)
    if (shape) shape.lineList.push(line)
  }

  function addPoint(shapeID: number, point: Point) {
    const shape = shapeList.value.find(s => s.id === shapeID)
    if (shape) shape.PointList.push(point)
  }

  function addFinalPoint(shapeID: number, point: Point) {
    const shape = shapeList.value.find(s => s.id === shapeID)
    if (shape) shape.finalPoint = point
  }

  function getFinalPointOfShape(shapeID: number): Point | null {
    const shape = shapeList.value.find(s => s.id === shapeID)
    return shape?.finalPoint ?? null
  }

  function getShapeTypeById(id: number): string | null {
    const shape = shapeList.value.find(s => s.id === id)
    return shape?.type ?? null
  }

  return {
    // State
    shapeList,
    lineList,
    PointList,
    finalPoint,

    // Getters
    getShapes,
    getLines,
    getPoints,
    getFinalPoint,

    // Actions
    CreateShape,
    addLine,
    addPoint,
    addFinalPoint,
    getFinalPointOfShape,
    getShapeTypeById
  }
})
