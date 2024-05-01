"use client"

import { TransformMatrix } from "@visx/zoom/lib/types";
import 'react-json-view-lite/dist/index.css';
import { useDrag as useZoomableDrag } from '@/components/utils/drag';
import { EditorStoreType, Node, useEditorStore } from '@/contexts/editor-store';
import { produce } from "immer";
import { useGesture } from "@use-gesture/react";

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
    snapLines
  } = useEditorStore(selector)

  const nodeActive = activeNodes.includes(node.id)

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

      // update the actide drag xy
      if (activeNodes.length > 1)
        setActiveDxy({ x: args.dx, y: args.dy })

    },
    onDragEnd: (args) => {
      // check if the node has bean moved
      if (args.dx === 0 && args.dy === 0) return

      // updated the active nodes position
      moveActiveNodes([
        snapLines?.snapPosition.x ? snapLines?.snapPosition.x - (args.x || 0) : args.dx,
        snapLines?.snapPosition.y ? snapLines?.snapPosition.y - (args.y || 0) : args.dy
      ])

      resetSnapLines()
      setActiveDxy({ x: 0, y: 0 })

    }
  });

  function nodeClick() {
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
        {...binds()}
      >
        <rect
          x={x}
          y={y}
          rx={5}
          width={node.size.w}
          height={node.size.h}
          strokeWidth={2}
          stroke={nodeActive ? "white" : "transparent"}
          fill={"red"}
        >
        </rect>
      </g>
    </>
  );
};
