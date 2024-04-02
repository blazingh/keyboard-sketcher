import { getNodesBorderPoints } from "@/lib/hull-nodes";
import { useRef, useMemo, useEffect, useContext, useState } from "react";
import { useNodes } from "reactflow";
/* @ts-ignore */
import Offset from "polygon-offset";
import { workSpaceOptionsContext } from "@/contexts/workspace";

export function Outline() {
  const nodes = useNodes();
  const ref = useRef<any>(!null)

  const [cleared, setCleared] = useState(false)

  const wsc = useContext(workSpaceOptionsContext)

  const points = useMemo(() => {
    if (wsc?.options.renderOuline === false) return { inner: [], outer: [] }
    const basePoints = getNodesBorderPoints(nodes, 130 / 2)
    const offset = new Offset()
    return {
      inner: basePoints,
      outer: offset.data(basePoints).margin(35)[0]
    }
  }, [nodes, wsc?.options.renderOuline])

  useEffect(() => {
    if (wsc?.options.renderOuline === false && cleared) return
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (wsc?.options.renderOuline === false && !cleared) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCleared(true)
      return
    }
    if (wsc?.options.renderOuline && cleared) {
      setCleared(false)
    }
    console.log(cleared, wsc?.options)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Connect points with lines from the second array
    ctx.strokeStyle = 'white'; // Set line color (adjust as needed)
    ctx.lineWidth = 1; // Set line width (adjust as needed)
    ctx.beginPath(); // Start a new path for lines
    points.inner.forEach(([x1, y1]: any, index: number) => {
      if (index > 0) { // Skip the first point to avoid starting without a previous point
        const [x2, y2] = points.inner[index - 1] as any; // Get previous point coordinates
        ctx.moveTo(x2 + canvas.width * 0.5, y2 + canvas.width * 0.5); // Move to previous point
        ctx.lineTo(x1 + canvas.width * 0.5, y1 + canvas.width * 0.5); // Draw line to current point
      }
    });
    points.outer.forEach(([x1, y1]: any, index: number) => {
      if (index > 0) { // Skip the first point to avoid starting without a previous point
        const [x2, y2] = points.outer[index - 1] as any; // Get previous point coordinates
        ctx.moveTo(x2 + canvas.width * 0.5, y2 + canvas.width * 0.5); // Move to previous point
        ctx.lineTo(x1 + canvas.width * 0.5, y1 + canvas.width * 0.5); // Draw line to current point
      }
    });
    ctx.stroke(); // Draw all lines
  }, [points, cleared]);

  return (
    <div className='w-[4000px] h-[4000px]'>
      <canvas className='w-full h-full' ref={ref} width={4000} height={4000}>
      </canvas>
    </div>
  )
}
