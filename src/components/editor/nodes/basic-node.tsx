"use client"

import { EditorStoreType, Node, useEditorStore } from '../stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { cn } from "@/lib/utils";
import { RulerIcon } from "lucide-react";
import { useViewportTransformationStore } from "../stores/viewport-transformation-store";


const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
  toggleActiveNode: state.toggleActiveNode,
  clearActiveNodes: state.clearActiveNodes,
  moveActiveNodes: state.moveActiveNodes,
  addActiveNode: state.addActiveNode,

  setActiveDxy: state.setActiveDxy,
  activeDxy: state.activeDxy,

  snapLines: state.snapLines,
  updateSnapLines: state.updateSnapLines,

  resetSnapLines: state.resetSnapLines,
  rulerNodes: state.rulerNodes,
  toggleRulerNode: state.toggleRulerNode,
  editorMode: state.editorMode,
  setEditorMode: state.setEditorMode,
})

export function BasicNode({
  node,
}: {
  node: Node;
}) {

  const {
    moveActiveNodes,
    setActiveDxy,
    clearActiveNodes,
    addActiveNode,
    activeDxy,
    activeNodes,
    toggleActiveNode,
    updateSnapLines,
    resetSnapLines,
    snapLines,
    rulerNodes,
    toggleRulerNode,
    editorMode,
    setEditorMode,
    ...store
  } = useEditorStore()

  const { initViewport, transformMatrix, setTransformMatrix, TransformMatrixStyle } = useViewportTransformationStore()

  const nodeActive = activeNodes.includes(node.id)
  const nodeRuler = rulerNodes.includes(node.id)
  const { x, y } = node.pos
  const { x: dx, y: dy } = activeDxy

  function nodeClick() {
    if (editorMode === "ruler")
      toggleRulerNode(node.id)
    else
      toggleActiveNode(node.id)
  }

  const binds = useGesture({
    onDragStart: (() => {
      // if the node is not selected, deselect othere nodes 
      if (activeNodes.length >= 1 && !nodeActive)
        clearActiveNodes()
      addActiveNode(node.id)
      setEditorMode("normal")
    }),
    onDrag: (({ movement, tap }) => {
      tap && nodeClick()
      const dxy = {
        x: Math.round((movement[0] / (transformMatrix.s || 1)) / 10) * 10,
        y: Math.round((movement[1] / (transformMatrix.s || 1)) / 10) * 10
      }
      setActiveDxy(dxy)
    }),
    onDragEnd: (() => {
      // check if the node has bean moved
      if (activeDxy.x === 0 && activeDxy.y === 0) return
      // updated the active nodes position
      moveActiveNodes([
        Math.round((dx) / 10) * 10,
        Math.round((dy) / 10) * 10
      ])

      setActiveDxy({ x: 0, y: 0 })
    }),
  },
    { drag: { delay: true, threshold: 10, filterTaps: true } }
  )



  return (
    <g
      className="touch-none"
      transform={`translate(${nodeActive ? dx : 0}, ${nodeActive ? dy : 0})`}
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
          transform: `rotate(${node.pos.r ?? 0}deg)`
        }}
      >
      </rect>
      {nodeRuler && (
        <RulerIcon
          x={(x || 0) + node.size.w / 2 - 12}
          y={(y || 0) + node.size.h / 2 - 12}
          stroke="white"
        />
      )}
      {false && (<>
        <text x={x} y={(y || 0) - 25} fontSize="10" fill="white">
          id: {JSON.stringify(node.id)}
        </text>
        <text x={x} y={(y || 0) - 10} fontSize="10" fill="white">
          {JSON.stringify(node.pos)}
        </text>
      </>)}
    </g>
  );
}
