import type { Point, Line, Shape,Polygon } from '../types/geometry.ts'

import { ref, computed } from 'vue'


function pointInPolygon(point:Point, polygon:Polygon) {
    //let [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.points.length - 1; i < polygon.points.length; j = i++) {
      let xi = polygon.points[i].x, yi = polygon.points[i].y;
      let xj = polygon.points[j].x, yj = polygon.points[j].y;
      let intersect = ((yi > point.y) !== (yj > point.y)) &&
                      (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    //return inside;
    return inside;
  }

export function generateGridInsideShape(MyShape:Shape, cellSize:number) {
    console.log('Generating grid inside shape...')
    const LineList = MyShape.lineList
    console.log(LineList)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    LineList.forEach(line => {
        [line.start, line.end].forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
    });

    //let polygon = LineList.map(line => line.end)
    //console.log(polygon)
    const polygon = ref<Polygon>({ points: [] });
    let pp = ref<Point>({x:0, y:0});

    LineList.forEach(line => {
        polygon.value.points.push(line.end)
    });
    console.log(polygon)
    let gridPoints = [];

    for (let y = minY; y <= maxY; y += cellSize) {
      for (let x = minX; x <= maxX; x += cellSize) {
        pp.value = { x, y }
        if (pointInPolygon(pp.value, polygon.value)) {
          gridPoints.push([x, y ]);

          
        }
      }
    }
    //console.log('gridPoints',gridPoints)
  
    return gridPoints;
    };
// @ts-ignore
export function makeItList(LineList) {
    // @ts-ignore
    let list = []
    // @ts-ignore

    console.log('Greetings from makeItList',LineList)
    // @ts-ignore
    LineList.forEach(line => {
        // @ts-ignore
        list.push(line.start.x)
        list.push(line.start.y)
      })
    // @ts-ignore
    return list
}