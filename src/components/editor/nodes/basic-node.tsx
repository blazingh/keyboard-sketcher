"use client"

import { TransformMatrix } from "@visx/zoom/lib/types";
import { useDrag as useZoomableDrag } from '@/components/editor/lib/drag';
import { EditorStoreType, Node, useEditorStore } from '../stores/editor-store';
import { produce } from "immer";
import { useGesture } from "@use-gesture/react";
import { cn } from "@/lib/utils";
import { Ruler, RulerIcon } from "lucide-react";

const selector = (state: EditorStoreType) => ({
  clearActiveNodes: state.clearActiveNodes,
  moveActiveNodes: state.moveActiveNodes,
  addActiveNode: state.addActiveNode,
  setActiveDxy: state.setActiveDxy,
  activeDxy: state.activeDxy,
  activeNodes: state.activeNodes,
  snapLines: state.snapLines,
  updateSnapLines: state.updateSnapLines,
  toggleActiveNode: state.toggleActiveNode,
  resetSnapLines: state.resetSnapLines,
})

export function BasicNode({
  node,
  zoomTransformMatrix
}: {
  node: Node;
  zoomTransformMatrix?: TransformMatrix;
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
  } = useEditorStore()

  const nodeActive = activeNodes.includes(node.id)
  const nodeRuler = rulerNodes.includes(node.id)

  const {
    x,
    y,
    dx,
    dy,
    isDragging,
    dragStart,
    dragMove,
    dragEnd
  } = useZoomableDrag({
    x: node.pos.x,
    y: node.pos.y,
    dx: nodeActive ? activeDxy.x : 0,
    dy: nodeActive ? activeDxy.y : 0,
    snapToPointer: false,
    resetOnStart: true,
    zoomTransformMatrix,
    onDragStart: () => {

      // if the node is not selected, deselect othere nodes 
      if (activeNodes.length >= 1 && !nodeActive)
        clearActiveNodes()
      addActiveNode(node.id)
      setEditorMode("normal")
    },

    onDragMove: (args) => {

      // updated the snap lines only if one node is active
      if (activeNodes.length === 1)
        updateSnapLines(produce(node, draft => {
          draft.pos.x = (args.x || 0) + args.dx
          draft.pos.y = (args.y || 0) + args.dy
        }))
      else
        resetSnapLines()

      setActiveDxy({
        x: args.dx,
        y: args.dy
      })

    },
    onDragEnd: (args) => {
      // check if the node has bean moved
      if (args.dx === 0 && args.dy === 0) return

      // updated the active nodes position
      moveActiveNodes([
        Math.round((snapLines?.snapPosition.x ? snapLines?.snapPosition.x - (args.x || 0) : args.dx) / 10) * 10,
        Math.round((snapLines?.snapPosition.y ? snapLines?.snapPosition.y - (args.y || 0) : args.dy) / 10) * 10
      ])

      resetSnapLines()
      setActiveDxy({ x: 0, y: 0 })

    }
  });

  function nodeClick() {
    if (editorMode === "ruler")
      toggleRulerNode(node.id)
    else
      toggleActiveNode(node.id)
  }

  const binds = useGesture({
    onDragStart: ((event) => dragStart(event.event as any)),
    onDrag: ((event) => {
      !event.first && !event.tap && dragMove(event.event as any)
      event.tap && nodeClick()
    }),
    onDragEnd: ((event) => dragEnd(event.event as any)),
  },
    { drag: { delay: true, threshold: 10, filterTaps: true } }
  )


  return (
    <>
      {isDragging && (
        <rect
          width={750}
          height={750}
          onPointerDown={dragStart}
          onPointerMove={dragMove}
          onPointerUp={dragEnd}
          fill="transparent"
        />
      )}
      <g
        transform={`translate(${dx}, ${dy})`}
        className="touch-none"
        {...binds()}
      >
        <rect
          x={(x || 0) + 1}
          y={(y || 0) + 1}
          rx={5}
          width={node.size.w - 2}
          height={node.size.h - 2}
          className={cn(
            "fill-secondary stroke-2",
            nodeActive ? "stroke-primary" : "stroke-white/70"
          )}
        >
          {nodeRuler && (
            <rect
              x={(x || 0) + 1}
              y={(y || 0) + 1}
              width={node.size.w - 10}
              height={node.size.h - 10}
              fill="white"
            />
          )}
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
    </>
  );
};
