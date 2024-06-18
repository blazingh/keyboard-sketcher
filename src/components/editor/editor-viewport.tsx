"use client"

import { Node, useEditorStore } from './stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "./nodes/basic-node";
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { NodesOutline } from './nodes-outline';
import NodesAdditionOverlay from './nodes-addition-overlay';
import NodesTranformationTools from './nodes-transformation-tools';
import NodesDuplicationTools from './nodes-duplication-tools';
import { normalizeAngle } from './lib/nodes-utils';
import { PointerAcitonStore } from './stores/pointer-actions-store';
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import { Skeleton } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { NodesRulerPoints, NodesRulerLines } from './nodes-ruler-points';
import { EditorFloatButtons } from './floatingButtons';
import { ArcGhostNodes } from './nodes/arc-group-node';


const editorWidth = 7000
const editorHeight = 3500

function isInsideSelectionBox(box: any, node: Node) {
  return (
    node.pos.x >= box.x &&
    node.pos.y >= box.y &&
    node.pos.x <= box.x + box.w &&
    node.pos.y <= box.y + box.h
  );
}

export default function EditorViewPort() {

  const pointerAction = PointerAcitonStore()
  const hasHydrated = useEditorStore(state => state._hasHydrated)
  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])

  return (
    <div className='w-svw h-svh relative overflow-hidden'>
      {(hasHydrated)
        ? (
          <TransformWrapper
            panning={{
              excluded: ["no-pan"],
              wheelPanning: true,
            }}
            doubleClick={{
              disabled: true
            }}
            minScale={0.3}
            onInit={(ref) => {
              ref.zoomToElement("nodes-outline")
            }}
          >
            <EditorFloatButtons />

            {/* nodes addtion message */}
            {pointerAction.selectedMode === "addition" &&
              <div className='fixed z-30 bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl font-semibold opacity-75 text-2xl'>
                Press anywhere to add
              </div>
            }

            <TransformComponent wrapperStyle={{ maxWidth: "100%", maxHeight: "100%" }}>
              <EditorContent />
            </TransformComponent>
          </TransformWrapper>
        ) : (
          <div className='w-full h-full p-8 relative'>
            <Skeleton className='w-full h-full rounded-xl' />
            <span className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-draft text-[3.8rem]'>
              SKETCHER
            </span>
          </div>
        )
      }
    </div>
  )
}

