"use client"

import { Node, useEditorStore } from '@/contexts/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "@/components/nodes/basic";
import { Zoom } from "@visx/zoom";
import { useEffect, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';


const editorWidth = 1500
const editorHeight = 1000

const defaultInitialTransformMatrix = {
  scaleX: 1,
  scaleY: 1,
  translateX: editorWidth / 2,
  translateY: editorHeight / 2,
  skewX: 0,
  skewY: 0,
}

export default function EditorViewPort() {
  return (
    <div className='w-svw h-svh relative'>
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
  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <Zoom<SVGRectElement>
          width={width}
          height={height}
          scaleXMax={2.1}
          scaleYMax={2.1}
          scaleXMin={0.21}
          scaleYMin={0.21}
          initialTransformMatrix={defaultInitialTransformMatrix}
        >
          {(zoom) => ZoomContent({ zoom, width, height })}
        </Zoom>
      </div>
    </div>
  );
}

function isInsideSelectionBox(box: any, node: Node) {
  return (
    node.pos.x >= box.x &&
    node.pos.y >= box.y &&
    node.pos.x + node.size.w <= box.x + box.w &&
    node.pos.y + node.size.h <= box.y + box.h
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

  function handleViewPortTap() {
    store.clearActiveNodes()
  }

  const [initOrigin, setInitOrigin] = useState([0, 0])
  const [initMatrix, setInitMatrix] = useState(defaultInitialTransformMatrix)

  const [boxOrigin, setBoxOrigin] = useState([0, 0])
  const [boxSize, setBoxSize] = useState([0, 0])

  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: (e) => zoom.dragStart(e.event as any),
    onDragEnd: (e) => {
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
    onDoubleClick: (e) => handleViewPortTap(),
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
      const scaleVal = Math.min(Math.max(initMatrix.scaleX + (movement[0] - 1) * 0.7, 0.21), 2.1)
      const newMatrix = {
        scaleX: scaleVal,
        scaleY: scaleVal,
        translateX: initMatrix.translateX + (origin[0] - initOrigin[0]),
        translateY: initMatrix.translateY + (origin[1] - initOrigin[1]),
        skewY: 0,
        skewX: 0
      }
      zoom.setTransformMatrix(newMatrix)
    },
    onWheel: ({ first, last, event }) => {
      if (!last)
        zoom.handleWheel(event)
    },
    onDrag: ({ first, last, buttons, touches, event, ...e }) => {
      if (buttons === 2)
        zoom.dragMove(event as any)
      if (buttons === 1 && touches === 1) {
        first && setBoxOrigin(e.xy)
        !first && setBoxSize(e.movement)
      }
    },
  }, { drag: { pointer: { buttons: [1, 2, 4] } } })

  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])

  return (
    <svg width={width} height={height} >

      {/* background */}
      <g transform={zoom.toString()}>
        <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle id="pattern-circle" cx="0" cy="0" r="0.5" fill="#fff"></circle>
          <circle id="pattern-circle" cx="10" cy="0" r="0.5" fill="#fff"></circle>
          <circle id="pattern-circle" cx="0" cy="10" r="0.5" fill="#fff"></circle>
          <circle id="pattern-circle" cx="10" cy="10" r="0.5" fill="#fff"></circle>
        </pattern>
        <rect id="rect" x={-editorWidth} y={-editorHeight} width={editorWidth * 2} height={editorHeight * 2} fill="url(#pattern-circles)" stroke='white' strokeWidth={2}></rect>
      </g>

      {/* snap lines */}
      <g id="snapliens-groups" transform={zoom.toString()} strokeWidth={1} stroke='blue'>
        {store.snapLines?.horizontal && <path id="snapLineH" d={`M -750 ${store.snapLines.horizontal} H 1500`} />}
        {store.snapLines?.vertical && <path id="snapLineV" d={`M ${store.snapLines.vertical} -750 V 1500`} />}
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

      {(boxSize[0] !== 0 || boxSize[1] !== 0) &&
        <rect
          x={Math.min(0, boxSize[0]) + boxOrigin[0]}
          y={Math.min(0, boxSize[1]) + boxOrigin[1]}
          width={Math.max(boxSize[0], -boxSize[0])}
          height={Math.max(boxSize[1], -boxSize[1])}
          fill='blue'
          fillOpacity={0.1}
          stroke='blue'
        />
      }

    </svg>
  )
}
