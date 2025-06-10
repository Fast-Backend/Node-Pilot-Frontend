'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  BackgroundVariant,
  ReactFlowInstance,
  Panel,
  Node,
  MarkerType,
  Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import ResizableNodeSelected from '@/components/workflow/nodeContainer/nodeWrapper';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '1' },
    // type: 'wrapper',
  },
  { id: '2', position: { x: 100, y: 100 }, data: { label: '2' } },

  { id: '3', position: { x: 20, y: 550 }, data: { label: '3' } },

  { id: '4', position: { x: 660, y: 100 }, data: { label: '4' } },

  { id: '5', position: { x: 459, y: 300 }, data: { label: '5' } },
];
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '5', label: 'one-to-one' },
];

const nodeTypes = {
  wrapper: ResizableNodeSelected,
};

// const edgeTypes = {
//   floating: FloatingEdge,
// };

const connectionLineStyle = {
  stroke: '#b1b1b7',
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
  },
};

export default function Workflow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log('Flow:', flow);
      //   localStorage.setItem('flowKey', JSON.stringify(flow));
    }
  }, [rfInstance]);

  // const nodeTypes = { textUpdater: NodeWrapper };

  return (
    <div style={{ width: '100vw', height: '100dvh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        // edgeTypes={edgeTypes}
        onInit={(e) => setRfInstance(e as unknown as ReactFlowInstance)}
        defaultEdgeOptions={defaultEdgeOptions}
        // connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <div className="flex gap-4">
            <Button onClick={onSave} className="cursor-pointer">
              Create
            </Button>
            <Button onClick={onSave} className="cursor-pointer">
              save
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
