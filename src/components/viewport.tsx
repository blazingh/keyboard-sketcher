"use client"

import { useEditorStore } from '@/contexts/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "@/components/nodes/basic";
import { Zoom } from "@visx/zoom";
import { useEffect, useState } from 'react';
import { useDrag } from './utils/drag';
import { LinePath } from '@visx/shape';


const width = 750
const height = 750

const defaultInitialTransformMatrix = {
  scaleX: 1,
  scaleY: 1,
  translateX: width / 2,
  translateY: height / 2,
  skewX: 0,
  skewY: 0,
}

export default function EditorViewPort() {
  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <Zoom<SVGRectElement>
          width={width}
          height={height}
          initialTransformMatrix={defaultInitialTransformMatrix}
        >
          {(zoom) => ZoomContent({ zoom })}
        </Zoom>
      </div>
    </div>
  );
}

function ZoomContent({ zoom }: { zoom: Parameters<Parameters<typeof Zoom>[0]["children"]>[0] }) {

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
    <div className='relativ'>
      <svg width={width} height={height} className='border' >

        {/* background */}
        <g transform={zoom.toString()}>
          <rect fill='#FFFFFF' width='24' height='24' />
          <defs>
            <linearGradient id='a' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(27,0.5,0.5)'>
              <stop offset='0' stop-color='#111111' />
              <stop offset='1' stop-color='#111111' />
            </linearGradient>
          </defs>
          <pattern id='b' width='14' height='14' patternUnits='userSpaceOnUse'>
            <circle fill='#FFFFFF' cx='7' cy='7' r='7' />
          </pattern>
          <rect x={-750} y={-750} width='200%' height='200%' fill='url(#a)' />
          <rect x={-750} y={-750} width='200%' height='200%' fill='url(#b)' fill-opacity='0.06' />
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

        {(JSON.stringify(boxSize) !== JSON.stringify([0, 0])) &&
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
    </div>
  )
}
