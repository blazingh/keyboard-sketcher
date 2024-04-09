import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'
import { Geom3 } from '@jscad/modeling/src/geometries/types';
import { getNodesBorderPoints } from '@/lib/hull-nodes';

const defaultOptions = {
  switchGruveThick: 1.5,
  standoffThick: 3,

  plateThick: 3,
  wallThick: 4,
  caseTopMargin: 0,
  caseBottomMargin: 10,
  caseTopRadius: 0,
}

export const modelOptions: {
  id: number
  label: string,
  description: string,
  type: "number",
}[] = [
    {
      id: 1,
      label: "Plate Thickness",
      description: "the thickness of the switchs plate",
      type: "number"
    },
    {
      id: 2,
      label: "Case Walls Thickness",
      description: "case walls thickness",
      type: "number"
    },
    {
      id: 3,
      label: "Case Top height",
      description: "how much the case will extrude above the plate",
      type: "number"
    },
    {
      id: 4,
      label: "Case bottom height",
      description: "how much the case will extrude under the plate and the plate standoff",
      type: "number"
    },
    {
      id: 5,
      label: "Case top roundness",
      description: "how round will the top of case walls be.the value can not be higher than the case wall thickness",
      type: "number"
    },
  ]

const tolerance = {
  tight: 0.254,
  loose: 0.508
}

export type ModelWorkerResult = {
  id: number
  geometries: {
    id: number
    label: string
    geom: any
  }[]
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

  // limit the options values
  o.caseTopMargin = Math.max(o.plateThick + o.caseTopRadius, o.caseTopMargin)
  o.caseBottomMargin = Math.max(o.standoffThick, o.caseBottomMargin)
  o.caseTopRadius = Math.min(o.wallThick / 2, o.caseTopRadius)

  const nodes: SimpleNode[] = e.data.nodes.map((node: any) => {
    return {
      type: node.type,
      position: { x: node.position.x / 10, y: node.position.y / 10, r: node.data.rotation },
      size: { w: node.data.width / 10, h: node.data.height / 10 }
    }
  })

  const switch_nodes = nodes.filter((node: any) => node.type === "switch")
  const mcu_nodes = nodes.filter((node: any) => node.type === "mcu")

  const borderPoints = getNodesBorderPoints(e.data.nodes as any)
  const sides: number[][][] = []

  borderPoints.map((point, index) => {
    if (index == borderPoints.length - 1) return
    sides.push([point, borderPoints[index + 1]])
  })

  let base_plate = transforms.scale([0.1, 0.1, 1], geometries.geom2.create(sides as any))

  // extrude the plate to a 3d geometry
  let base_plate_3d = extrusions.extrudeLinear({ height: o.plateThick }, base_plate)

  const case_corners: Geom3[] = []
  const case_bottoms: Geom3[] = []
  // generate the sides of the case from the sides of the plate
  expansions.offset({ delta: tolerance.tight + o.wallThick / 2 }, base_plate).sides.map((points) => {
    case_bottoms.push(
      primitives.roundedCylinder({
        radius: o.wallThick / 2,
        height: 3,
        roundRadius: 0,
        center: [points[0][0], points[0][1], -o.caseBottomMargin - 1.5],
        segments: 30
      }),
    )
    case_corners.push(
      booleans.union(
        primitives.roundedCylinder({
          radius: o.wallThick / 2,
          height: o.caseTopMargin,
          roundRadius: o.caseTopRadius,
          center: [points[0][0], points[0][1], o.caseTopMargin / 2],
          segments: 30
        }),
        primitives.roundedCylinder({
          radius: o.wallThick / 2,
          height: o.caseBottomMargin,
          roundRadius: 0,
          center: [points[0][0], points[0][1], o.caseBottomMargin / -2],
          segments: 30
        }),
      )
    )
  })
  case_corners.push(case_corners[0])
  case_bottoms.push(case_bottoms[0])

  const case_standoffs: Geom3[] = []
  expansions.offset({ delta: tolerance.tight - o.standoffThick / 2 + o.wallThick / 2 }, base_plate).sides.map((points) => {
    case_standoffs.push(
      primitives.cylinderElliptic({
        height: o.standoffThick,
        startRadius: [0, 0],
        endRadius: [o.standoffThick * 0.75, o.standoffThick * 0.75],
        center: [points[0][0], points[0][1], o.standoffThick / -2],
      })
    )
  })
  case_standoffs.push(case_standoffs[0])

  // generate the walls and floor of the case from it's edges
  let base_case_3d = booleans.union(
    hulls.hullChain(case_corners),
    hulls.hullChain(case_standoffs),
    hulls.hullChain(case_bottoms),
    transforms.translateZ(
      -o.caseBottomMargin - o.plateThick,
      extrusions.extrudeLinear({ height: o.plateThick },
        expansions.offset({
          delta: tolerance.tight + o.wallThick / 2
        },
          base_plate
        )
      )
    )
  )

  // cut the mcu from the case
  mcu_nodes.map((node) => {
    base_case_3d = booleans.subtract(
      base_case_3d,
      transforms.translate(
        [node.position.x, node.position.y, -o.caseBottomMargin + 1],
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

  // cut the switches holes and gruves from the plate
  switch_nodes.map((node) => {
    base_plate_3d = booleans.subtract(
      base_plate_3d,
      transforms.translate(
        [node.position.x, node.position.y, o.plateThick / 2],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w, node.size.h, o.plateThick],
            center: [0, 0, 0]
          })
        )
      ),
      transforms.translate(
        [node.position.x, node.position.y, (o.plateThick - o.switchGruveThick) / 2],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          primitives.cuboid({
            size: [node.size.w + 2, node.size.h + 2, o.plateThick - o.switchGruveThick],
            center: [0, 0, 0]
          })
        )
      )
    )
  })

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
