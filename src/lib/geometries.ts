import { Geom3 } from "@jscad/modeling/src/geometries/types"
import { BufferAttribute, BufferGeometry, Color, InstancedMesh, Line, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial, NormalBufferAttributes } from "three"

export function CSG2Geom(csg: Geom3): BufferGeometry<NormalBufferAttributes> {

  const vertices: number[] = []
  const indices: number[] = []
  let idx = 0

  const pointAdd = (v: any) => {
    if (v.index === undefined) {
      v.index = idx++
      vertices.push(v[0], v[1], v[2] || 0)
    }
  }

  for (let poly of csg.polygons) {
    let arr = poly.vertices as any[]
    arr.forEach(pointAdd)
    let first = arr[0].index
    for (let i = 2; i < arr.length; i++) {
      indices.push(first, arr[i - 1].index, arr[i].index)
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
  geo.setIndex(indices)

  return geo;
}
