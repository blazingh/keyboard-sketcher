import { useMemo } from "react";
/* @ts-ignore */
import Offset from "polygon-offset";
import { Node } from "./editor-store";
import { getNodesOutinePoints } from "./lib/nodes-ouline-points";

export function NodesOutline({
  nodes,
}: {
  nodes: Node[]
}) {

  const points = useMemo(() => {
    if (nodes.length < 1) return { inner: [], outer: [] }
    const basePoints = getNodesOutinePoints(nodes, 140 / 2, 35)
    const offset = new Offset()
    return {
      inner: basePoints,
      outer: offset.data(basePoints).margin(35)[0] as [number, number][]
    }
  }, [nodes])

  return (
    <>
      <polygon
        id="Nodes-Ouline-Inner"
        className="stroke-white stroke-2 fill-transparent"
        points={points.inner.map((c) => [c[0], c[1]].join(" ")).join(" ")}
      />
      <polygon
        id="Nodes-Ouline-Outer"
        className="stroke-white stroke-2 fill-transparent"
        points={points.outer.map((c) => [c[0], c[1]].join(" ")).join(" ")}
      />
    </>
  )
}
