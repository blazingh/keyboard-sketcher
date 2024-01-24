"use client";
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  BackgroundVariant,
  Node,
  NodeProps,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';

const initialNodes: Node[] = [
  { id: "1", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch' }, },
  { id: "2", type: 'switch', position: { x: 140, y: 140 }, data: { label: 'Switch' } },
  { id: "3", type: 'switch', position: { x: 280, y: 280 }, data: { label: 'Switch' } },
  { id: "4", type: 'switch', position: { x: 420, y: 420 }, data: { label: 'Switch' } },
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { getIntersectingNodes } = useReactFlow();

  const handleNodesChange = (nodes: NodeChange[]) => {
    checkIntersections(nodes.filter((n) => n.type === "position").map((n: any) => n.id as Node["id"]))
    onNodesChange(nodes);
  }

  const checkIntersections = useCallback((nodeIds: Node["id"][]) => {
    let intersections: Node["id"][] = []
    for (let i = 0; i < nodes.length; i++)
      getIntersectingNodes({ id: nodes[i].id })
        .filter((n: any) => n.id !== nodeIds[i])
        .length > 0 && intersections.push(nodes[i].id)

    setNodes((ns) => (
      ns.map((n) => (
        {
          ...n, data: { ...n.data, overlaped: intersections.includes(n.id) }
        }
      ))
    ))
  }, [getIntersectingNodes, nodes, setNodes])

  return (
    <div className='w-full h-[700px]'>
      <div className=' hidden' />
      <div className='absolute top-0 right-0'>{}</div>
      <ReactFlow
        selectionOnDrag
        panOnDrag={[1, 2, 3, 4]}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={5}
        snapToGrid
        snapGrid={[14, 14]}
        fitView
        translateExtent={[[-5000, -5000], [5000, 5000]]}
        nodes={nodes}
        onNodesChange={handleNodesChange}
      >
        <Controls />
        <Background
          id="1"
          gap={14}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}

function Switch(props: NodeProps) {
  return (
    <div className={cn(
      'w-[140px] h-[140px] border border-foreground rounded-md bg-secondary relative',
      props.selected && 'border-2 border-primary',
      props.data.overlaped && 'bg-destructive',
      props.data.overlaped && props.selected && 'border-destructive-foreground',
    )}
      {...props} >
      {props.selected &&
        ['t', 'b', 'l', 'r'].map((dir) =>
          <div key={dir} className={cn(
            dir === 't' ? 'top-0' : dir === 'b' ? 'bottom-0' : dir === 'l' ? 'left-0' : 'right-0',
            dir === 't' ? '-translate-y-full' : dir === 'b' ? 'translate-y-full' : dir === 'l' ? '-translate-x-full' : 'translate-x-full',
            dir === 't' ? 'w-full' : dir === 'b' ? 'w-full' : dir === 'l' ? 'h-full' : 'h-full',
            'absolute p-3 flex justify-center items-center',
            'opacity-0 hover:opacity-100 transition-opacity'
          )}
          >
            <Button
              variant={'default'}
              onClick={() => console.log(props.xPos, props.yPos, dir)}
              className={cn(
                'p-0 h-min w-min',
              )}
            >
              <PlusIcon className='text-primary-foreground w-8 h-8' />
            </Button>
          </div>
        )
      }
    </div>
  );
}
