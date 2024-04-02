import { Node } from "reactflow";
import hull from 'hull.js'

type outlinePoints = number[][]

export function getNodesBorderPoints(nodes: Node[], padding: number = 65): outlinePoints {
  let switch_nodes = nodes.filter((node: any) => node.type === "switch")
  let mcu_nodes = nodes.filter((node: any) => node.type === "mcu")

  const initPoints: any = []
  switch_nodes.forEach(node => {
    const { x, y } = node.position;
    const offsets = [-70 - padding, 0, 70 + padding, 35 + padding, -35 - padding];
    offsets.forEach(offsetX => {
      offsets.forEach(offsetY => {
        initPoints.push([x + offsetX, y + offsetY]);
      });
    });
  });

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

  const newHull = hull(initPoints, Math.sqrt(2) * (70 + padding * 2)) // 198 is the switch diagnol lenght
  return newHull as number[][]
}

export function expandPolygon(polygon: number[][], expansionFactor: number) {
  // Calculate centroid
  let centroidX = 0, centroidY = 0;
  for (let i = 0; i < polygon.length; i++) {
    centroidX += polygon[i][0];
    centroidY += polygon[i][1];
  }
  centroidX /= polygon.length;
  centroidY /= polygon.length;

  // Calculate expanded points
  let expandedPolygon = [];
  for (let i = 0; i < polygon.length; i++) {
    let vectorX = polygon[i][0] - centroidX;
    let vectorY = polygon[i][1] - centroidY;
    let expandedX = centroidX + vectorX * expansionFactor;
    let expandedY = centroidY + vectorY * expansionFactor;
    expandedPolygon.push([expandedX, expandedY]);
  }

  return expandedPolygon;
}
