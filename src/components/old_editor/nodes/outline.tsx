import { getNodesBorderPoints } from "@/lib/hull-nodes";
import { useRef, useMemo, useEffect, useContext, useState } from "react";
import { useNodes } from "reactflow";
/* @ts-ignore */
import Offset from "polygon-offset";
import { workSpaceContext } from "@/contexts/workspace-context";
import { ModelContext } from "@/contexts/model-context";

export function Outline() {
  const nodes = useNodes();

  const model = useContext(ModelContext)
  const wsc = useContext(workSpaceContext)

  const polyInnerRef = useRef<any>()
  const polyOuterRef = useRef<any>()

  const [cleared, setCleared] = useState(false)

  const points = useMemo(() => {
    if (wsc?.options.renderOuline === false) return { inner: [], outer: [] }
    const basePoints = getNodesBorderPoints(nodes, 140 / 2, (model?.selectedOptions.options.wallThick || 3.5) * 10)
    const offset = new Offset()
    return {
      inner: basePoints,
      outer: (model?.selectedOptions.options.wallThick || 0) > 0
        ? offset.data(basePoints).margin((model?.selectedOptions.options.wallThick || 3.5) * 10)[0]
        : []
    }
  }, [nodes, wsc?.options.renderOuline, model])


  useEffect(() => {
    if (!wsc?.options.renderOuline) {
      if (cleared) return
      polyInnerRef?.current?.setAttribute("points", [])
      polyOuterRef?.current?.setAttribute("points", [])
      setCleared(true)
      return
    } else if (cleared)
      setCleared(false)

    polyInnerRef?.current?.setAttribute("points", points.inner.map((c) => [c[0] + 2500, c[1] + 2500].join(" ")).join(" "));
    polyOuterRef?.current?.setAttribute("points", points.outer.map((c: any) => [c[0] + 2500, c[1] + 2500].join(" ")).join(" "));

  }, [points, cleared, wsc?.options.renderOuline]);

  return (
    <div style={{ width: 5000, height: 5000 }}>
      <svg width={5000} height={5000} viewBox="0 0 5000 5000">
        <polygon className="stroke-white stroke-2 fill-transparent" width={5000} height={5000} ref={polyInnerRef} />
        <polygon className="stroke-white stroke-2 fill-transparent" width={5000} height={5000} ref={polyOuterRef} />
      </svg>
    </div>
  )
}
