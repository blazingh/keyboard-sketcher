"use client";
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Node,
  NodeProps,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: "1", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch' } },
  { id: "2", type: 'switch', position: { x: 140, y: 140 }, data: { label: 'Switch' } },
];
const initialEdges: any[] = [];

export default function Sketcher() {

  const nodeTypes = useMemo(() => ({ switch: Switch }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className='w-[500px] h-[500px]'>
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
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background
          id="1"
          gap={14}
          color="#f1f1f1"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}

function Switch(props: NodeProps) {
  return (
    <div className={`w-[140px] h-[140px] border-2 rounded bg-red-500 relative ${props.selected ? 'border-green-500' : ''}`} {...props} >
      {props.selected &&
        <button
          type='button'
          onClick={() => console.log(props.xPos, props.yPos)}
          className='text-3xl w-[32px] h-[32px] text-white bg-green-500 rounded-full absolute -top-[32px] right-1/2 translate-x-1/2'>
          A
        </button>
      }
    </div>
  );
}
