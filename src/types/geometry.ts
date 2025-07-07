import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// === Types ===
export type Point = { x: number; y: number }
export type Line = { start: Point; end: Point }
export type Shape = {
  id: number
  lineList: Line[]
  PointList: Point[]
  finalPoint: Point | null
  currentMode: string
}
export type Polygon = {
  points: Point[]
}