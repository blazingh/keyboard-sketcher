"use client"

import { EditorStoreType, Node, useEditorStore } from '../stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { cn } from "@/lib/utils";
import { normalizeAngle } from '../lib/nodes-utils';
import { PointerAcitonStore } from '../stores/pointer-actions-store';
import { useTransformContext } from 'react-zoom-pan-pinch';


const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
  toggleActiveNode: state.toggleActiveNode,
  clearActiveNodes: state.clearActiveNodes,
  moveActiveNodes: state.moveActiveNodes,
  addActiveNode: state.addActiveNode,

  activeDisplacement: state.activeDisplacement,
  setActiveDisplacement: state.setActiveDisplacement,

})

export function BasicNode({
  node,
}: {
  node: Node;
}) {

  const {
    activeNodes,
    toggleActiveNode,
    clearActiveNodes,
    moveActiveNodes,
    addActiveNode,

    activeDisplacement,
    setActiveDisplacement,

  } = useEditorStore(selector)

  const { transformState: { scale } } = useTransformContext()

  const pointerAction = PointerAcitonStore()

  const nodeActive = activeNodes.includes(node.id)
  const { x, y } = node.pos
  const { x: dx, y: dy, r: dr } = activeDisplacement

  function nodeClick() {
    if (!node.selectable) return
    toggleActiveNode(node.id)
  }

  const binds = useGesture({
    onDragStart: (() => {
      // if the node is not selected, deselect othere nodes 
      if (activeNodes.length >= 1 && !nodeActive)
        clearActiveNodes()
      addActiveNode(node.id)
    }),
    onDrag: (({ movement, tap }) => {
      tap && nodeClick()
      const displacement = {
        x: Math.round((movement[0] / scale) / 10) * 10,
        y: Math.round((movement[1] / scale) / 10) * 10,
        r: 0
      }
      setActiveDisplacement(displacement)
    }),
    onDragEnd: (() => {
      // check if the node has bean moved
      if (dx === 0 && dy === 0) return
      // updated the active nodes position
      moveActiveNodes(activeDisplacement)
      // reset the active x and y displacement
      setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }),
  },
    { drag: { delay: true, threshold: 10, filterTaps: true } }
  )

  return (
    <g
      className={cn(
        "touch-none no-pan",
      )}
      width={node.size.w}
      height={node.size.h}
      transform={`translate(${(x) + (nodeActive ? dx : 0)}, ${(y) + (nodeActive ? dy : 0)}) rotate(${node.pos.r + (nodeActive ? dr : 0)})`}
      {...binds()}
    >
      <rect
        rx={5}
        x={node.size.w / -2}
        y={node.size.h / -2}
        width={node.size.w}
        height={node.size.h}
        className={cn(
          "stroke-2",
          nodeActive ? "stroke-primary" : "stroke-white/70",
          node.type === "switch" && "fill-secondary/90",
          node.type === "mcu" && "fill-green-800",
        )}
      >
      </rect>
      {node.type === "mcu" && (
        <rect
          x={-35}
          y={node.size.h / -2}
          width={70}
          height={30}
          rx={5}
          className='fill-green-950'
        >
        </rect>
      )}
      {(nodeActive && pointerAction.selectedMode === "normal") &&
        <text
          fontSize="10"
          fill="white"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {normalizeAngle(node.pos.r + dr).toFixed(1)}°
        </text>
      }
      {false && (<>
        {/*
        <text x={x} y={(y || 0) - 25} fontSize="10" fill="white">
          id: {JSON.stringify(node.id)}
        </text>
        */}
        <text x={x} y={(y || 0) - 10} fontSize="10" fill="white">
          {JSON.stringify({ ...node.pos })}
        </text>
      </>)}
    </g>
  );
}
