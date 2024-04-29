"use client"

import { TransformMatrix } from "@visx/zoom/lib/types";
import 'react-json-view-lite/dist/index.css';
import { useDrag as useZoomableDrag } from '@/components/utils/drag';
import { EditorStoreType, Node, useEditorStore } from '@/contexts/editor-store';
import { produce } from "immer";

const selector = (state: EditorStoreType) => ({
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
    },
    onDragMove: (args) => {
      const modNode = produce(node, draft => {
        draft.pos.x = (args.x || 0) + args.dx
        draft.pos.y = (args.y || 0) + args.dy
      })
      updateSnapLines(modNode)
    },
    onDragEnd: (args) => {
      const modNode = produce(node, draft => {
        draft.pos.x = snapLines?.snapPosition.x ?? ((args.x || 0) + args.dx)
        draft.pos.y = snapLines?.snapPosition.y ?? ((args.y || 0) + args.dy)
      })
      updateNodes(node.id, modNode)
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
          width={node.size.w}
          height={node.size.h}
          fill={"red"}
        >
        </rect>
      </g>
    </>
  );
};
