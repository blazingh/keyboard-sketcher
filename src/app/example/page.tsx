"use client"

import { Zoom } from "@visx/zoom";
import { TransformMatrix } from "@visx/zoom/lib/types";
import 'react-json-view-lite/dist/index.css';
import { useDrag } from '@/components/utils/drag';
import { EditorStoreType, useEditorStore } from '@/contexts/editor-store';
import { getSnapLines } from "@/lib/snap-lines";

export type Node = {
  id: string,
  size: {
    w: number,
    h: number
  }
  pos: {
    x: number,
    y: number,
  }
}

export default function DragI() {
  const width = 750
  const height = 750

  const store = useEditorStore()

  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <Zoom<SVGRectElement>
          width={width}
          height={height}
        >
          {(zoom) => {
            return (
              <>
                <svg width={width} height={height} className='border'>
                  <g id="gym" transform={zoom.toString()}>
                    <path id="background" d="M500 0H0V750H750V0Z" fill="#222222" />
                  </g>
                  <g id="gym" transform={zoom.toString()}>
                    {store.snapLines?.horizontal &&
                      <path id="background" d={`M 0 ${store.snapLines.horizontal} H 750`} strokeWidth={1} stroke='blue' />
                    }
                    {store.snapLines?.vertical &&
                      <path id="background" d={`M ${store.snapLines.vertical} 0 V 750`} strokeWidth={1} stroke="blue" />
                    }
                  </g>
                  <rect
                    width={width}
                    height={height}
                    ref={zoom.containerRef}
                    fill="transparent"
                    style={{ touchAction: "none" }}
                  />
                  <g id="points" transform={zoom.toString()}>
                    {store.nodes.map((node, i) => (
                      <Point
                        key={node.id}
                        node={node}
                        zoomTransformMatrix={zoom.transformMatrix}
                      />
                    ))}
                  </g>
                </svg>
              </>
            )
          }}
        </Zoom>
      </div>


      {/*
      <JsonView data={draggingItems} shouldExpandNode={allExpanded} style={defaultStyles} />
      */}

    </div>
  );
}

const selector = (state: EditorStoreType) => ({
  snapLines: state.snapLines,
  updateSnapLines: state.updateSnapLines,
  updateNodes: state.updateNodes,
  addActiveNodes: state.addActiveNodes,
  removeActiveNodes: state.removeActiveNodes,
  resetSnapLines: state.resetSnapLines,
  nodes: state.nodes
})

const Point = ({
  node,
  zoomTransformMatrix
}: {
  node: Node;
  zoomTransformMatrix?: TransformMatrix;
}) => {

  const { updateSnapLines, nodes, updateNodes, resetSnapLines, snapLines } = useEditorStore(selector)

  const {
    x,
    y,
    dx,
    dy,
    isDragging,
    dragStart,
    dragMove,
    dragEnd
  } = useDrag({
    x: node.pos.x,
    y: node.pos.y,
    snapToPointer: false,
    resetOnStart: true,
    zoomTransformMatrix,
    onDragStart: () => {
    },
    onDragMove: (args) => {
      const modNode = JSON.parse(JSON.stringify(node));
      modNode.pos.x = (args.x || 0) + args.dx
      modNode.pos.y = (args.y || 0) + args.dy
      updateSnapLines(getSnapLines(modNode, nodes))
    },
    onDragEnd: (args) => {
      const modNode = JSON.parse(JSON.stringify(node));
      modNode.pos.x = snapLines?.snapPosition.x ?? ((args.x || 0) + args.dx)
      modNode.pos.y = snapLines?.snapPosition.y ?? ((args.y || 0) + args.dy)
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

/* 
*/

