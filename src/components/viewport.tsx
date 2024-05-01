"use client"

import { useEditorStore } from '@/contexts/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "@/components/nodes/basic";
import { Zoom } from "@visx/zoom";
import { useEffect } from 'react';


const width = 750
const height = 750

export default function EditorViewPort() {
  return (
    <div className="" style={{ touchAction: 'none' }}>
      <div className='relative' style={{ width, height }}>
        <Zoom<SVGRectElement>
          width={width}
          height={height}
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

  const bind = useGesture({
    onContextMenu: (e) => e.event.preventDefault(),
    onDragStart: (e) => zoom.dragStart(e.event as any),
    onDragEnd: (e) => zoom.dragEnd(),
    onDoubleClick: (e) => handleViewPortTap(),
    onPinch: (e) => {
      zoom.handlePinch(e)
    },
    onWheel: (e) => {
      zoom.handleWheel(e.event)
    },
    onDrag: (e) => {
      if (e.touches === 2 || e.buttons === 2)
        zoom.dragMove(e.event as any)
    },
  }, { drag: { pointer: { buttons: [1, 2, 4] } }, pinch: {} })

  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])

  return (
    <>
      <svg width={width} height={height} >

        {/* background */}
        <g id="background-group" transform={zoom.toString()}>
          <path id="background" d="M500 0H0V750H750V0Z" fill="#222222" />
        </g>

        {/* snap lines */}
        <g id="snapliens-groups" transform={zoom.toString()} strokeWidth={1} stroke='blue'>
          {store.snapLines?.horizontal && <path id="snapLineH" d={`M 0 ${store.snapLines.horizontal} H 750`} />}
          {store.snapLines?.vertical && <path id="snapLineV" d={`M ${store.snapLines.vertical} 0 V 750`} />}
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
    </>
  )
}
