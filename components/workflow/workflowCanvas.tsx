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
  ProjectFeatures,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useWorkflowStore } from '@/lib/store/workflowStore';
import InitialSetupModal, { InitialSetupConfig } from '../initial-setup-modal';
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
  const reactFlow = useReactFlow();
  
  const handleUpdate = useCallback((updatedData: WorkflowProps) => {
    // Update the node directly through ReactFlow
    reactFlow.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...updatedData },
          };
        }
        return node;
      })
    );
  }, [id, reactFlow]);

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
  const { projectFeatures, setProjectFeatures } = useWorkflowStore();
  const isMobile = useIsMobile();
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
      features: projectFeatures,
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
          controller: finalData.workflows[targetIndex]?.name || "",
          relation,
          isParent: true,
        };

        const relationChild: Relation = {
          controller:  finalData.workflows[sourceIndex]?.name || "",
          relation,
          isParent: false,
        };

        finalData.workflows[sourceIndex]?.relations.push(relationParent);
        finalData.workflows[targetIndex]?.relations.push(relationChild);
      });
      try {
        const response = await saveWorkflow(finalData);
        console.log('Saved:', response.message);
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }
  }, [corsSettings, projectName, projectFeatures, rfInstance]);

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



  const handleSettings = (name: string, cors: CorsOptionsCustom, features: ProjectFeatures) => {
    setProjectName(name);
    setCorsSettings(cors);
    setProjectFeatures(features);
  };

  const handleInitialSetup = (config: InitialSetupConfig) => {
    // Set project name and features
    setProjectName(config.projectName);
    setProjectFeatures(config.features);

    // If email auth is enabled, we need a User entity regardless
    if (config.enableEmailAuth || config.useInitialSetup) {
      // Define User entity props based on email auth
      const userProps = config.enableEmailAuth ? [
        { name: 'email', type: 'string' as const, nullable: false, validation: [{ type: 'email' as const }] },
        { name: 'password', type: 'string' as const, nullable: false, validation: [{ type: 'minLength' as const, value: 8 }] },
        { name: 'firstName', type: 'string' as const, nullable: true },
        { name: 'lastName', type: 'string' as const, nullable: true },
        { name: 'isEmailVerified', type: 'boolean' as const, nullable: false },
        { name: 'emailVerificationToken', type: 'string' as const, nullable: true },
        { name: 'passwordResetToken', type: 'string' as const, nullable: true },
        { name: 'passwordResetTokenExpiry', type: 'date' as const, nullable: true },
        { name: 'refreshToken', type: 'string' as const, nullable: true },
        { name: 'lastLoginAt', type: 'date' as const, nullable: true },
        { name: 'createdAt', type: 'date' as const, nullable: false },
        { name: 'updatedAt', type: 'date' as const, nullable: false },
      ] : [
        { name: 'email', type: 'string' as const, nullable: false, validation: [{ type: 'email' as const }] },
        { name: 'firstName', type: 'string' as const, nullable: true },
        { name: 'lastName', type: 'string' as const, nullable: true },
        { name: 'createdAt', type: 'date' as const, nullable: false },
        { name: 'updatedAt', type: 'date' as const, nullable: false },
      ];

      // Create entities based on configuration
      const demoNodes: NodeProps[] = [
        // User entity (always included when email auth or initial setup is enabled)
        {
          id: `user-${Date.now()}`,
          type: 'card',
          position: { x: 50, y: 50 },
          data: {
            name: 'User',
            props: userProps,
            relations: [],
          },
        },
      ];

      // Add additional demo entities only if initial setup is enabled
      if (config.useInitialSetup) {
        demoNodes.push(
          // Post entity
          {
            id: `post-${Date.now()}`,
            type: 'card',
            position: { x: 350, y: 50 },
            data: {
              name: 'Post',
              props: [
                { name: 'title', type: 'string' as const, nullable: false, validation: [{ type: 'minLength' as const, value: 3 }] },
                { name: 'content', type: 'string' as const, nullable: false },
                { name: 'published', type: 'boolean' as const, nullable: false },
                { name: 'publishedAt', type: 'date' as const, nullable: true },
                { name: 'createdAt', type: 'date' as const, nullable: false },
                { name: 'updatedAt', type: 'date' as const, nullable: false },
              ],
              relations: [
                { relation: 'one-to-many', isParent: false, controller: 'User' }
              ],
            },
          },
          // Comment entity
          {
            id: `comment-${Date.now()}`,
            type: 'card',
            position: { x: 200, y: 300 },
            data: {
              name: 'Comment',
              props: [
                { name: 'content', type: 'string' as const, nullable: false, validation: [{ type: 'minLength' as const, value: 1 }] },
                { name: 'createdAt', type: 'date' as const, nullable: false },
                { name: 'updatedAt', type: 'date' as const, nullable: false },
              ],
              relations: [
                { relation: 'one-to-many', isParent: false, controller: 'User' },
                { relation: 'one-to-many', isParent: false, controller: 'Post' }
              ],
            },
          }
        );
      }

      setNodes(demoNodes);

      // Create relationships between entities only if we have multiple entities
      const demoEdges = [];
      
      if (config.useInitialSetup && demoNodes.length >= 3) {
        demoEdges.push(
          {
            id: 'user-post',
            source: demoNodes[0]?.id || '', // User
            target: demoNodes[1]?.id || '', // Post
            type: 'parent_child',
            data: { startLabel: 'parent', endLabel: 'child' },
          },
          {
            id: 'user-comment',
            source: demoNodes[0]?.id || '', // User
            target: demoNodes[2]?.id || '', // Comment
            type: 'parent_child',
            data: { startLabel: 'parent', endLabel: 'child' },
          },
          {
            id: 'post-comment',
            source: demoNodes[1]?.id || '', // Post
            target: demoNodes[2]?.id || '', // Comment
            type: 'parent_child',
            data: { startLabel: 'parent', endLabel: 'child' },
          }
        );
      }

      setEdges(demoEdges);
    }
  };
  // const getFeatures = (data: string[]) => {
  //   setFeatures(data);
  // };

  // copy & past nodes
  const handleCopyPasteNode = () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    if (selectedNodes.length === 0) return;

    const selectedNode = selectedNodes[0];

    const pasteNode = () => {
      const newNode: NodeProps = {
        id: getNodeId(),
        data: {
          name: selectedNode?.data.name || "",
          props: selectedNode?.data.props || [],
          relations: [],
        },
        position: {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
        },
        type: 'card',
      };
      setNodes((nds) => nds.concat(newNode));
    };

    pasteNode();
  };

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
          deleteKeyCode={['Backspace', 'Delete']}
          onPaste={handleCopyPasteNode}
          // connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          connectionLineType={ConnectionLineType.Step}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          {isMobile ? (
            <Panel position="bottom-center">
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
              </div>
            </Panel>
          ) : (
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
          )}

          {isMobile && (
            <Panel position="top-right">
              <Menu
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setDrawerOpen(true);
                }}
              />
            </Panel>
          )}

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
      <InitialSetupModal onSetupComplete={handleInitialSetup} />
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
