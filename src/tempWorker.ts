import { primitives, booleans, hulls, extrusions, expansions } from '@jscad/modeling'
/* @ts-ignore */
import stlSerializer from '@jscad/stl-serializer'
import { Geom2, Geom3 } from '@jscad/modeling/src/geometries/types';

self.onmessage = async event => {
  const nodes = (await JSON.parse(event.data)).nodes
  let base_plate: Geom2 | null = null
  nodes.map((node: any) => {
    if (node.type === 'switch') {
      if (base_plate === null)
        base_plate = booleans.union(
          primitives.rectangle({
            size: [420, 420],
            center: [node.position.x, node.position.y],
          }))
      else
        base_plate = booleans.union(
          base_plate,
          primitives.rectangle({
            size: [420, 420],
            center: [node.position.x, node.position.y],
          }))
    }
  })
  if (base_plate === null) return
  base_plate = expansions.offset({ delta: -105 }, base_plate)
  let base_plate_3d = extrusions.extrudeLinear({ height: 30 }, base_plate)
  const case_corners: Geom3[] = []
  expansions.offset({ delta: 22 }, base_plate as Geom2).sides.map((points) => {
    case_corners.push(booleans.union(
      primitives.roundedCylinder({ radius: 20, height: 75, roundRadius: 20, center: [points[0][0], points[0][1], 0], segments: 30 }),
      primitives.roundedCylinder({ radius: 20, height: 75, roundRadius: 5, center: [points[0][0], points[0][1], -55], segments: 30 }),
    ))
  })
  case_corners.push(case_corners[0])
  const _case = hulls.hullChain(...case_corners)
  base_plate_3d = booleans.union(base_plate_3d, _case)
  nodes.map((node: any) => {
    if (node.type === 'switch') {
      base_plate_3d = booleans.subtract(base_plate_3d, primitives.cuboid({ size: [140, 140, 30], center: [node.position.x, node.position.y, 15] }))
      base_plate_3d = booleans.subtract(base_plate_3d, primitives.cuboid({ size: [70, 160, 30], center: [node.position.x, node.position.y, 0] }))
    }
  })
  const rawData = stlSerializer.serialize({ binary: true }, base_plate_3d)
  self.postMessage(rawData);
};

export { };
