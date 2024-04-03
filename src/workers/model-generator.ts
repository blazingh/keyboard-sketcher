import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'
/* @ts-ignore */
import stlSerializer from '@jscad/stl-serializer'
import { Geom2, Geom3 } from '@jscad/modeling/src/geometries/types';
import { getNodesBorderPoints } from '@/lib/hull-nodes';

const plateThickness = 3
const switchGruveThickness = 1.5
const switchSize = 14
const switchPadding = 13
const caseThickness = 4
const standoffThickness = plateThickness

const caseTopRadius = 0 // Math.max(caseThickness / 2, 0)
const caseTopMargin = Math.max(plateThickness + caseTopRadius, 12)
const caseBottomMargin = Math.max(standoffThickness, 9)

const tolerance = {
  tight: 0.254,
  loose: 0.508
}

type WorkerMessageData = {
  nodes: Node[]
  id: number
}

self.onmessage = async (e: MessageEvent<WorkerMessageData>) => {
  let switch_nodes = e.data.nodes.filter((node: any) => node.type === "switch")
  let mcu_nodes = e.data.nodes.filter((node: any) => node.type === "mcu")

  switch_nodes = switch_nodes.map((node: any) => {
    return {
      ...node,
      rotation: node.data.rotation,
      position: { x: node.position.x / 10, y: node.position.y / 10 },
    }
  })

  mcu_nodes = mcu_nodes.map((node: any) => {
    return {
      ...node,
      rotation: node.data.rotation,
      position: { x: node.position.x / 10, y: node.position.y / 10 },
      width: node.data.width / 10,
      height: node.data.height / 10
    }
  })

  const BP = getNodesBorderPoints(e.data.nodes as any)
  const sides: number[][][] = []

  BP.map((point, index) => {
    if (index == BP.length - 1) return
    sides.push([point, BP[index + 1]])
  })

  let base_plate = transforms.scale([0.1, 0.1, 1], geometries.geom2.create(sides as any))

  // extrude the plate to a 3d geometry
  let base_plate_3d = extrusions.extrudeLinear({ height: plateThickness }, base_plate)

  const case_corners: Geom3[] = []
  const case_bottoms: Geom3[] = []
  // generate the sides of the case from the sides of the plate
  expansions.offset({ delta: tolerance.tight + caseThickness / 2 }, base_plate).sides.map((points) => {
    case_bottoms.push(
      primitives.roundedCylinder({
        radius: caseThickness / 2,
        height: 3,
        roundRadius: 0,
        center: [points[0][0], points[0][1], -caseBottomMargin - 1.5],
        segments: 30
      }),
    )
    case_corners.push(
      booleans.union(
        primitives.roundedCylinder({
          radius: caseThickness / 2,
          height: caseTopMargin,
          roundRadius: caseTopRadius,
          center: [points[0][0], points[0][1], caseTopMargin / 2],
          segments: 30
        }),
        primitives.roundedCylinder({
          radius: caseThickness / 2,
          height: caseBottomMargin,
          roundRadius: 0,
          center: [points[0][0], points[0][1], caseBottomMargin / -2],
          segments: 30
        }),
      )
    )
  })
  case_corners.push(case_corners[0])
  case_bottoms.push(case_bottoms[0])

  const case_standoffs: Geom3[] = []
  expansions.offset({ delta: tolerance.tight - standoffThickness / 2 + caseThickness / 2 }, base_plate).sides.map((points) => {
    case_standoffs.push(
      primitives.cylinderElliptic({
        height: standoffThickness,
        startRadius: [0, 0],
        endRadius: [standoffThickness * 0.75, standoffThickness * 0.75],
        center: [points[0][0], points[0][1], standoffThickness / -2],
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
      -caseBottomMargin - plateThickness,
      extrusions.extrudeLinear({ height: plateThickness },
        expansions.offset({
          delta: tolerance.tight + caseThickness / 2
        },
          base_plate
        )
      )
    )
  )

  // cut the mcu from the case
  mcu_nodes.map((node: any) => {
    base_case_3d = booleans.subtract(
      base_case_3d,
      transforms.translate(
        [node.position.x, node.position.y, -caseBottomMargin + 1],
        transforms.rotateZ(
          utils.degToRad(node.rotation),
          primitives.cuboid({
            size: [node.width + (tolerance.loose + tolerance.tight) * 2, node.height + (tolerance.loose + tolerance.tight) * 2, 5],
            center: [0, 0, 0]
          })
        )
      )
    )
  })

  // cut the switches holes and gruves from the plate
  switch_nodes.map((node: any) => {
    base_plate_3d = booleans.subtract(
      base_plate_3d,
      transforms.translate(
        [node.position.x, node.position.y, plateThickness / 2],
        transforms.rotateZ(
          utils.degToRad(node.rotation),
          primitives.cuboid({
            size: [switchSize, switchSize, plateThickness],
            center: [0, 0, 0]
          })
        )
      ),
      transforms.translate(
        [node.position.x, node.position.y, (plateThickness - switchGruveThickness) / 2],
        transforms.rotateZ(
          utils.degToRad(node.rotation),
          primitives.cuboid({
            size: [switchSize + 2, switchSize + 2, plateThickness - switchGruveThickness],
            center: [0, 0, 0]
          })
        )
      )
    )
  })

  const plateStlData = stlSerializer.serialize(
    { binary: true },
    transforms.mirrorY(base_plate_3d)
  )

  const caseStlData = stlSerializer.serialize(
    { binary: true },
    transforms.mirrorY(base_case_3d)
  )

  const previewStlData = stlSerializer.serialize(
    { binary: true },
    booleans.union(
      transforms.mirrorY(base_case_3d),
      transforms.translateZ(
        (caseTopMargin + caseBottomMargin) * 2,
        transforms.mirrorY(base_plate_3d),
      )
    )
  )

  // return the result
  self.postMessage({
    plateStlData,
    caseStlData,
    previewStlData,
    id: e.data.id
  });
};

export { };
