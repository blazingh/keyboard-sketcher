"use client";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import MCU from "@/components/sketcher/nodes/mcu";
import { Outline } from '@/components/sketcher/nodes/outline';
import Switch from "@/components/sketcher/nodes/switch";
import { buttonVariants } from '@/components/ui/button';
import { initialNodes } from "@/constants/temp";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactFlow, {
  Background,
  BackgroundVariant,
  NodeChange,
  NodeToolbar,
  Position,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Key } from 'ts-key-enum';

export function SketcherWorkSpace() {

  const nodeTypes = useMemo(() => ({ switch: Switch, mcu: MCU, outline: Outline }), []);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => node.selected).map((node) => node.id)
  }, [nodes])

  function handleAddNode(side: Position) {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (side === 'top') deltas = [0, -190]
    if (side === 'bottom') deltas = [0, 190]
    if (side === 'left') deltas = [-190, 0]
    if (side === 'right') deltas = [190, 0]
    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({
        type: 'select',
        id: node.id,
        selected: false
      })
      changes.push({
        type: 'add',
        item: {
          ...node,
          id: `${Math.random()}`,
          position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] },
          selected: true
        }
      })
    })
    onNodesChange(changes)
  }

  function handleMoveNode(key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown') {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (key === 'ArrowLeft') deltas = [-10, 0]
    if (key === 'ArrowRight') deltas = [10, 0]
    if (key === 'ArrowUp') deltas = [0, -10]
    if (key === 'ArrowDown') deltas = [0, 10]
    const isMcu = nodes.find((node) => node.selected && node.type === 'mcu')
    if (isMcu) deltas = [deltas[0] * 0.5, deltas[1] * 0.5]
    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({
        type: 'position',
        id: node.id,
        position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] }
      })
    })
    onNodesChange(changes)
  }

  /* hot keys event handlers */
  useHotkeys(Key.ArrowUp, () => handleMoveNode('ArrowUp'))
  useHotkeys(Key.ArrowDown, () => handleMoveNode('ArrowDown'))
  useHotkeys(Key.ArrowLeft, () => handleMoveNode('ArrowLeft'))
  useHotkeys(Key.ArrowRight, () => handleMoveNode('ArrowRight'))

  return (
    <div className='relative w-svw h-svh'>

      {/*
      <EditorDialogTrigger
        className='absolute top-5 right-5 z-10'
      />
      */}

      <ReactFlow
        snapToGrid
        fitView
        disableKeyboardA11y
        preventScrolling
        zoomOnScroll
        selectionOnDrag
        zoomOnDoubleClick={false}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodesDraggable={!isMobile}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >

        <Background gap={10} variant={BackgroundVariant.Dots} />

        {/* switch move buttons */}
        {false && [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <NodeToolbar
            key={position}
            isVisible
            nodeId={selectedNodes}
            position={position}
            onClick={() => handleMoveNode('ArrowUp')}
            className={cn(
              buttonVariants(),
              'p-0 h-8 w-8 flex items-center justify-center opacity-50 hover:opacity-100 z-10 ',
              position === Position.Top && "mt-8",
              position === Position.Bottom && "-mt-8",
              position === Position.Left && "ml-8",
              position === Position.Right && "-ml-8",
            )}
          >
            {position === Position.Top && (
              <ChevronUp className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Bottom && (
              <ChevronDown className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Left && (
              <ChevronLeft className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Right && (
              <ChevronRight className='w-6 h-6 flex-shrink-0' />
            )}
          </NodeToolbar>
        ))}

        {/* switch add buttons */}
        {[
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <NodeToolbar
            isVisible
            key={position}
            nodeId={selectedNodes}
            position={position}
            onClick={() => handleAddNode(position)}
            className={cn(
              buttonVariants(),
              'p-0 h-8 w-8 flex items-center justify-center opacity-50 hover:opacity-100',
              position === Position.Top && "-mt-2",
              position === Position.Bottom && "mt-2",
              position === Position.Left && "-ml-2",
              position === Position.Right && "ml-2",

            )}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </NodeToolbar>
        ))}

      </ReactFlow>
    </div>
  );
}
