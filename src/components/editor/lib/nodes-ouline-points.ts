import { Node } from '@/components/editor/stores/editor-store';
import hull from 'hull.js'
import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'

type outlinePoints = number[][]

function mirrorPointsHorizontally(points: number[][]) {
  return points.map(point => [point[0] * -1, point[1]]);
}

export function getNodesOutinePoints(nodes: Node[], p: number = 0): outlinePoints {

  const initPoints: number[][] = []

  nodes.forEach(node => {
    primitives.rectangle({
      size: [node.size.w, node.size.h],
      center: [node.pos.x, node.pos.y]
    }).sides.forEach((pnts) => {
      initPoints.push(rotatePoint(pnts[0], [node.pos.x, node.pos.y], -node.pos.r))
    })
  });

  const flippedPoints = mirrorPointsHorizontally(initPoints)

  /* this code is for adding split keyboard support */
  /*
  const dbscan = new cluster.DBSCAN()
  let clusters = dbscan.run(points1, 250, 50);
  clusters = clusters.map(function(cluster) {
    return cluster.map(function(i) {
      return initPoints[i]; // map index to point
    });
  });
  */

  const originalHull = hull(initPoints, (70) * 5) as number[][]
  const flippedHull = hull(flippedPoints, (70) * 5) as number[][]

  const finalHull = hull([
    ...mirrorPointsHorizontally(flippedHull),
    ...originalHull
  ], 70 * 5) as number[][]

  const sides: number[][][] = []

  finalHull.map((point, index) => {
    if (index == finalHull.length - 1) return
    sides.push([point, finalHull[index + 1]])
  })

  const geom = geometries.geom2.create(sides as any)
  const points = expansions.offset({ delta: p }, geom).sides.map((pnts) => {
    return pnts[0]
  })

  return points
}
function rotatePoint(p1: number[], p2: number[], angle: number) {
  // Convert angle from degrees to radians
  let radians = angle * (Math.PI / 180);

  // Translate point p1 to the origin relative to p2
  let translatedX = p1[0] - p2[0];
  let translatedY = p1[1] - p2[1];

  // Apply the rotation matrix
  let rotatedX = translatedX * Math.cos(radians) + translatedY * Math.sin(radians);
  let rotatedY = -translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

  // Translate the point back
  let newX = rotatedX + p2[0];
  let newY = rotatedY + p2[1];

  return [newX, newY];
}
