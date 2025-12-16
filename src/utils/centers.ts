import { useHydraulicStore } from '../stores/Hydraulic'
import type { Point, Line, Shape } from '../types/geometry.ts'
// @ts-ignore
import PolyK from '../lib/polyk.js'
// @ts-ignore
//import ConvexHull from '../lib/cvxhull.js'
function ConvexHullGrahamScan() {
// @ts-ignore
    this.anchorPoint = undefined;
// @ts-ignore
    this.reverse = false;
// @ts-ignore
    this.points = [];
}
ConvexHullGrahamScan.prototype = {

    constructor: ConvexHullGrahamScan,
// @ts-ignore

    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },
// @ts-ignore

    _findPolarAngle: function (a, b) {
        var ONE_RADIAN = 57.295779513082;
        var deltaX, deltaY;

        //if the points are undefined, return a zero difference angle.
        if (!a || !b) return 0;

        deltaX = (b.x - a.x);
        deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        if (this.reverse){
            if (angle <= 0) {
                angle += 360;
            }
        }else{
            if (angle >= 0) {
                angle += 360;
            }
        }

        return angle;
    },
// @ts-ignore

    addPoint: function (x, y) {
        //Check for a new anchor
        var newAnchor =
            (this.anchorPoint === undefined) ||
            ( this.anchorPoint.y > y ) ||
            ( this.anchorPoint.y === y && this.anchorPoint.x > x );

        if ( newAnchor ) {
            if ( this.anchorPoint !== undefined ) {
                this.points.push(new this.Point(this.anchorPoint.x, this.anchorPoint.y));
            }
            this.anchorPoint = new this.Point(x, y);
        } else {
            this.points.push(new this.Point(x, y));
        }
    },

    _sortPoints: function () {
        var self = this;
// @ts-ignore

        return this.points.sort(function (a, b) {
            var polarA = self._findPolarAngle(self.anchorPoint, a);
            var polarB = self._findPolarAngle(self.anchorPoint, b);

            if (polarA < polarB) {
                return -1;
            }
            if (polarA > polarB) {
                return 1;
            }

            return 0;
        });
    },
// @ts-ignore

    _checkPoints: function (p0, p1, p2) {
        var difAngle;
        var cwAngle = this._findPolarAngle(p0, p1);
        var ccwAngle = this._findPolarAngle(p0, p2);

        if (cwAngle > ccwAngle) {

            difAngle = cwAngle - ccwAngle;

            return !(difAngle > 180);

        } else if (cwAngle < ccwAngle) {

            difAngle = ccwAngle - cwAngle;

            return (difAngle > 180);

        }

        return true;
    },

    getHull: function () {
        var hullPoints = [],
            points,
            pointsLength;
// @ts-ignore

        this.reverse = this.points.every(function(point){
            return (point.x < 0 && point.y < 0);
        });

        points = this._sortPoints();
        pointsLength = points.length;

        //If there are less than 3 points, joining these points creates a correct hull.
        if (pointsLength < 3) {
            points.unshift(this.anchorPoint);
            return points;
        }

        //move first two points to output array
        hullPoints.push(points.shift(), points.shift());

        //scan is repeated until no concave points are present.
        while (true) {
            var p0,
                p1,
                p2;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this._checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length == 0) {
                if (pointsLength == hullPoints.length) {
                    //check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
                    var ap = this.anchorPoint;
                    //remove any udefined elements in the hullPoints array.
                    hullPoints = hullPoints.filter(function(p) { return !!p; });
                    if (!hullPoints.some(function(p){
                            return(p.x == ap.x && p.y == ap.y);
                        })) {
                        hullPoints.unshift(this.anchorPoint);
                    }
                    return hullPoints;
                }
                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }
};



// @ts-ignore
let fullPoints = []
// @ts-ignore
var ConvexHullN = new ConvexHullGrahamScan()


export function CalcCenters(id: number,store: ReturnType<typeof useHydraulicStore>) {
    let points  = store.getPointsOfGroup(id)
    let xSum = 0
    let ySum = 0
    

    points.forEach((item)=>{
        xSum = xSum+item.x
        ySum = ySum+item.y
    })
    console.log('points',points.length)

    xSum = xSum/points.length
    ySum = ySum/points.length
    //@ts-ignore
    fullPoints.push(xSum,ySum)
    ConvexHullN.addPoint(xSum,ySum)
    console.log('xSum,ySum',xSum,ySum)

    store.setGroupCenter(id,{x:xSum,y:ySum})
    if (ConvexHullN.points.length>2){
        var hullPoints = ConvexHullN.getHull()
        console.log('HullP',hullPoints)

        // Reset the group's points to the order returned by the convex hull
        const group = store.h_GroupList.find(s => s.id === id)
        if (group) {
            group.points = hullPoints.map((p: {x: number, y: number}) => ({ x: p.x, y: p.y }))
        }

        // Set the center of each group as returned by the convex hull
        hullPoints.forEach((p: {x: number, y: number}, idx: number) => {
            const groupToSet = store.h_GroupList[idx];
            if (groupToSet) {
                store.setGroupCenter(groupToSet.id, { x: p.x, y: p.y });
            }
        });
    }

    //@ts-ignore
    console.log('ALL POINTS',fullPoints)
    //@ts-ignore
    console.log('polygon',PolyK.IsSimple(fullPoints))
    console.log('YO WE REARRANGED THE POINTS = ',store.getPointsOfGroup(id))
    
    let a = {x:0,y:0}

    //@ts-ignore
    //if (store.h_GroupList.length >= 4 && PolyK.IsSimple(fullPoints)!) {
    //    const center2 = store.getGroupCenter(2)
    //    if (center2) {
    //      a.x = center2.x
    //      a.y = center2.y
    //    }
    //    store.setGroupCenter(2, { x: hullPoints[2].x, y: hullPoints[2].y })
    //    store.setGroupCenter(3, { x: a.x, y: a.y })
    //}

}

