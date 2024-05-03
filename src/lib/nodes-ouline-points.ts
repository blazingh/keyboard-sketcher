import { Node } from '@/contexts/editor-store';
import hull from 'hull.js'
import polygonClipping, { Polygon } from "polygon-clipping"

type outlinePoints = number[][]

function mirrorPointsHorizontally(points: number[][]) {
  return points.map(point => [point[0] * -1, point[1]]);
}

export function getNodesOutinePoints(nodes: Node[], p: number = 0, wallThick: number = 40): outlinePoints {

  const initPoints: any = []
  nodes.forEach(node => {
    const { x, y } = node.pos;
    const { w, h } = node.size
    initPoints.push([x - p, y - p]);
    initPoints.push([x + w + p, y + h + p]);
    initPoints.push([x + w + p, y - p]);
    initPoints.push([x - p, y + h + p]);
  });

  const flippedPoints = mirrorPointsHorizontally(initPoints)

  /*
    mcu_nodes.forEach(node => {
      const { x, y } = node.pos;
      initPoints.push([x, y]);
      initPoints.push([x + 105, y]);
      initPoints.push([x - 105, y]);
      initPoints.push([x, y + 260]);
      initPoints.push([x, y - 260 + wallThick]);
      initPoints.push([x + 105, y + 260]);
      initPoints.push([x - 105, y + 260]);
      initPoints.push([x + 105, y - 260 + wallThick]);
      initPoints.push([x - 105, y - 260 + wallThick]);
    });
    */

  /*
  const dbscan = new cluster.DBSCAN()
  let clusters = dbscan.run(points1, 250, 50);
  clusters = clusters.map(function(cluster) {
    return cluster.map(function(i) {
      return initPoints[i]; // map index to point
    });
  });
  */

  const originalHull = hull(initPoints, (70) * 5)
  const flippedHull = hull(flippedPoints, (70) * 5)
  const finalHull = polygonClipping.union(
    [mirrorPointsHorizontally(flippedHull as number[][])] as Polygon,
    [originalHull as number[][]] as Polygon
  )[0][0] as any
  //  console.log(newHull1, finalHull)
  return finalHull
}
