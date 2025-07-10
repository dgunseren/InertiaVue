import { useHydraulicStore } from '../stores/Hydraulic'
import type { Point, Line, Shape } from '../types/geometry.ts'


export function CalcCenters(id: number,store: ReturnType<typeof useHydraulicStore>) {
    let points  = store.getPointsOfGroup(id)
    let xSum = 0
    let ySum = 0

    points.forEach((item)=>{
        xSum = xSum+item.x
        ySum = ySum+item.y
    })

    xSum = xSum/points.length
    ySum = ySum/points.length

    store.setGroupCenter(id,{x:xSum,y:ySum})


    //console.log('center',xSum,ySum)
    //console.log('This is another calc method and the points are',store.getPointsOfGroup(id))




}