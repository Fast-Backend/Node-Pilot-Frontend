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
  XYPosition,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import ResizableNodeSelected from '@/components/workflow/nodeContainer/nodeWrapper';
import ConfigSummary from './config-summary';
import { Relation, RelationTypes, WorkflowProps } from '@/types/types';
import ParentChildCustomEdge from './custom-edge';
import { Menu } from 'lucide-react';
import SettingsDrawer from './settings';

interface NodeWrapperProps {
  id: string;
  data: WorkflowProps;
}
interface NodeProps extends Node {
  data: WorkflowProps;
}
type FinalFlowProps = WorkflowProps & {
  cardId: string;
  dimensions:
    | {
        width?: number;
        height?: number;
      }
    | undefined;
  position: XYPosition;
};

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

  return <ConfigSummary id={id} data={data} onUpdate={handleUpdate} />;
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
  const [openDrawer, setDrawerOpen] = useState(false);

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
    const finalData: FinalFlowProps[] = [];
    console.log('start');

    if (rfInstance) {
      const flows = rfInstance.toObject();
      console.log('Flow:', flows);

      // Step 1: Build finalData with cleared relations
      flows.nodes.forEach((node) => {
        const data = {
          cardId: node.id,
          ...(node.data as WorkflowProps),
          relations: [], // reset to avoid duplication
          dimensions: node.measured,
          position: node.position,
        };
        finalData.push(data);
      });

      // Step 2: Process edges and add relations
      flows.edges.forEach((edge) => {
        const sourceIndex = finalData.findIndex(
          (flow) => flow.cardId === edge.source
        );
        const targetIndex = finalData.findIndex(
          (flow) => flow.cardId === edge.target
        );

        if (sourceIndex === -1 || targetIndex === -1) {
          console.warn('Invalid edge connection found:', edge);
          return;
        }

        const relation = (edge.data?.relation as RelationTypes) ?? '';

        const relationParent: Relation = {
          controller: finalData[targetIndex].name,
          relation,
          isParent: true,
        };

        const relationChild: Relation = {
          controller: finalData[sourceIndex].name,
          relation,
          isParent: false,
        };

        finalData[sourceIndex].relations.push(relationParent);
        finalData[targetIndex].relations.push(relationChild);
      });

      console.log(finalData);
    }
  }, [rfInstance]);

  return (
    <>
      <div style={{ width: '100vw', height: '100dvh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={(node) => {
            node.currentTarget.classList.add('border-2');
            node.currentTarget.classList.add('border-red-400');
            node.currentTarget.classList.add('rounded-2xl');
          }}
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
            <div className="flex gap-4 items-center">
              <Button onClick={onAdd} className="cursor-pointer">
                Create
              </Button>
              <Button onClick={onSave} className="cursor-pointer">
                save
              </Button>
              <Menu className="w-4 h-4" />
            </div>
          </Panel>
        </ReactFlow>
      </div>
      <SettingsDrawer
        handleOpen={() => {
          setDrawerOpen(false);
        }}
        openDrawer={openDrawer}
      />
    </>
  );
}
