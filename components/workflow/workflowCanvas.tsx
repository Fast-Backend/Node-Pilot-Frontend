'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  DefaultEdgeOptions,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import ResizableNodeSelected from '@/components/workflow/nodeContainer/nodeWrapper';
import ConfigSummary from './config-summary';
import { WorkflowProps } from '@/types/types';
import ParentChildCustomEdge from './custom-edge';

interface NodeWrapperProps {
  id: string;
  data: WorkflowProps;
}
interface NodeProps extends Node {
  data: WorkflowProps;
}

const initialNodes: NodeProps[] = [];
const initialEdges: Edge[] = [];

const NodeWrapper = ({ data, id }: NodeWrapperProps) => {
  const [nodeData, setNodeData] = useState(data);
  const handleUpdate = (updatedData: WorkflowProps) => {
    setNodeData(updatedData);
    // Optionally, you can propagate the changes to the parent or global state here
  };
  //   console.log('Node Data:', id);
  const reactFlow = useReactFlow();

  useEffect(() => {
    reactFlow.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...nodeData },
          };
        }
        return node;
      })
    );
  }, [nodeData, id, reactFlow]);

  return <ConfigSummary data={data} onUpdate={handleUpdate} />;
};

const nodeTypes = {
  wrapper: ResizableNodeSelected,
  card: NodeWrapper,
};

const edgeTypes = {
  parent_child: ParentChildCustomEdge,
};

const connectionLineStyle = {
  stroke: '#b1b1b7',
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  // type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#b1b1b7',
    strokeWidth: 5,
  },
  data: {
    startLabel: 'parent',
    endLabel: 'child',
  },
  label: 'trace',
  type: 'parent_child',
};

const getNodeId = () => `node_${+new Date()}`;

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const onAdd = useCallback(() => {
    const newNode: NodeProps = {
      id: getNodeId(),
      data: { name: 'unNamed', props: [], relations: [], routes: [] },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
      type: 'card',
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

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
        edgeTypes={edgeTypes}
        onInit={(e) => setRfInstance(e as unknown as ReactFlowInstance)}
        defaultEdgeOptions={defaultEdgeOptions}
        // connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.Step}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-right">
          <div className="flex gap-4">
            <Button onClick={onAdd} className="cursor-pointer">
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
