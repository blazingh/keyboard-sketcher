import { useMemo } from "react";
import { Node } from "./stores/editor-store";
import { getNodesOutinePoints } from "./lib/nodes-ouline-points";

export function NodesOutline({
  nodes,
}: {
  nodes: Node[]
}) {

  const points = useMemo(() => {
    if (nodes.length < 1) return { inner: [], outer: [] }
    const basePoints = getNodesOutinePoints(nodes, 40)
    const offsetPoints = getNodesOutinePoints(nodes, 40 + 50)
    return {
      inner: basePoints,
      outer: offsetPoints
    }
  }, [nodes])

  return (
    <>
      <polygon
        id="Nodes-Ouline-Inner"
        className="stroke-white/70 stroke-2 fill-transparent"
        points={points.inner.map((c) => [c[0], c[1]].join(" ")).join(" ")}
      />
      <polygon
        id="Nodes-Ouline-Outer"
        className="stroke-white/70 stroke-2 fill-transparent"
        points={points.outer.map((c) => [c[0], c[1]].join(" ")).join(" ")}
      />
    </>
  )
}
