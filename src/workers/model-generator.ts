import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'
import { Geom3 } from '@jscad/modeling/src/geometries/types';
import { ModelWorkerResult } from './model-a-options';
import { Node } from '@/components/editor/stores/editor-store';
import { getNodesOutinePoints } from '@/components/editor/lib/nodes-ouline-points';


const defaultOptions = {
  baseThickness: 3,
  switchGruveThickness: 1.5,

  plateHeight: 9,
  plateThickness: 3,

  wallHeight: 12,
  wallThickness: 4,
  wallRadius: 2,

  standoffThickness: 3,
  wallSwitchPadding: 4,
}

const tolerance = {
  tight: 0.254,
  loose: 0.508
}

type WorkerMessageData = {
  id: number
  nodes: Node[]
  options?: {
    plateThick?: number,
    wallThick?: number,
    caseTopMargin?: number,
    caseBottomMargin?: number,
    caseTopRadius?: number,
  }
}

type SimpleNode = {
  type: "switch" | "mcu"
  position: { x: number, y: number, r: number }
  size: { w: number, h: number }
}

self.onmessage = async (e: MessageEvent<WorkerMessageData>) => {

  const o: typeof defaultOptions = e.data.options ? { ...defaultOptions, ...e.data.options } : defaultOptions

  // make sure all data are floats numbers
  o.baseThickness = parseFloat(o.baseThickness as any)
  o.plateThickness = parseFloat(o.plateThickness as any)
  o.plateHeight = parseFloat(o.plateHeight as any)
  o.wallThickness = parseFloat(o.wallThickness as any)
  o.wallSwitchPadding = parseFloat(o.wallSwitchPadding as any)
  o.wallHeight = parseFloat(o.wallHeight as any)
  o.wallRadius = parseFloat(o.wallRadius as any)

  // limit the options values
  o.baseThickness = Math.max(o.baseThickness, 2)
  o.plateThickness = Math.max(o.plateThickness, 1.5)
  o.wallHeight = Math.max(o.baseThickness + o.plateHeight + o.plateThickness, o.wallHeight)
  o.wallThickness = Math.max(o.wallThickness, 2)
  o.wallRadius = Math.min(o.wallThickness / 2, o.wallRadius)
  o.wallSwitchPadding = Math.max(o.wallSwitchPadding, 3)

  // extract the nodes
  const nodes: SimpleNode[] = e.data.nodes.map((node: Node) => {
    return {
      type: node.type,
      position: { x: node.pos.x / 10, y: node.pos.y / 10, r: node.pos.r },
      size: { w: node.size.w / 10, h: node.size.h / 10, p: node.size.p }
    }
  })

  const switch_nodes = nodes.filter((node: any) => node.type === "switch")
  const mcu_nodes = nodes.filter((node: any) => node.type === "mcu")

  const borderPoints = getNodesOutinePoints(e.data.nodes as any, {
    wallSwitchPadding: o.wallSwitchPadding * 10,
    wallWidth: o.wallThickness * 10
  })
  const sides: number[][][] = []

  borderPoints.map((point, index) => {
    if (index == borderPoints.length - 1)
      sides.push([point, borderPoints[0]])
    else
      sides.push([point, borderPoints[index + 1]])
  })

  let base_plate = transforms.scale([0.1, 0.1, 1], geometries.geom2.create(sides as any))

  // extrude the plate to a 3d geometry
  let base_plate_3d = extrusions.extrudeLinear({ height: o.plateThickness }, base_plate)

  const case_corners: Geom3[] = []

  // generate the sides of the case from the sides of the plate
  expansions.offset({ delta: tolerance.tight + o.wallThickness / 2 }, base_plate).sides.map((points) => {
    case_corners.push(
      booleans.union(
        //wall
        primitives.roundedCylinder({
          radius: o.wallThickness / 2,
          height: o.wallHeight,
          roundRadius: o.wallRadius,
          center: [points[0][0], points[0][1], o.wallHeight / 2],
          segments: 30
        }),
        // wall bottom part for flatness
        primitives.roundedCylinder({
          radius: o.wallThickness / 2,
          height: o.wallRadius * 2,
          roundRadius: 0,
          center: [points[0][0], points[0][1], o.wallRadius],
          segments: 30
        }),
      )
    )
  })
  case_corners.push(case_corners[0])

  const case_standoffs: Geom3[] = []
  expansions.offset({ delta: tolerance.tight - o.standoffThickness / 2 + o.wallThickness / 2 }, base_plate).sides.map((points) => {
    case_standoffs.push(
      primitives.cylinderElliptic({
        height: o.standoffThickness,
        startRadius: [0, 0],
        endRadius: [o.standoffThickness * 0.75, o.standoffThickness * 0.75],
        center: [points[0][0], points[0][1], o.standoffThickness / -2 + o.baseThickness + o.plateHeight],
      })
    )
  })
  case_standoffs.push(case_standoffs[0])

  // generate the walls and floor of the case from it's edges
  let base_case_3d = booleans.union(
    // walls
    hulls.hullChain(case_corners),
    // plate standoff
    hulls.hullChain(case_standoffs),
    //base
    extrusions.extrudeLinear(
      { height: o.baseThickness },
      expansions.offset({ delta: tolerance.tight + o.wallThickness / 2 },
        base_plate
      )
    )
  )

  // switch cutout
  switch_nodes.map((node) => {
    base_case_3d = booleans.subtract(
      base_case_3d,
      transforms.translate(
        [node.position.x, node.position.y, o.baseThickness + o.plateHeight - 4.15],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w, node.size.h, 8.30],
            center: [0, 0, 0]
          })
        )
      )
    )
  })

  // cut the mcu from the case
  /*
  mcu_nodes.map((node) => {
    base_case_3d = booleans.subtract(
      base_case_3d,
      transforms.translate(
        [node.position.x, node.position.y, 1],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w + (tolerance.loose + tolerance.tight) * 2, node.size.h + (tolerance.loose + tolerance.tight) * 2, 5],
            center: [0, 0, 0]
          })
        )
      )
    )
  })
  */

  // cut the switches holes and gruves from the plate
  switch_nodes.map((node) => {
    base_plate_3d = booleans.subtract(
      base_plate_3d,
      // switch cutout
      transforms.translate(
        [node.position.x, node.position.y, o.plateThickness / 2],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w, node.size.h, o.plateThickness],
            center: [0, 0, 0]
          })
        )
      ),
      // switch gruve cutout
      transforms.translate(
        [node.position.x, node.position.y, (o.plateThickness - o.switchGruveThickness) / 2],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w + 2, node.size.h + 2, o.plateThickness - o.switchGruveThickness],
            center: [0, 0, 0]
          })
        )
      )
    )
  })

  base_plate_3d = transforms.translateZ(
    o.baseThickness + o.plateHeight,
    base_plate_3d
  )

  const geoms: ModelWorkerResult["geometries"] = [
    {
      id: 1,
      label: "Plate",
      geom: transforms.mirrorY(base_plate_3d)
    },
    {
      id: 2,
      label: "Case",
      geom: transforms.mirrorY(base_case_3d)
    },
  ]

  // return the result
  self.postMessage({
    geoms,
    id: e.data.id
  });
};

export { };
