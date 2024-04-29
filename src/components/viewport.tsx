"use client"

import { useEditorStore } from '@/contexts/editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "@/components/nodes/basic";
import { Zoom } from "@visx/zoom";


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

function ZoomContent({ zoom }: { zoom: any }) {

  const store = useEditorStore()

  const bind = useGesture({
    onPinch: (e) => {
    },
    onDrag: (e) => {
      if (e.first) zoom.dragStart(e.event as any)
      if (e.last) zoom.dragEnd()
      if (e.touches === 2 && !e.first && !e.last)
        zoom.dragMove(e.event as any)
    }
  })

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
          onMouseDown={zoom.dragStart}
          onMouseMove={zoom.dragMove}
          onMouseUp={zoom.dragEnd}
          onMouseLeave={() => zoom.isDragging && zoom.dragEnd()}
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
