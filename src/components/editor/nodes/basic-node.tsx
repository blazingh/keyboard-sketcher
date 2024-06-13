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
      className="touch-none no-pan"
      transform={`translate(${nodeActive ? dx : 0}, ${nodeActive ? dy : 0})`}
      style={{
      }}
      {...binds()}
    >
      <rect
        x={x - node.size.w / 2}
        y={y - node.size.h / 2}
        rx={5}
        width={node.size.w}
        height={node.size.h}
        className={cn(
          "fill-secondary stroke-2",
          nodeActive ? "stroke-primary" : "stroke-white/70",
        )}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `rotate(${node.pos.r + (nodeActive ? dr : 0)}deg)`
        }}
      >
      </rect>
      {(nodeActive && pointerAction.selectedMode === "normal") &&
        <text
          x={x}
          y={y}
          fontSize="10"
          fill="white"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {normalizeAngle(node.pos.r + dr)}°
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
