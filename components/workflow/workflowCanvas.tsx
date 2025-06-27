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
import {
  CorsOptionsCustom,
  Relation,
  RelationTypes,
  WorkflowProps,
  WorkflowsProps,
} from '@/types/types';
import ParentChildCustomEdge from './custom-edge';
import { Menu } from 'lucide-react';
import SettingsDrawer from './settings';
import { saveWorkflow } from '@/services/workflow';
import YouTubeDemo from '../demo';
import { getInitialStartup } from '@/services/api';
// import FeatureModal from '../features/feature-modal';

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
  const [projectName, setProjectName] = useState('Untitled');
  const [corsSettings, setCorsSettings] = useState<CorsOptionsCustom>({});
  // const [openFeatureModal, setFeatureModal] = useState<boolean>(true);
  // const [features, setFeatures] = useState<string[]>([]);
  useEffect(() => {
    if (window) {
      getInitialStartup();
    }
  }, []);

  const onAdd = useCallback(() => {
    const newNode: NodeProps = {
      id: getNodeId(),
      data: { name: 'unNamed', props: [], relations: [] },
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

  const onSave = useCallback(async () => {
    const finalData: WorkflowsProps = {
      id: `flow_${+new Date()}`,
      cors: corsSettings,
      name: projectName,
      workflows: [],
    };

    if (rfInstance) {
      const flows = rfInstance.toObject();

      // Step 1: Build finalData with cleared relations
      flows.nodes.forEach((node) => {
        const data = {
          cardId: node.id,
          ...(node.data as WorkflowProps),
          relations: [], // reset to avoid duplication
          dimensions: node.measured,
          position: node.position,
        };
        finalData.workflows.push(data);
      });

      // Step 2: Process edges and add relations
      flows.edges.forEach((edge) => {
        const sourceIndex = finalData.workflows.findIndex(
          (flow) => flow.cardId === edge.source
        );
        const targetIndex = finalData.workflows.findIndex(
          (flow) => flow.cardId === edge.target
        );

        if (sourceIndex === -1 || targetIndex === -1) {
          console.warn('Invalid edge connection found:', edge);
          return;
        }

        const relation = (edge.data?.relation as RelationTypes) ?? '';

        const relationParent: Relation = {
          controller: finalData.workflows[targetIndex].name,
          relation,
          isParent: true,
        };

        const relationChild: Relation = {
          controller: finalData.workflows[sourceIndex].name,
          relation,
          isParent: false,
        };

        finalData.workflows[sourceIndex].relations.push(relationParent);
        finalData.workflows[targetIndex].relations.push(relationChild);
      });
      try {
        const response = await saveWorkflow(finalData);
        console.log('Saved:', response.message);
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }
  }, [corsSettings, projectName, rfInstance]);

  // useEffect(() => {
  //   setFeatures((prev) => {
  //     return prev;
  //   });
  //   // console.log(features);
  //   if (features) {
  //     features.forEach((feature) => {
  //       if (feature === 'registration-login') {
  //         const newNode: NodeProps = {
  //           id: getNodeId(),
  //           data: {
  //             name: 'user',
  //             props: [
  //               {
  //                 name: 'name',
  //                 nullable: false,
  //                 type: 'string',
  //                 validation: [
  //                   {
  //                     type: 'min',
  //                     value: 2,
  //                   },
  //                 ],
  //               },
  //               {
  //                 name: 'email',
  //                 nullable: false,
  //                 type: 'string',
  //                 validation: [
  //                   {
  //                     type: 'email',
  //                   },
  //                 ],
  //               },
  //               {
  //                 name: 'password',
  //                 nullable: false,
  //                 type: 'string',
  //                 validation: [
  //                   {
  //                     type: 'min',
  //                     value: 6,
  //                   },
  //                   {
  //                     type: 'pattern',
  //                     value: '^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$',
  //                   },
  //                 ],
  //               },
  //             ],
  //             relations: [],
  //           },
  //           position: {
  //             x: (Math.random() - 0.5) * 400,
  //             y: (Math.random() - 0.5) * 400,
  //           },
  //           type: 'card',
  //         };
  //         setNodes((nds) => nds.concat(newNode));
  //       }
  //     });
  //   }
  // }, [features, setNodes]);

  const handleSettings = (name: string, cors: CorsOptionsCustom) => {
    setProjectName(name);
    setCorsSettings(cors);
  };
  // const getFeatures = (data: string[]) => {
  //   setFeatures(data);
  // };

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
              <Button
                onClick={onAdd}
                className="cursor-pointer bg-blue-600 hover:bg-blue-800"
              >
                Add Entity
              </Button>
              <Button
                onClick={onSave}
                className="cursor-pointer bg-green-500 hover:bg-green-800"
                disabled={nodes.length === 0}
              >
                Generate Project
              </Button>
              <Menu
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setDrawerOpen(true);
                }}
              />
            </div>
          </Panel>
          <Panel position="top-left">
            <div
              className="bg-white py-2 px-4 cursor-pointer"
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <h3>
                Project Name: <b>{projectName}</b>
              </h3>
            </div>
          </Panel>
        </ReactFlow>
      </div>
      <SettingsDrawer
        handleOpen={() => {
          setDrawerOpen(false);
        }}
        openDrawer={openDrawer}
        onSave={handleSettings}
      />
      <YouTubeDemo />
      {/* <FeatureModal
        open={openFeatureModal}
        handleModal={() => {
          setFeatureModal(false);
        }}
        handleSavedFeatures={getFeatures}
      /> */}
    </>
  );
}
