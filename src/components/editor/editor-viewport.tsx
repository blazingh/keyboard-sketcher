"use client"

import { Node, useEditorStore } from './stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "./nodes/basic-node";
import { useEffect, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { NodesOutline } from './nodes-outline';
import NodesAdditionOverlay from './nodes-addition-overlay';
import EditorToolbar from './editor-toolbar';
import { EditorFloatButtons } from './editor-float-buttons';
import { EditorRuler } from './editor-ruler';
import { useViewportTransformationStore } from './stores/viewport-transformation-store';
import NodesTranformationTools from './nodes-transformation-tools';
import NodesDuplicationTools from './nodes-duplication-tools';
import { normalizeAngle } from './lib/nodes-utils';
import { ArcGroupNode } from './nodes/arc-group-node';
import NodesArcTools from './nodes-arc-tools';


const editorWidth = 1500
const editorHeight = 1000

function isInsideSelectionBox(box: any, node: Node) {
  return (
    node.pos.x >= box.x &&
    node.pos.y >= box.y &&
    node.pos.x <= box.x + box.w &&
    node.pos.y <= box.y + box.h
  );
}

export default function EditorViewPort() {
  return (
    <div className='w-svw h-svh relative overflow-hidden'>
      <EditorToolbar />
      <ParentSize>
        {({ width, height }) => <EditorViewPortContent width={width} height={height} />}
      </ParentSize>
    </div>
  )
}

export function EditorViewPortContent({
  width,
  height,
}: {
  width: number,
  height: number,
}) {

  useEffect(() => {
    useEditorStore.persist.rehydrate()
    useViewportTransformationStore.persist.rehydrate()
  }, [])

  if (!useEditorStore.persist?.hasHydrated() || !useViewportTransformationStore.persist.hasHydrated()) return null

  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <EditorFloatButtons />
        {(width && height) &&
          <EditorContent width={width} height={height} />
        }
      </div>
    </div>
  );
}

function EditorContent({
  width,
  height,
}: {
  width: number,
  height: number
}) {

  const store = useEditorStore()
  const { initViewport, transformMatrix, setTransformMatrix, TransformMatrixStyle } = useViewportTransformationStore()

  useEffect(() => {
    initViewport({ w: width, h: height })
  }, [width, height])

  useHotkeys(Key.ArrowUp, () => store.moveActiveNodes({ x: 0, y: -10, r: 0 }))
  useHotkeys(Key.ArrowDown, () => store.moveActiveNodes({ x: 0, y: 10, r: 0 }))
  useHotkeys(Key.ArrowLeft, () => store.moveActiveNodes({ x: -10, y: 0, r: 0 }))
  useHotkeys(Key.ArrowRight, () => store.moveActiveNodes({ x: 10, y: 0, r: 0 }))
  useHotkeys(Key.Delete, () => store.deleteActiveNodes())

  function handleViewPortTap() {
    store.clearActiveNodes()
    store.clearRulerNodes()
  }

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: () => { },
    onDragEnd: () => {
      if (store.pointerAction === "selectionBox") {
        const box = {
          x: (Math.min(0, boxSize[0]) + boxOrigin[0] - transformMatrix.x) / transformMatrix.s,
          y: (Math.min(0, boxSize[1]) + boxOrigin[1] - transformMatrix.y) / transformMatrix.s,
          w: (Math.max(boxSize[0], -boxSize[0])) / transformMatrix.s,
          h: (Math.max(boxSize[1], -boxSize[1])) / transformMatrix.s,
        }
        store.nodesArray().map((node) => {
          if (isInsideSelectionBox(box, node)) {
            store.addActiveNode(node.id)
          }
        })
        setBoxSize([0, 0])
        store.setPointerAction("normal")
      }
    },
    onDoubleClick: () => handleViewPortTap(),
    onPinchStart: ({ origin }) => { },
    onPinchEnd: ({ origin }) => { },
    onPinch: ({ delta, first, last }) => {
      if (first || last) return
      const transformation = {
        s: delta[0],
        x: 0,
        y: 0,
      }
      setTransformMatrix(transformation)
    },
    onWheel: ({ last, ...e }) => {
      if (last) return
      const transformation = {
        s: 0.1 * (e.event.deltaY > 0 ? -transformMatrix.s : transformMatrix.s),
        x: 0,
        y: 0,
      }
      setTransformMatrix(transformation)
    },
    onDrag: ({ first, last, buttons, touches, movement, event, ...e }) => {
      if (store.pointerAction !== "selectionBox" || buttons === 2) {
        const transformation = {
          s: 0,
          x: e.delta[0],
          y: e.delta[1],
        }
        setTransformMatrix(transformation)
      }
      if (buttons === 1 && touches === 1 && store.pointerAction === "selectionBox") {
        first && setBoxOrigin(e.xy)
        !first && setBoxSize(movement)
      }
    },
  }, { drag: { filterTaps: true, threshold: 10, pointer: { buttons: [1, 2, 4] } } })

  return (
    <div>

      {/* nodes duplication toolbar */}
      {store.selectionAction === "duplicate" &&
        <NodesDuplicationTools />
      }
      {/* nodes transformation toolbar */}
      {store.selectionAction === "move" &&
        <NodesTranformationTools />
      }
      {/* nodes arc toolbar */}
      {store.selectionAction === "arc" &&
        <NodesArcTools />
      }

      <svg width={width} height={height}  >

        {/* background */}
        <g transform={TransformMatrixStyle()}>
          <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="0" cy="0" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="10" cy="0" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="0" cy="10" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="10" cy="10" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
          </pattern>
          <rect id="rect" x={-editorWidth} y={-editorHeight} width={editorWidth * 2} height={editorHeight * 2} fill="url(#pattern-circles)" stroke='white' strokeWidth={2}></rect>
        </g>

        {/* nodes outline */}
        <g transform={TransformMatrixStyle()}>
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
        {(store.selectionAction === "arc" && store.arcGroups["nnn"] && store.activeNodes.length > 0) && (
          <g transform={TransformMatrixStyle()}>
            {store.activeNodes.map((nodeId) => (
              <ArcGroupNode
                key={nodeId}
                arc={{
                  ...store.arcGroups["nnn"],
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

        {/* viewport guestures controlles */}
        <rect
          width={width}
          height={height}
          fill="transparent"
          className='touch-none'
          {...bind()}
        />

        {/* nodes */}
        <g transform={TransformMatrixStyle()}>
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

        {/* node addition overlay */}
        {store.pointerAction === "addition" && (
          <NodesAdditionOverlay width={width} height={height} />
        )}

        {/* measure ruler */}
        {store.rulerNodes.length === 2 && (
          <EditorRuler />
        )}

      </svg>

    </div>
  )
}
