"use client"

import { Node, useEditorStore } from './stores/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "./nodes/basic-node";
import { Zoom } from "@visx/zoom";
import { useEffect, useMemo, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { NodesOutline } from './nodes-outline';
import NodesAdditionOverlay from './nodes-addition-overlay';
import EditorToolbar from './editor-toolbar';
import NodesToolbar from './nodes-toolbar';
import { EditorFloatButtons } from './editor-float-buttons';
import { EditorRuler } from './editor-ruler';


const editorWidth = 1500
const editorHeight = 1000


export type TransformMatrix = {
  scaleX: number,
  scaleY: number,
  translateX: number,
  translateY: number,
  skewX: number,
  skewY: number,
}

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
  const { transformMatrix } = useEditorStore((state) => ({ transformMatrix: state.transformMatrix }))

  const defaultInitialTransformMatrix = useMemo(() => ({
    scaleX: 1,
    scaleY: 1,
    translateX: width / 2,
    translateY: height / 2,
    skewX: 0,
    skewY: 0,
  }), [width, height])

  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])

  if (!useEditorStore.persist?.hasHydrated()) return null

  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <EditorFloatButtons />
        {width && height &&
          <Zoom<SVGRectElement>
            width={width}
            height={height}
            scaleXMax={2.2}
            scaleYMax={2.2}
            scaleXMin={0.22}
            scaleYMin={0.22}
            initialTransformMatrix={transformMatrix ?? defaultInitialTransformMatrix}
          >
            {(zoom) => ZoomContent({ zoom, width, height })}
          </Zoom>
        }
      </div>
    </div>
  );
}

function ZoomContent({
  zoom,
  width,
  height,
}: {
  zoom: Parameters<Parameters<typeof Zoom>[0]["children"]>[0]
  width: number,
  height: number
}) {

  const store = useEditorStore()

  const defaultInitialTransformMatrix = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  }


  useHotkeys(Key.ArrowUp, () => store.moveActiveNodes([0, -10]))
  useHotkeys(Key.ArrowDown, () => store.moveActiveNodes([0, 10]))
  useHotkeys(Key.ArrowLeft, () => store.moveActiveNodes([-10, 0]))
  useHotkeys(Key.ArrowRight, () => store.moveActiveNodes([10, 0]))
  useHotkeys(Key.Delete, () => store.deleteActiveNodes())

  function handleViewPortTap() {
    store.clearActiveNodes()
  }

  const [initOrigin, setInitOrigin] = useState([0, 0])
  const [initMatrix, setInitMatrix] = useState(defaultInitialTransformMatrix)

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

  useEffect(() => {
    store.setTransformMatrix(zoom.transformMatrix)
  }, [zoom.transformMatrix])


  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: (e) => zoom.dragStart(e.event as any),
    onDragEnd: () => {
      const box = {
        x: (Math.min(0, boxSize[0]) + boxOrigin[0] - zoom.transformMatrix.translateX) / zoom.transformMatrix.scaleX,
        y: (Math.min(0, boxSize[1]) + boxOrigin[1] - zoom.transformMatrix.translateY) / zoom.transformMatrix.scaleY,
        w: (Math.max(boxSize[0], -boxSize[0])) / zoom.transformMatrix.scaleX,
        h: (Math.max(boxSize[1], -boxSize[1])) / zoom.transformMatrix.scaleY,
      }
      store.nodesArray().map((node) => {
        if (isInsideSelectionBox(box, node)) {
          store.addActiveNode(node.id)
        }
      })
      setBoxSize([0, 0])
      zoom.dragEnd()
    },
    onDoubleClick: () => handleViewPortTap(),
    onPinch: ({ first, last, movement, origin }) => {
      if (first) {
        setInitOrigin(origin)
        setInitMatrix(zoom.transformMatrix)
        return
      }
      if (last) {
        setInitOrigin([0, 0])
        return
      }
      const scaleVal = Math.min(Math.max(initMatrix.scaleX + (movement[0] - 1) * 0.7, 0.22), 2.2)
      const newMatrix = {
        scaleX: scaleVal,
        scaleY: scaleVal,
        translateX: Math.min(Math.max(initMatrix.translateX + (origin[0] - initOrigin[0]), -editorWidth * scaleVal + width / 2), editorWidth * scaleVal + width / 2),
        translateY: Math.min(Math.max(initMatrix.translateY + (origin[1] - initOrigin[1]), -editorHeight * scaleVal + height / 2), editorHeight * scaleVal + height / 2),
        skewY: 0,
        skewX: 0
      }
      zoom.setTransformMatrix(newMatrix)
    },
    onWheel: ({ last, event }) => {
      if (!last)
        zoom.handleWheel(event)
    },
    onDrag: ({ first, last, buttons, touches, movement, event, ...e }) => {
      if (buttons === 2) {
        if (first) {
          setInitMatrix(zoom.transformMatrix)
          return
        }
        const { scaleY, scaleX, translateX, translateY } = initMatrix
        const newMatrix = {
          scaleX: scaleX,
          scaleY: scaleY,
          translateX: Math.min(Math.max(translateX + movement[0], -editorWidth * scaleX + width / 2), editorWidth * scaleX + width / 2),
          translateY: Math.min(Math.max(translateY + movement[1], -editorHeight * scaleY + height / 2), editorHeight * scaleY + height / 2),
          skewY: 0,
          skewX: 0
        }
        zoom.setTransformMatrix(newMatrix)
      }
      if (buttons === 1 && touches === 1) {
        first && setBoxOrigin(e.xy)
        !first && setBoxSize(movement)
      }
    },
  }, { drag: { filterTaps: true, threshold: 10, pointer: { buttons: [1, 2, 4] } } })

  return (
    <div>

      {/* nodes toolbar */}
      {!zoom.isDragging &&
        <NodesToolbar transformMatrix={zoom.transformMatrix} />
      }

      <svg width={width} height={height} >

        {/* background */}
        <g transform={zoom.toString()}>
          <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="0" cy="0" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="10" cy="0" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="0" cy="10" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
            <circle id="pattern-circle" cx="10" cy="10" r="0.5" fill="#fff" fillOpacity={0.5}></circle>
          </pattern>
          <rect id="rect" x={-editorWidth} y={-editorHeight} width={editorWidth * 2} height={editorHeight * 2} fill="url(#pattern-circles)" stroke='white' strokeWidth={2}></rect>
        </g>

        {/* snap lines */}
        <g id="snapliens-groups" transform={zoom.toString()} strokeWidth={1} stroke='blue'>
          {store.snapLines?.horizontal && <path id="snapLineH" d={`M ${-editorWidth} ${store.snapLines.horizontal} H ${editorWidth * 2}`} />}
          {store.snapLines?.vertical && <path id="snapLineV" d={`M ${store.snapLines.vertical} ${-editorHeight} V ${editorHeight * 2}`} />}
        </g>

        {/* nodes outline */}
        <g transform={zoom.toString()}>
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
                  }
                }
              })
            }(store.nodesArray())} />
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

        {/* nodes */}
        <g id="points" transform={zoom.toString()}>
          {store.nodesArray().map((node) => (
            <BasicNode
              key={node.id}
              node={node}
              zoomTransformMatrix={zoom.transformMatrix}
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
          <EditorRuler transform={zoom.toString()} />
        )}


      </svg>

    </div>
  )
}
