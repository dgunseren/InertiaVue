import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { H_Group } from '../types/H_Groups.ts'

import type { Point, Line, Shape } from '../types/geometry.ts'


export const useHydraulicStore = defineStore('hydraulic', () => {
  

    const h_GroupList = ref<H_Group[]>([])

   
    function CreateGroup(id: number) {
      h_GroupList.value.push({
        id,
        points:[],
        center:{x:0,y:0},


      })
    }
    console.log('YO HYDRO STORE HERE')
    function addPoints(GroupID: number, points: Point[]) {
      const group = h_GroupList.value.find(s => s.id === GroupID)
      
      if (group) group.points.push(...points)
        
    }
    function getPointsOfGroup(shapeID: number): Point[] {
      const groupI = h_GroupList.value.find(s => s.id === shapeID)
      return groupI?.points ?? []
    }

    // Set the center of a group by id
    function setGroupCenter(id: number, center: Point) {
      const group = h_GroupList.value.find(s => s.id === id)
      if (group) {
        group.center = center
      }
    }

    // Get the center of a group by id
    function getGroupCenter(id: number): Point | undefined {
      const group = h_GroupList.value.find(s => s.id === id)
      return group?.center
    }
  
    // Getter: returns a function that takes an id and returns the points for that group
    const pointsById = computed(() => (id: number) => {
      const group = h_GroupList.value.find(s => s.id === id)
      return group?.points ?? []
    })
  
    return {
        h_GroupList,
        addPoints,
        getPointsOfGroup,
        CreateGroup,
        pointsById,
        setGroupCenter,
        getGroupCenter
    }
  })
  