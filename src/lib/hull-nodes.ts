import { Node } from "reactflow";
import hull from 'hull.js'
import polygonClipping, { Polygon } from "polygon-clipping"

type outlinePoints = number[][]

function mirrorPointsHorizontally(points: number[][]) {
  return points.map(point => [point[0] * -1, point[1]]);
}

export function getNodesBorderPoints(nodes: Node[], padding: number = 65): outlinePoints {
  let switch_nodes = nodes.filter((node: any) => node.type === "switch")
  let mcu_nodes = nodes.filter((node: any) => node.type === "mcu")

  const initPoints: any = []
  switch_nodes.forEach(node => {
    const { x, y } = node.position;
    initPoints.push([x + 70 + padding, y + 70 + padding]);
    initPoints.push([x + 70 + padding, y - 70 - padding]);
    initPoints.push([x - 70 - padding, y + 70 + padding]);
    initPoints.push([x - 70 - padding, y - 70 - padding]);
  });


  const flippedPoints = mirrorPointsHorizontally(initPoints)

  mcu_nodes.forEach(node => {
    const { x, y } = node.position;
    initPoints.push([x, y]);
    initPoints.push([x + 105, y]);
    initPoints.push([x - 105, y]);
    initPoints.push([x, y + 260]);
    initPoints.push([x, y - 220]);
    initPoints.push([x + 105, y + 260]);
    initPoints.push([x - 105, y + 260]);
    initPoints.push([x + 105, y - 220]);
    initPoints.push([x - 105, y - 220]);
  });

  /*
  const dbscan = new cluster.DBSCAN()
  let clusters = dbscan.run(points1, 250, 50);
  clusters = clusters.map(function(cluster) {
    return cluster.map(function(i) {
      return initPoints[i]; // map index to point
    });
  });
  */

  const originalHull = hull(initPoints, (70 + padding) * 5)
  const flippedHull = hull(flippedPoints, (70 + padding) * 5)
  const finalHull = polygonClipping.union(
    [mirrorPointsHorizontally(flippedHull as number[][])] as Polygon,
    [originalHull as number[][]] as Polygon
  )[0][0] as any
  //  console.log(newHull1, finalHull)
  return finalHull
}
