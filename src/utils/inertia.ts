import type { Point, Line, Shape } from '../types/geometry.ts'

// Alternative import approach
// import PolyK from '../lib/polyk.js'

// Or use require if needed
// const PolyK = require('../lib/polyk.js')

// @ts-ignore
import PolyK from '../lib/polyk.js'


// @ts-ignore
export function calculateInertia(gridPoints,rotationCenter,cellsize) {
    console.log('Calculating inertia...')
    console.log('Greetings from inertia',gridPoints)    
    console.log('Greetings from rotation center',rotationCenter) 
    console.log('Greetings from Shapes',gridPoints)
    let totalInertia = 0
    // @ts-ignore
    gridPoints.forEach(point => {
        //let dx = point[0] - rotationCenter.x
        let dy = point[1] - rotationCenter.y
        let cellInertia = dy * dy * cellsize*cellsize
        totalInertia += cellInertia
        
    })
    console.log('PartialInertia', totalInertia)

return totalInertia
}

// @ts-ignore
export function calculateRotationCenter(gridPoints) {
    console.log('Calculating rotation center...',gridPoints)
    let maxes = PolyK.GetAABB(gridPoints)
    let center = {x:0, y:0}
    center.x = (maxes.x + maxes.width / 2)
    center.y = (maxes.y + maxes.height / 2)
    console.log('Center', center)
    
    
    return {center,maxes}
    
}