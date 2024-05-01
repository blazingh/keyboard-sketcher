"use client"

import { useEditorStore } from '@/contexts/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "@/components/nodes/basic";
import { Zoom } from "@visx/zoom";
import { useEffect, useState } from 'react';


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

  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: (e) => zoom.dragStart(e.event as any),
    onDragEnd: (e) => zoom.dragEnd(),
    onDoubleClick: (e) => handleViewPortTap(),
    onPinch: (e) => {

      e.first && setInitOrigin(e.origin)
      e.first && setInitMatrix(zoom.transformMatrix)
      false && zoom.applyToPoint({ x: e.origin[0], y: e.origin[1] })
      e.last && setInitOrigin([0, 0])
      e.last && console.log(zoom.transformMatrix)

      false && zoom.setTranslate({
        translateX: (e.origin[0] - initOrigin[0]) * 1,
        translateY: (e.origin[1] - initOrigin[1]) * 1
      })
      false && zoom.scale({
        scaleX: e.delta[0] * 0.5 + 1,
        point: { x: e.origin[0], y: e.origin[1] }
      })

      const scaleVal = Math.min(Math.max(initMatrix.scaleX + (e.movement[0] - 1) * 0.7, 0.21), 2.1)

      true && zoom.setTransformMatrix({
        scaleX: scaleVal,
        scaleY: scaleVal,
        translateX: (initMatrix.translateX + (e.origin[0] - initOrigin[0]) * 1),
        translateY: (initMatrix.translateY + (e.origin[1] - initOrigin[1]) * 1),
        skewY: 0,
        skewX: 0
      })

    },
    onWheel: (e) => {
      zoom.handleWheel(e.event)
    },
    onDrag: (e) => {
      //if (e.touches === 2 || e.buttons === 2)
      //   zoom.dragMove(e.event as any)
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

      </svg>
    </div>
  )
}
