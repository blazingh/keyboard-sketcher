import { primitives, booleans, hulls, extrusions, expansions } from '@jscad/modeling'
/* @ts-ignore */
import stlSerializer from '@jscad/stl-serializer'
import { Geom2, Geom3 } from '@jscad/modeling/src/geometries/types';

const plateThickness = 3
const switchGruveThickness = 1.5
const switchSize = 14
const switchPadding = 7
const caseThickness = 4
const standoffThickness = plateThickness

const caseTopRadius = Math.max(caseThickness / 2, 0)
const caseTopMargin = Math.max(plateThickness + caseTopRadius, 5)
const caseBottomMargin = Math.max(standoffThickness, 9)

const tolenrence = {
  tight: 0.225
}

self.onmessage = async event => {
  const data = await JSON.parse(event.data)
  let nodes = data.nodes.filter((node: any) => node.type === "switch")
  nodes = nodes.map((node: any) => {
    return {
      ...node,
      position: { x: node.position.x / 10, y: node.position.y / 10 },
    }
  })

  const geoToAdd: Geom2[] = []
  // generate a 2d geometry for each switch
  nodes.map((node: any) => {
    geoToAdd.push(
      primitives.rectangle({
        size: [(switchSize + switchPadding) * 2, (switchSize + switchPadding) * 2],
        center: [node.position.x, node.position.y],
      })
    )
  })

  // joint all 2d geometries into a plate
  let base_plate = booleans.union(geoToAdd) as Geom2 || null
  // shrink the edges of the plate
  base_plate = expansions.offset({ delta: (-switchSize) / 2 }, base_plate)

  // extrude the plate to a 3d geometry
  let base_plate_3d = extrusions.extrudeLinear({ height: plateThickness }, base_plate)

  const case_corners: Geom3[] = []
  // generate the sides of the case from the sides of the plate
  expansions.offset({ delta: tolenrence.tight }, base_plate).sides.map((points) => {
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

  const case_standoffs: Geom3[] = []
  expansions.offset({ delta: tolenrence.tight - switchPadding / 4 }, base_plate).sides.map((points) => {
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

  // generate the wall of the case from it's edges
  const base_case_3d = booleans.union(
    hulls.hullChain(case_corners),
    hulls.hullChain(case_standoffs),
  )

  // cut the switches holes and gruves from the plate
  nodes.map((node: any) => {
    base_plate_3d = booleans.subtract(
      base_plate_3d,
      primitives.cuboid({
        size: [switchSize, switchSize, plateThickness],
        center: [node.position.x, node.position.y, plateThickness / 2]
      }),
      primitives.cuboid({
        size: [switchSize / 2, switchSize + 2, plateThickness - switchGruveThickness],
        center: [node.position.x, node.position.y, (plateThickness - switchGruveThickness) / 2]
      })
    )
  })

  // temp: join the case and the plate
  base_plate_3d = booleans.union(base_plate_3d, base_case_3d)

  // serialize the generated geometries into stl blob
  const rawData = stlSerializer.serialize({ binary: true }, base_plate_3d)
  // return the result
  self.postMessage({ rawData: rawData, id: data.id });
};

export { };
