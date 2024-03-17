"use client";
import { cn } from '@/lib/utils';
import React, { useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  BackgroundVariant,
  Node,
  NodeProps,
  ReactFlowProvider,
  NodeToolbar,
  Position,
  NodeChange,
  MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook'
import { Key } from 'ts-key-enum'

const initialNodes: Node[] = [
  { id: "2", type: 'switch', position: { x: 190, y: 0 }, data: { label: 'Switch' }, },
  { id: "3", type: 'switch', position: { x: 380, y: 0 }, data: { label: 'Switch' }, },
  { id: "4", type: 'switch', position: { x: 190, y: 190 }, data: { label: 'Switch' }, },
  { id: "5", type: 'switch', position: { x: 380, y: 190 }, data: { label: 'Switch' }, }
];

export default function Sketcher() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}


function BasicFlow() {

  const nodeTypes = useMemo(() => ({ switch: Switch }), []);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => node.selected).map((node) => node.id)
  }, [nodes])

  const modelGenerator: Worker | null = useMemo(() =>
    (typeof window === 'undefined' || !window.Worker)
      ? null
      : new Worker(new URL("../workers/model-generator.ts", import.meta.url)),
    [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Worker || !modelGenerator) return
    modelGenerator.onmessage = (e: MessageEvent<string>) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob(e.data as any))
      a.download = 'model.stl'
      a.click()
      a.remove()
    };
  }, [modelGenerator]);

  function handleAddNode(side: 'left' | 'right' | 'top' | 'bottom') {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (side === 'top') deltas = [0, -190]
    if (side === 'bottom') deltas = [0, 190]
    if (side === 'left') deltas = [-190, 0]
    if (side === 'right') deltas = [190, 0]
    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({ type: 'select', id: node.id, selected: false })
      changes.push({ type: 'add', item: { ...node, id: `${Math.random()}`, position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] }, selected: true } })
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
    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({ type: 'position', id: node.id, position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] } })
    })
    onNodesChange(changes)
  }

  useHotkeys(Key.ArrowUp, () => handleMoveNode('ArrowUp'))
  useHotkeys(Key.ArrowDown, () => handleMoveNode('ArrowDown'))
  useHotkeys(Key.ArrowLeft, () => handleMoveNode('ArrowLeft'))
  useHotkeys(Key.ArrowRight, () => handleMoveNode('ArrowRight'))

  return (
    <div className='w-full h-full relative'>
      <Button
        className='absolute top-0 left-0 z-10'
        onClick={() => {
          if (typeof window === 'undefined' || !window.Worker || !modelGenerator) return
          console.log('generating model')
          modelGenerator.postMessage(JSON.stringify({ nodes: nodes }))
        }}
      >
        Generate Model
      </Button>
      <ReactFlow
        selectionOnDrag
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        disableKeyboardA11y={true}
        fitView
        panOnDrag={[1, 2, 3, 4]}
        minZoom={0.2}
        maxZoom={5}
        snapToGrid
        snapGrid={[10, 10]}
        translateExtent={[[-5000, -5000], [5000, 5000]]}
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background
          id="1"
          gap={10}
          variant={BackgroundVariant.Dots}
        />

        <NodeToolbar nodeId={selectedNodes} isVisible position={Position.Top}>
          <Button
            className=' p-0 h-6 w-6 flex items-center justify-center opacity-25 hover:opacity-100'
            onClick={() => handleAddNode('top')}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </Button>
        </NodeToolbar>

        <NodeToolbar nodeId={selectedNodes} isVisible position={Position.Bottom}>
          <Button
            className=' p-0 h-6 w-6 flex items-center justify-center opacity-25 hover:opacity-100'
            onClick={() => handleAddNode('bottom')}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </Button>
        </NodeToolbar>

        <NodeToolbar nodeId={selectedNodes} isVisible position={Position.Left}>
          <Button
            className=' p-0 h-6 w-6 flex items-center justify-center opacity-25 hover:opacity-100'
            onClick={() => handleAddNode('left')}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </Button>
        </NodeToolbar>

        <NodeToolbar nodeId={selectedNodes} isVisible position={Position.Right}>
          <Button
            className=' p-0 h-6 w-6 flex items-center justify-center opacity-25 hover:opacity-100'
            onClick={() => handleAddNode('right')}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </Button>
        </NodeToolbar>

      </ReactFlow>
    </div>
  );
}

function Switch(props: NodeProps) {
  return (
    <div
      className={cn(
        'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-secondary relative',
        props.selected && 'border-primary',
        props.data.overlaped && 'bg-destructive',
        props.data.overlaped && props.selected && 'border-destructive-foreground',
      )}
    >
    </div>
  );
}
