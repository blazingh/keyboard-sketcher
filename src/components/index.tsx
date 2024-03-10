"use client";
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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
import { primitives, booleans, hulls } from '@jscad/modeling'
import stlSerializer from '@jscad/stl-serializer'

const initialNodes: Node[] = [
  { id: "1", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch' }, }
];

export default function Sketcher() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}


function BasicFlow() {

  const nodeTypes = useMemo(() => ({ switch: Switch, addButton: AddButton }), []);

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => node.selected).map((node) => node.id)
  }, [nodes])

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

  function generateModel(nodes: Node[]) {
    let models = booleans.union(primitives.cuboid({ size: [0, 0, 0] }))
    nodes.map((node) => {
      if (node.type === 'switch') {
        models = hulls.hull(models, primitives.cuboid({ size: [210, 210, 30], center: [node.position.x, node.position.y, 0] }))
      }
    })
    nodes.map((node) => {
      if (node.type === 'switch') {
        models = booleans.subtract(models, primitives.cuboid({ size: [140, 140, 35], center: [node.position.x, node.position.y, 0] }))
      }
    })
    const rawData = stlSerializer.serialize({ binary: true }, models)
    const blob = new Blob(rawData)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    nodes.map((node) => {
      if (node.type === 'switch') {
        models = hulls.hull(models, primitives.cuboid({ size: [190, 190, 30], center: [node.position.x, node.position.y, 0] }))
      }
    })
    a.href = url
    a.download = 'model.stl'
    a.click()
    URL.revokeObjectURL(url)
    a.remove()

  }

  return (
    <div className='w-full h-[700px]'>
      <div className=' hidden' />
      <Button onClick={() => generateModel(nodes)}>Generate Model</Button>
      <div className='absolute top-0 right-0 text-white'>{true ? 'Space' : 'nothing'}</div>
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
    <div className={cn(
      'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-secondary relative',
      props.selected && 'border-primary',
      props.data.overlaped && 'bg-destructive',
      props.data.overlaped && props.selected && 'border-destructive-foreground',
    )}
      {...props} >
    </div>
  );
}

function AddButton(props: NodeProps) {
  return (
    <div className={cn(
      'w-[40px] h-[40px] border border-foreground rounded-md bg-secondary relative',
      props.selected && 'border-primary',
      props.data.overlaped && 'bg-destructive',
      props.data.overlaped && props.selected && 'border-destructive-foreground',
    )}
      {...props} >
    </div>
  );
}
