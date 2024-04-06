"use client";
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  NodeChange,
  NodeToolbar,
  Position,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Key } from 'ts-key-enum';
import EditorDialogTrigger from '@/components/modals/editor-info';
import { Button, buttonVariants } from '@/components/ui/button';
import MCU from "@/components/sketcher/nodes/mcu";
import Switch from "@/components/sketcher/nodes/switch";
import { initialNodes } from "@/constants/temp";
import { useModelActions } from "@/hooks/model-actions";
import { Outline } from '@/components/sketcher/nodes/outline';

export function SketcherWorkSpace() {

  const nodeTypes = useMemo(() => ({ switch: Switch, mcu: MCU, outline: Outline }), []);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const modelActions = useModelActions()

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


  useEffect(() => {
    const changes: NodeChange[] = []
    changes.push({
      type: 'add',
      item: {
        id: "0",
        type: 'outline',
        position: { x: 0, y: 0 },
        data: { label: 'outline' },
        zIndex: 0,
        width: 5000,
        height: 5000,
        selectable: false,
        draggable: false,
      },
    })
    onNodesChange(changes)
  }, [])

  return (
    <div className='relative w-svw h-svh'>

      <modelActions.ModelPreviewJsx />

      <Button
        className='absolute bottom-5 right-5 z-10'
        onClick={() => modelActions.generateModel(nodes)}
      >
        Generate Model
      </Button>

      <EditorDialogTrigger
        className='absolute top-5 right-5 z-10'
      />


      <ReactFlow
        snapToGrid
        fitView
        disableKeyboardA11y
        preventScrolling
        zoomOnScroll
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >

        <Background gap={10} variant={BackgroundVariant.Dots} />

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
              'p-0 h-8 w-8 flex items-center justify-center opacity-25 hover:opacity-100',
            )}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </NodeToolbar>
        ))}

      </ReactFlow>
    </div>
  );
}
