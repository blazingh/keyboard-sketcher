"use client"

import { TransformMatrix } from "@visx/zoom/lib/types";
import 'react-json-view-lite/dist/index.css';
import { useDrag as useZoomableDrag } from '@/components/utils/drag';
import { EditorStoreType, Node, useEditorStore } from '@/contexts/editor-store';
import { produce } from "immer";
import { useGesture } from "@use-gesture/react";

const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
  snapLines: state.snapLines,
  updateSnapLines: state.updateSnapLines,
  updateNode: state.updateNode,
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
    activeNodes,
    toggleActiveNode,
    updateSnapLines,
    updateNode,
    resetSnapLines,
    snapLines
  } = useEditorStore(selector)

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
    snapToPointer: false,
    resetOnStart: true,
    zoomTransformMatrix,
    onDragStart: () => {
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

    },
    onDragEnd: (args) => {
      // check if the node has bean moved
      if (args.dx === 0 && args.dy === 0) return

      // updated the node position
      updateNode(node.id,
        produce(node, draft => {
          draft.pos.x = snapLines?.snapPosition.x ?? ((args.x || 0) + args.dx)
          draft.pos.y = snapLines?.snapPosition.y ?? ((args.y || 0) + args.dy)
        })
      )

      toggleActiveNode(node.id)
      resetSnapLines()
    }
  });

  function nodeClick() {
    toggleActiveNode(node.id)
  }

  const binds = useGesture({
    onDragStart: ((event) => dragStart(event.event as any)),
    onDrag: ((event) => !event.first && dragMove(event.event as any)),
    onDragEnd: ((event) => dragEnd(event.event as any)),
    onClick: (event) => nodeClick()
  },
    { drag: { delay: true } }
  )

  const nodeActive = activeNodes.includes(node.id) || isDragging

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
          rx={nodeActive ? 10 : 0}
          width={node.size.w}
          height={node.size.h}
          fill={"red"}
        >
        </rect>
      </g>
    </>
  );
};
