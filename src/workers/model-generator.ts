import _ from "lodash"
import { primitives, booleans, hulls, extrusions, expansions, transforms, utils, geometries } from '@jscad/modeling'
import { Geom3 } from '@jscad/modeling/src/geometries/types';
import { ModelWorkerResult } from './model-a-options';
import { Node } from '@/components/editor/stores/editor-store';
import { getNodesOutinePoints } from '@/components/editor/lib/nodes-ouline-points';
import { Vec3 } from "@jscad/modeling/src/maths/vec3";


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

  mcuHeight: 1.5
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
  size: { w: number, h: number, p: number }
}

self.onmessage = async (e: MessageEvent<WorkerMessageData>) => {

  const initialOptions: typeof defaultOptions = _.merge({}, defaultOptions, e.data.options);

  // make sure all data are floats numbers
  const o = _.mapValues(initialOptions, (value) => typeof value === 'string' ? parseFloat(value) : value);

  // limit the options values
  o.baseThickness = Math.max(o.baseThickness, 2);
  o.plateThickness = Math.max(o.plateThickness, 1.5);
  o.wallHeight = Math.max(o.baseThickness + o.plateHeight + o.plateThickness, o.wallHeight);
  o.wallThickness = Math.max(o.wallThickness, 2);
  o.wallRadius = Math.min(o.wallThickness / 2, o.wallRadius);
  o.wallSwitchPadding = Math.max(o.wallSwitchPadding, 3);

  let switch_nodes: SimpleNode[] = [];
  let mcu_nodes: SimpleNode[] = [];

  // extract and sipmlify the nodes
  _.forEach(e.data.nodes, (node: Node) => {
    const simpleNode: SimpleNode = {
      type: node.type,
      position: { x: node.pos.x / 10, y: node.pos.y / 10, r: node.pos.r },
      size: { w: node.size.w / 10, h: node.size.h / 10, p: node.size.p / 10 }
    };
    if (node.type === 'switch') switch_nodes.push(simpleNode);
    if (node.type === 'mcu') mcu_nodes.push(simpleNode);
  });

  const sides: number[][][] = [];
  const borderPoints = getNodesOutinePoints(e.data.nodes as any, {
    wallSwitchPadding: o.wallSwitchPadding * 10,
    wallWidth: o.wallThickness * 10
  });

  _.forEach(borderPoints, (point, index) => {
    if (index === borderPoints.length - 1)
      sides.push([point, borderPoints[0]]);
    else
      sides.push([point, borderPoints[index + 1]]);
  });

  // 2d representation of the switch plate
  let base_plate = transforms.scale([0.1, 0.1, 1], geometries.geom2.create(sides as any));

  // extrude the plate to a 3d geometry
  let base_plate_3d = extrusions.extrudeLinear({ height: o.plateThickness }, base_plate);

  // function will be used in wall creation
  const createWallCylinder = (x: number, y: number) => primitives.roundedCylinder({
    radius: o.wallThickness / 2,
    height: o.wallHeight,
    roundRadius: o.wallRadius,
    center: [x, y, o.wallHeight / 2],
    segments: 30
  });

  // function will be used in wall creation
  const createWallBottom = (x: number, y: number) => primitives.roundedCylinder({
    radius: o.wallThickness / 2,
    height: o.wallRadius * 2,
    roundRadius: 0,
    center: [x, y, o.wallRadius],
    segments: 30
  });

  // generate the case walls
  const wallsSides = expansions.offset({ delta: tolerance.tight + o.wallThickness / 2 }, base_plate).sides
  const case_corners = wallsSides.map(points => booleans.union(
    createWallCylinder(points[0][0], points[0][1]),
    createWallBottom(points[0][0], points[0][1])
  ));
  case_corners.push(case_corners[0]);
  const case_walls = hulls.hullChain(case_corners)

  // generate plate standoff
  const standoffSides = expansions.offset({ delta: tolerance.tight - o.standoffThickness / 2 + o.wallThickness / 2 }, base_plate).sides
  const case_standoff_corners = standoffSides.map(points => primitives.cylinderElliptic({
    height: o.standoffThickness,
    startRadius: [0, 0],
    endRadius: [o.standoffThickness * 0.75, o.standoffThickness * 0.75],
    center: [points[0][0], points[0][1], o.standoffThickness / -2 + o.baseThickness + o.plateHeight]
  }));
  case_standoff_corners.push(case_standoff_corners[0]);
  const case_standoffs = hulls.hullChain(case_standoff_corners);

  // generate case botton base
  const case_base = extrusions.extrudeLinear(
    { height: o.baseThickness },
    expansions.offset({ delta: tolerance.tight + o.wallThickness / 2 }, base_plate)
  )

  // merge walls, standoffs and base to form the plate 
  let base_case_3d = booleans.union(
    case_walls,
    case_standoffs,
    case_base
  );

  _.forEach(mcu_nodes, (node) => {
    const [w, h] = [node.size.w + tolerance.tight * 2, node.size.h + tolerance.tight * 2 + 1]
    // cut the mcu from the case
    base_case_3d = booleans.subtract(
      base_case_3d,
      transforms.translate(
        [node.position.x, node.position.y, o.mcuHeight],
        transforms.rotateZ(
          utils.degToRad(node.position.r),
          booleans.subtract(
            booleans.union(
              transforms.translate(
                [0, 0, 4],
                primitives.cuboid({
                  size: [w, h, 8],
                  center: [0, 0, 0]
                })
              ),
              hulls.hull(
                transforms.translate(
                  [2.65, h / -2 - o.wallThickness / 2, 2.5 + 1],
                  transforms.rotate(
                    [utils.degToRad(90), 0, 0],
                    primitives.cylinder({
                      radius: 2.5,
                      height: o.wallThickness,
                      center: [0, 0, 0],
                      segments: 30
                    }),
                  )
                ),
                transforms.translate(
                  [-2.65, h / -2 - o.wallThickness / 2, 2.5 + 1],
                  transforms.rotate(
                    [utils.degToRad(90), 0, 0],
                    primitives.cylinder({
                      radius: 2.5,
                      height: o.wallThickness,
                      center: [0, 0, 0],
                      segments: 30
                    }),
                  )
                )
              )
            ),
            transforms.translate(
              [w / 2, h / -2 + o.wallThickness, 8],
              transforms.rotate(
                [0, utils.degToRad(45), 0],
                primitives.cuboid({
                  size: [4, o.wallThickness * 2, 4],
                  center: [0, 0, 0]
                })
              )
            ),
            transforms.translate(
              [w / -2, h / -2 + o.wallThickness, 8],
              transforms.rotate(
                [0, utils.degToRad(45), 0],
                primitives.cuboid({
                  size: [4, o.wallThickness * 2, 4],
                  center: [0, 0, 0]
                })
              )
            )
          )
        )
      )
    );
  });

  _.forEach(switch_nodes, (node) => {
    // cut switches from case
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
    );
    // cut switches from plate
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
      // switch groove cutout
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
    );
  });

  // position the plate of the correct heigth
  base_plate_3d = transforms.translateZ(o.baseThickness + o.plateHeight, base_plate_3d);

  const geoms: ModelWorkerResult["geometries"] = [
    {
      id: 1,
      label: 'Plate',
      geom: transforms.mirrorY(base_plate_3d)
    },
    {
      id: 2,
      label: 'Case',
      geom: transforms.mirrorY(base_case_3d)
    }
  ];

  // return the result
  self.postMessage({
    geoms,
    id: e.data.id
  });

};


export { };