function EditorContent({
}: {
  }) {

  const store = useEditorStore()
  const pointerAction = PointerAcitonStore()

  const { transformState: { scale, positionX, positionY } } = useTransformContext()

  useHotkeys(Key.ArrowUp, () => store.moveActiveNodes({ x: 0, y: -10, r: 0 }))
  useHotkeys(Key.ArrowDown, () => store.moveActiveNodes({ x: 0, y: 10, r: 0 }))
  useHotkeys(Key.ArrowLeft, () => store.moveActiveNodes({ x: -10, y: 0, r: 0 }))
  useHotkeys(Key.ArrowRight, () => store.moveActiveNodes({ x: 10, y: 0, r: 0 }))
  useHotkeys(Key.Delete, () => store.deleteActiveNodes())

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

  const backgroundBind = useGesture({
    onDoubleClick: () => {
      store.clearActiveNodes()
    }
  })

  const selectionBoxBind = useGesture({
    onDragStart: ({ xy }) => {
      setBoxOrigin([
        (xy[0] - positionX) / scale,
        (xy[1] - positionY) / scale
      ])
    },
    onDragEnd: () => {
      const box = {
        x: (Math.min(0, boxSize[0]) + boxOrigin[0]),
        y: (Math.min(0, boxSize[1]) + boxOrigin[1]),
        w: (Math.max(boxSize[0], -boxSize[0])),
        h: (Math.max(boxSize[1], -boxSize[1])),
      }
      store.nodesArray().map((node) => {
        if (isInsideSelectionBox(box, node)) {
          store.addActiveNode(node.id)
        }
      })
      setBoxSize([0, 0])
      pointerAction.setSelectedMode("normal")
    },
    onDrag: ({ movement }) => { setBoxSize([movement[0] / scale, movement[1] / scale]) },
  })

  return (
    <div onContextMenu={(e) => e.preventDefault()} className='touch-none' >

      {/* nodes transformation toolbar */}
      {pointerAction.selectedMode === "normal" &&
        <NodesTranformationTools />
      }
      {/* nodes duplication toolbar */}
      {pointerAction.selectedMode === "copy" &&
        <NodesDuplicationTools />
      }

      <svg width={editorWidth} height={editorHeight}>

        {/* background */}
        <g
          {...backgroundBind()}
        >
          <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            {[{ cx: 0, cy: 0 }, { cx: 10, cy: 0 }, { cx: 0, cy: 10 }, { cx: 10, cy: 10 }].map(({ cx, cy }) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.5" fill="#fff" fillOpacity={0.5} />
            ))}
          </pattern>
          <rect
            id="rect"
            x={0}
            y={0}
            width={editorWidth}
            height={editorHeight}
            fill="url(#pattern-circles)"
            stroke="white"
            strokeWidth={2}
          />
        </g>

        {/* nodes */}
        <g
          className={cn(
            pointerAction.selectedMode === "ruler" && "opacity-50"
          )}
        >
          {store.nodesArray().map((node) => (
            <BasicNode
              key={node.id}
              node={node}
            />
          ))}
        </g>

        {/* nodes outline */}
        <g id="nodes-outline" className='pointer-events-none'>
          <defs>
            <NodesOutline nodes={function(nodes) {
              return nodes.map(node => {
                if (!store.activeNodes.includes(node.id))
                  return node
                return {
                  ...node,
                  pos: {
                    x: node.pos.x + store.activeDisplacement.x,
                    y: node.pos.y + store.activeDisplacement.y,
                    r: normalizeAngle(node.pos.r + store.activeDisplacement.r)
                  }
                }
              })
            }(store.nodesArray())}
            />
          </defs>
          <use x="0" y="0" xlinkHref="#Nodes-Ouline-Inner" />
          <use x="0" y="0" xlinkHref="#Nodes-Ouline-Outer" />
        </g>

        {/* arc ghost nodes */}
        {(pointerAction.selectedMode === "arc" && store.activeNodes.length > 0) && (
          <g>
            {store.activeNodes.map((nodeId) => store.nodes[nodeId].type === "switch" && (
              <ArcGhostNodes
                key={nodeId}
                pos={{
                  x: store.nodes[nodeId].pos.x + store.activeDisplacement.x,
                  y: store.nodes[nodeId].pos.y + store.activeDisplacement.y,
                  r: store.nodes[nodeId].pos.r + store.activeDisplacement.r,
                }}
              />
            ))}
          </g>
        )}

        {/* selection box perview */}
        {(boxSize[0] !== 0 || boxSize[1] !== 0) &&
          <rect
            x={Math.min(0, boxSize[0]) + boxOrigin[0]}
            y={Math.min(0, boxSize[1]) + boxOrigin[1]}
            width={Math.max(boxSize[0], -boxSize[0])}
            height={Math.max(boxSize[1], -boxSize[1])}
            fill='#E0FFFF'
            fillOpacity={0.1}
            stroke='#E0FFFF'
          />
        }

        {/* selection box drag overlay */}
        {pointerAction.selectedMode === "selectionBox" && (
          <rect
            className='no-pan touch-none'
            x={0}
            y={0}
            width={editorWidth}
            height={editorHeight}
            fill='transparent'
            {...selectionBoxBind()}
          />
        )}

        {/* ruller points */}
        {pointerAction.selectedMode === "ruler" && (
          <NodesRulerPoints />
        )}
        <NodesRulerLines />

        {/* node addition overlay */}
        {pointerAction.selectedMode === "addition" && (
          <NodesAdditionOverlay width={editorWidth} height={editorHeight} />
        )}

      </svg>
    </div>
  )
}
