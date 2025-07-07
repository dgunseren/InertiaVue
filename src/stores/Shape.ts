import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Point, Line, Shape } from '../types/geometry.ts'


// === Pinia Store ===
export const useShapeStore = defineStore('shape', () => {
  // === State ===
  const shapeList = ref<Shape[]>([])
  const lineList = ref<Line[]>([])
  const PointList = ref<Point[]>([])
  const finalPoint = ref<Point | null>(null)
  const currentMode = ref<string>('')

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
      currentMode: place,
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
  function getPointsOfShape(shapeID: number): Point[] {
    const shape = shapeList.value.find(s => s.id === shapeID)
    return shape?.PointList ?? []
  }

    function getLinesOfShape(shapeID: number): Line[] {
    const shape = shapeList.value.find(s => s.id === shapeID)
    return shape?.lineList ?? []
  }

  return {
    // State
    shapeList,
    lineList,
    PointList,
    finalPoint,
    currentMode,

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
    getShapeTypeById,
    getPointsOfShape,
    getLinesOfShape
  }
})
