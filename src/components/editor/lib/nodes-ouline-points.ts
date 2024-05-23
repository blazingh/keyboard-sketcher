import { Node } from '@/components/editor/stores/editor-store';
import hull from 'hull.js'
import { getRotatedNodeCorners } from './nodes-utils';
import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'

type outlinePoints = number[][]

function mirrorPointsHorizontally(points: number[][]) {
  return points.map(point => [point[0] * -1, point[1]]);
}

export function getNodesOutinePoints(nodes: Node[], p: number = 0): outlinePoints {

  const initPoints: number[][] = []
  nodes.forEach(node => {
    const pnts = getRotatedNodeCorners(node)
    pnts.forEach(pnt => {
      initPoints.push([pnt.x, pnt.y]);
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
  const points = expansions.offset({ delta: p }, geom).sides.map((points) => {
    return points[1]
  })

  return points
}
