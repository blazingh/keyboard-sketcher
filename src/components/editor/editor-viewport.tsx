"use client"

import { Node, useEditorStore } from './editor-store';
import { useGesture } from "@use-gesture/react";
import { BasicNode } from "./nodes/basic-node";
import { Zoom } from "@visx/zoom";
import { useEffect, useState } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import { NodesOutline } from './nodes-outline';
import NodesAdditionOverlay from './nodes-addition-overlay';
import EditorToolbar from './editor-toolbar';
import { Button } from '../ui/button';
import { Plus, PlusSquare } from 'lucide-react';


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

export type TransformMatrix = typeof defaultInitialTransformMatrix

function isInsideSelectionBox(box: any, node: Node) {
  return (
    node.pos.x >= box.x &&
    node.pos.y >= box.y &&
    node.pos.x + node.size.w <= box.x + box.w &&
    node.pos.y + node.size.h <= box.y + box.h
  );
}
function findEnclosingBox(nodes: Node[]) {
  if (nodes.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(node => {
    if (!node) return
    minX = Math.min(minX, node.pos.x);
    minY = Math.min(minY, node.pos.y);
    maxX = Math.max(maxX, node.pos.x + node.size.w);
    maxY = Math.max(maxY, node.pos.y + node.size.h);
  });
  const width = maxX - minX;
  const height = maxY - minY;
  return {
    x: minX,
    y: minY,
    width: width,
    height: height
  };
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

  useEffect(() => {
    useEditorStore.persist.rehydrate()
  }, [])

  if (!useEditorStore.persist?.hasHydrated()) return null

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
          initialTransformMatrix={transformMatrix ?? defaultInitialTransformMatrix}
        >
          {(zoom) => ZoomContent({ zoom, width, height })}
        </Zoom>
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
    onWheel: ({ last, event }) => {
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

  return (
    <div>
      {/* nodes toolbar */}
      {!!store.activeNodes && function(nodes: Node[]) {
        const toolbarBox = findEnclosingBox(nodes)
        if (!toolbarBox || zoom.isDragging || (store.activeDxy.x !== 0 && store.activeDxy.y !== 0)) return null
        const { x, y, width: w, height: h } = toolbarBox
        return (
          <div
            className='absolute pointer-events-none transition-all animate-pop-in'
            style={{
              left: x * zoom.transformMatrix.scaleX + zoom.transformMatrix.translateX,
              top: y * zoom.transformMatrix.scaleY + zoom.transformMatrix.translateY,
              width: w * zoom.transformMatrix.scaleX,
              height: h * zoom.transformMatrix.scaleY
            }}
          >
            {/* left toolbar */}
            <div className='h-full absolute -left-12 top-1/2 -translate-y-1/2 transition-all flex items-center justify-center '>
              <Button className='w-8 h-8'>
                <Plus className='shrink-0' />
              </Button>
            </div>
            {/* top toolbar */}
            <div className='w-full h-10 absolute -top-12 left-1/2 -translate-x-1/2 transition-all flex items-center justify-center '>
              <Button className='w-8 h-8'>
                <Plus className='shrink-0' />
              </Button>
            </div>
            {/* right toolbar */}
            <div className='h-full absolute -right-12 top-1/2 -translate-y-1/2 transition-all flex items-center justify-center '>
              <Button className='w-8 h-8'>
                <Plus className='shrink-0' />
              </Button>
            </div>
            {/* bottom toolbar */}
            <div className='w-full h-10 absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all flex items-center justify-center '>
              <Button className='w-8 h-8'>
                <Plus className='shrink-0' />
              </Button>
            </div>
          </div>
        )
      }(store.activeNodes.map(id => ({ ...store.nodes[id] })))}
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
        {store.activeNodeAddition && (
          <NodesAdditionOverlay width={width} height={height} />
        )}


      </svg>

    </div>
  )
}
