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
import NodesToolbar from './nodes-toolbar';
import { EditorFloatButtons } from './editor-float-buttons';
import { EditorRuler } from './editor-ruler';
import { useViewportTransformationStore } from './stores/viewport-transformation-store';
import { cn } from '@/lib/utils';
import { ArcGroupNode } from './nodes/snap-arc';
import { Slider } from '../ui/slider';
import { produce } from 'immer';


const editorWidth = 1500
const editorHeight = 1000

function isInsideSelectionBox(box: any, node: Node) {
  return (
    node.pos.x >= box.x &&
    node.pos.y >= box.y &&
    node.pos.x + node.size.w <= box.x + box.w &&
    node.pos.y + node.size.h <= box.y + box.h
  );
}

export default function EditorViewPort() {
  return (
    <div className='w-svw h-svh relative'>
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

  useHotkeys(Key.ArrowUp, () => store.moveActiveNodes([0, -10]))
  useHotkeys(Key.ArrowDown, () => store.moveActiveNodes([0, 10]))
  useHotkeys(Key.ArrowLeft, () => store.moveActiveNodes([-10, 0]))
  useHotkeys(Key.ArrowRight, () => store.moveActiveNodes([10, 0]))
  useHotkeys(Key.Delete, () => store.deleteActiveNodes())

  function handleViewPortTap() {
    store.clearActiveNodes()
    store.clearRulerNodes()
    store.setEditorMode("normal")
  }

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: () => { },
    onDragEnd: () => {
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
      if (store.editorMode === "normal" || buttons === 2) {
        const transformation = {
          s: 0,
          x: e.delta[0],
          y: e.delta[1],
        }
        setTransformMatrix(transformation)
      }
      if (buttons === 1 && touches === 1 && store.editorMode === "select") {
        first && setBoxOrigin(e.xy)
        !first && setBoxSize(movement)
      }
    },
  }, { drag: { filterTaps: true, threshold: 10, pointer: { buttons: [1, 2, 4] } } })

  return (
    <div>

      {/* nodes toolbar */}
      <NodesToolbar />

      <div
        className={cn(
          'absolute pointer-events-none *:pointer-events-auto border bg-secondary rounded flex flex-col gap-8',
        )}
        style={{
          left: 0 * transformMatrix.s + transformMatrix.x,
          top: 0 * transformMatrix.s + transformMatrix.y,
          width: 500 * transformMatrix.s,
          height: 500 * transformMatrix.s
        }}
      >
        {function() {
          const arc = store.arcGroupsArray()[0]
          if (!arc) return null
          return (
            <>
              <Slider
                value={[arc.switchCount]}
                min={1}
                max={10}
                onValueChange={(v) => {
                  store.updateArcGroup(produce(arc, draft => {
                    draft.switchCount = v[0]
                  }))
                }}
              />
              <Slider
                value={[arc.switchGap]}
                min={0}
                max={700}
                step={10}
                onValueChange={(v) => {
                  store.updateArcGroup(produce(arc, draft => {
                    draft.switchGap = v[0]
                  }))
                }}
              />
              <Slider
                value={[arc.radius]}
                min={0}
                max={1400}
                onValueChange={(v) => {
                  store.updateArcGroup(produce(arc, draft => {
                    draft.radius = v[0]
                  }))
                }}
              />
              <Slider
                value={[arc.pos.r]}
                min={0}
                max={360}
                onValueChange={(v) => {
                  store.updateArcGroup(produce(arc, draft => {
                    draft.pos.r = v[0]
                  }))
                }}
              />
            </>
          )
        }()}

      </div>

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
                    x: node.pos.x + store.activeDxy.x,
                    y: node.pos.y + store.activeDxy.y,
                    r: 0
                  }
                }
              })
            }(store.nodesArray())}
            />
          </defs>
          <use x="0" y="0" xlinkHref="#Nodes-Ouline-Inner" />
          <use x="0" y="0" xlinkHref="#Nodes-Ouline-Outer" />
        </g>

        {/* zoom controlles */}
        <rect
          width={width}
          height={height}
          fill="transparent"
          className='touch-none'
          {...bind()}
        />

        {/* arcGroup nodes */}
        <g transform={TransformMatrixStyle()}>
          {store.arcGroupsArray().map((arc) => (
            <ArcGroupNode
              key={arc.id}
              arc={arc}
            />
          ))}
        </g>

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
        {store.editorMode === "addition" && (
          <NodesAdditionOverlay width={width} height={height} />
        )}

        {/* nodes ruler */}
        {store.rulerNodes.length === 2 && (
          <EditorRuler />
        )}


      </svg>

    </div>
  )
}
