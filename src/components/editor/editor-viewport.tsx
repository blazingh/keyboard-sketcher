"use client"

import { Node, useEditorStore } from './stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "./nodes/basic-node";
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { NodesOutline } from './nodes-outline';
import NodesAdditionOverlay from './nodes-addition-overlay';
import EditorToolbar from './editor-toolbar';
import { EditorFloatButtons } from './editor-float-buttons';
import { useViewportTransformationStore } from './stores/viewport-transformation-store';
import NodesTranformationTools from './nodes-transformation-tools';
import NodesDuplicationTools from './nodes-duplication-tools';
import { normalizeAngle } from './lib/nodes-utils';
import { ArcGroupNode } from './nodes/arc-group-node';
import { SelectionAcitonStore } from './stores/selection-actions-store';
import { PointerAcitonStore } from './stores/pointer-actions-store';
import { TransformWrapper, TransformComponent, useTransformEffect, useTransformContext, useControls } from "react-zoom-pan-pinch";


const editorWidth = 5000
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
  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])
  return (
    <div className='w-svw h-svh relative overflow-hidden'>
      <TransformWrapper
        panning={{
          excluded: ["no-pan"],
          velocityDisabled: true,
          wheelPanning: true,
        }}
        doubleClick={{
          disabled: true
        }}
        minScale={0.3}
      >
        <EditorToolbar />
        <EditorFloatButtons />
        <TransformComponent wrapperStyle={{ maxWidth: "100%", maxHeight: "100%" }}>
          <EditorContent />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

function EditorContent({
}: {
  }) {

  const store = useEditorStore()
  const selectionAction = SelectionAcitonStore()
  const pointerAction = PointerAcitonStore()

  const { transformState: { scale, positionX, positionY } } = useTransformContext()

  useHotkeys(Key.ArrowUp, () => store.moveActiveNodes({ x: 0, y: -10, r: 0 }))
  useHotkeys(Key.ArrowDown, () => store.moveActiveNodes({ x: 0, y: 10, r: 0 }))
  useHotkeys(Key.ArrowLeft, () => store.moveActiveNodes({ x: -10, y: 0, r: 0 }))
  useHotkeys(Key.ArrowRight, () => store.moveActiveNodes({ x: 10, y: 0, r: 0 }))
  useHotkeys(Key.Delete, () => store.deleteActiveNodes())

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

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
    <div onContextMenu={(e) => e.preventDefault()} >
      {/* nodes transformation toolbar */}
      {selectionAction.selectedMode === "move" &&
        <NodesTranformationTools />
      }
      {/* nodes duplication toolbar */}
      {selectionAction.selectedMode === "copy" &&
        <NodesDuplicationTools />
      }
      <svg width={editorWidth} height={editorHeight}>

        {/* background */}
        <g>
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

        {/* nodes outline */}
        <g id="nodes-outline">
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
        {(selectionAction.selectedMode === "arc" && store.activeNodes.length > 0) && (
          <g>
            {store.activeNodes.map((nodeId) => (
              <ArcGroupNode
                key={nodeId}
                arc={{
                  ...store.arcState,
                  pos: {
                    x: store.nodes[nodeId].pos.x + store.activeDisplacement.x,
                    y: store.nodes[nodeId].pos.y + store.activeDisplacement.y,
                    r: store.nodes[nodeId].pos.r + store.activeDisplacement.r,
                  }
                }}
              />
            ))}
          </g>
        )}

        {/* nodes */}
        <g >
          {store.nodesArray().map((node) => (
            <BasicNode
              key={node.id}
              node={node}
            />
          ))}
        </g>

        {/* selection box */}
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

        {/* node addition overlay */}
        {pointerAction.selectedMode === "addition" && (
          <NodesAdditionOverlay width={editorWidth} height={editorHeight} />
        )}

      </svg>
    </div>
  )
}
