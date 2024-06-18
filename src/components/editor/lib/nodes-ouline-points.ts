import { Node } from '@/components/editor/stores/editor-store';
import hull from 'hull.js'
import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'
import polygonClipping from "polygon-clipping"


type outlinePoints = number[][]

function mirrorPointsHorizontally(points: number[][]): [number, number][] {
  return points.map(point => [point[0] * -1, point[1]]);
}
function mirrorPointsVertically(points: number[][]): [number, number][] {
  return points.map(point => [point[0], point[1] * -1]);
}

export function getNodesOutinePoints(
  nodes: Node[],
  options: {
    wallWidth: number
    wallSwitchPadding?: number
    offset?: number
  }
): outlinePoints {

  const hullPadd = 140 * 4

  const initPoints: number[][] = []

  nodes.filter(node => node.type === "switch").forEach(node => {
    const { pos: { x, y, r }, size: { w, h, p } } = node;
    const tp = p + (options?.wallSwitchPadding ?? 0); // total padding
    [
      [x + tp + w / 2, y + tp + h / 2],
      [x + tp + w / 2, y - tp - h / 2],
      [x - tp - w / 2, y + tp + h / 2],
      [x - tp - w / 2, y - tp - h / 2],
    ].forEach((pnt) => {
      initPoints.push(rotatePoint(pnt, [x, y], -r))
    })
  });

  nodes.filter(node => node.type === "mcu").forEach(node => {
    const { pos: { x, y, r }, size: { w, h, p } } = node;
    const ww = options.wallWidth;
    [
      [x + p + w / 2, y + p + h / 2],
      [x + p + w / 2, y - p - h / 2 + ww],
      [x - p - w / 2, y + p + h / 2],
      [x - p - w / 2, y - p - h / 2 + ww],
    ].forEach((pnt) => {
      initPoints.push(rotatePoint(pnt, [x, y], -r))
    })
  });

  /* this code is for when adding split keyboard support */
  /*
  const dbscan = new cluster.DBSCAN()
  let clusters = dbscan.run(points1, 250, 50);
  clusters = clusters.map(function(cluster) {
    return cluster.map(function(i) {
      return initPoints[i]; // map index to point
    });
  });
  */

  const HflippedPoints = mirrorPointsHorizontally(initPoints)
  //const VflippedPoints = mirrorPointsVertically(initPoints)

  const originalHull = hull(initPoints, hullPadd) as [number, number][]
  const hFlippedHull = mirrorPointsHorizontally(hull(HflippedPoints, hullPadd) as [number, number][])
  // const vFlippedHull = mirrorPointsVertically(hull(VflippedPoints, hullPadd) as [number, number][])

  const finalHull = polygonClipping.union(
    [originalHull],
    [hFlippedHull],
    // [vFlippedHull],
  )[0][0] as any as number[][]

  const sides: number[][][] = []

  finalHull.map((point, index) => {
    if (index == finalHull.length - 1) return
    sides.push([point, finalHull[index + 1]])
  })

  const geom = geometries.geom2.create(sides as any)
  const points = expansions.offset({ delta: options?.offset ?? 0 }, geom).sides.map((pnts) => {
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
