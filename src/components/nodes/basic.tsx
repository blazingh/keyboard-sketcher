"use client"

import { TransformMatrix } from "@visx/zoom/lib/types";
import 'react-json-view-lite/dist/index.css';
import { useDrag as useZoomableDrag } from '@/components/utils/drag';
import { EditorStoreType, Node, useEditorStore } from '@/contexts/editor-store';
import { produce } from "immer";

const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
  snapLines: state.snapLines,
  updateSnapLines: state.updateSnapLines,
  updateNodes: state.updateNodes,
  addActiveNodes: state.addActiveNodes,
  removeActiveNodes: state.removeActiveNodes,
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
    addActiveNodes,
    removeActiveNodes,
    updateSnapLines,
    updateNodes,
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

      addActiveNodes(node.id)

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

      // updated the node position
      updateNodes(node.id,
        produce(node, draft => {
          draft.pos.x = snapLines?.snapPosition.x ?? ((args.x || 0) + args.dx)
          draft.pos.y = snapLines?.snapPosition.y ?? ((args.y || 0) + args.dy)
        })
      )

      removeActiveNodes(node.id)
      resetSnapLines()

    }
  });

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
        onMouseDown={dragStart}
        onMouseMove={dragMove}
        onMouseUp={dragEnd}
        onTouchStart={dragStart}
        onTouchMove={dragMove}
        onTouchEnd={dragEnd}
        transform={`translate(${dx}, ${dy})`}
      >
        <rect
          x={x}
          y={y}
          rx={activeNodes.includes(node.id) ? 10 : 0}
          width={node.size.w}
          height={node.size.h}
          fill={"red"}
        >
        </rect>
      </g>
    </>
  );
};
