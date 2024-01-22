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
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';

const initialNodes: Node[] = [
  { id: "1", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch' }, },
  { id: "2", type: 'switch', position: { x: 140, y: 140 }, data: { label: 'Switch' } },
];
const initialEdges: any[] = [];

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

  const [intesectionError, setIntesectionError] = React.useState<boolean>(false);

  const onNodeDrag = useCallback((_: any, node: Node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    let intersect_error = false

    setNodes((ns) =>
      ns.map((n) => {
        if (intersections.includes(n.id)) intersect_error = true
        return { ...n, data: { ...n, overlaped: intersections.includes(n.id) } }
      }
      )
    );
    setIntesectionError(intersect_error)
  }, []);

  return (
    <div className='w-full h-[700px]'>
      <div className=' hidden' />
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
        onNodesChange={(nodes) => {
          onNodesChange(nodes);
          onNodeDrag("", nodes[0] as Node);
        }}
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
      'w-[140px] h-[140px] border-2 rounded-md bg-secondary relative',
      props.selected && 'border-primary',
      props.data.overlaped && 'bg-destructive border-destructive',
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
