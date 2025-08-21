import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Node, Edge } from '@xyflow/react';
import { WorkflowProps, CorsOptionsCustom, RelationTypes, ProjectFeatures } from '@/types/types';

interface WorkflowState {
  // Project settings
  projectName: string;
  corsSettings: CorsOptionsCustom;
  projectFeatures: ProjectFeatures;

  // Canvas state
  nodes: Node<WorkflowProps>[];
  edges: Edge[];

  // UI state
  isGenerating: boolean;
  selectedNodeId: string | null;
  isSettingsOpen: boolean;

  // Validation state
  validationErrors: string[];

  // Actions
  setProjectName: (name: string) => void;
  setCorsSettings: (cors: CorsOptionsCustom) => void;
  setProjectFeatures: (features: ProjectFeatures) => void;
  setNodes: (nodes: Node<WorkflowProps>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node<WorkflowProps>) => void;
  updateNode: (id: string, data: Partial<WorkflowProps>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  updateEdge: (id: string, data: { relation: RelationTypes }) => void;
  removeEdge: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setValidationErrors: (errors: string[]) => void;
  clearWorkflow: () => void;
  validateWorkflow: () => boolean;
}

const getNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        projectName: 'Untitled Project',
        corsSettings: {},
        projectFeatures: {
          testDataSeeding: {
            enabled: false,
            recordCount: 10,
            locale: 'en',
            customSeed: false,
          },
          apiDocumentation: {
            enabled: false,
            title: '',
            description: '',
            version: '1.0.0',
            includeSwaggerUI: true,
          },
          emailAuth: {
            enabled: false,
            provider: 'nodemailer',
            templates: {
              verification: true,
              passwordReset: true,
              welcome: false,
            },
          },
          oauthProviders: {
            enabled: false,
            providers: [],
            callbackUrls: {},
          },
          paymentIntegration: {
            enabled: false,
            provider: 'stripe',
            features: [],
          },
        },
        nodes: [],
        edges: [],
        isGenerating: false,
        selectedNodeId: null,
        isSettingsOpen: false,
        validationErrors: [],

        // Actions
        setProjectName: (name) => set({ projectName: name }),
        setCorsSettings: (cors) => set({ corsSettings: cors }),
        setProjectFeatures: (features) => set({ projectFeatures: features }),
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),

        addNode: (node) => {
          const newNode = {
            ...node,
            id: node.id || getNodeId(),
            data: {
              ...node.data,
              name: node.data?.name ?? 'Untitled Entity',
              props: node.data?.props ?? [],
              relations: node.data?.relations ?? []
            }
          };
          set((state) => ({
            nodes: [...state.nodes, newNode],
            selectedNodeId: newNode.id
          }));
        },

        updateNode: (id, data) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, ...data } }
                : node
            )
          }));
        },

        removeNode: (id) => {
          set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
          }));
        },

        addEdge: (edge) => {
          set((state) => ({
            edges: [...state.edges, edge]
          }));
        },

        updateEdge: (id, data) => {
          set((state) => ({
            edges: state.edges.map((edge) =>
              edge.id === id
                ? { ...edge, data: { ...edge.data, ...data } }
                : edge
            )
          }));
        },

        removeEdge: (id) => {
          set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id)
          }));
        },

        setSelectedNodeId: (id) => set({ selectedNodeId: id }),
        setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
        setIsGenerating: (isGenerating) => set({ isGenerating }),
        setValidationErrors: (errors) => set({ validationErrors: errors }),

        clearWorkflow: () => set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          validationErrors: [],
          projectName: 'Untitled Project',
          corsSettings: {},
          projectFeatures: {
            testDataSeeding: { enabled: false, recordCount: 10, locale: 'en', customSeed: false },
            apiDocumentation: { enabled: false, title: '', description: '', version: '1.0.0', includeSwaggerUI: true },
            emailAuth: { enabled: false, provider: 'nodemailer', templates: { verification: true, passwordReset: true, welcome: false } },
            oauthProviders: { enabled: false, providers: [], callbackUrls: {} },
            paymentIntegration: { enabled: false, provider: 'stripe', features: [] },
          }
        }),

        validateWorkflow: () => {
          const state = get();
          const errors: string[] = [];

          // Validate project name
          if (!state.projectName.trim()) {
            errors.push('Project name is required');
          }

          // Validate nodes
          if (state.nodes.length === 0) {
            errors.push('At least one entity is required');
          }

          const entityNames = new Set<string>();
          state.nodes.forEach((node) => {
            const name = node.data.name.toLowerCase().trim();

            // Check for empty names
            if (!name) {
              errors.push(`Entity with ID ${node.id} has no name`);
              return;
            }

            // Check for duplicate names
            if (entityNames.has(name)) {
              errors.push(`Duplicate entity name: ${node.data.name}`);
            } else {
              entityNames.add(name);
            }

            // Validate properties
            const propertyNames = new Set<string>();
            node.data.props?.forEach((prop) => {
              const propName = prop.name.toLowerCase().trim();

              if (!propName) {
                errors.push(`Entity "${node.data.name}" has a property with no name`);
                return;
              }

              if (propertyNames.has(propName)) {
                errors.push(`Entity "${node.data.name}" has duplicate property: ${prop.name}`);
              } else {
                propertyNames.add(propName);
              }
            });
          });

          // Validate relationships
          state.edges.forEach((edge) => {
            const sourceNode = state.nodes.find(n => n.id === edge.source);
            const targetNode = state.nodes.find(n => n.id === edge.target);

            if (!sourceNode || !targetNode) {
              errors.push('Invalid relationship: connected entities not found');
              return;
            }

            if (!edge.data?.relation) {
              errors.push(`Relationship between ${sourceNode.data.name} and ${targetNode.data.name} has no type defined`);
            }
          });

          set({ validationErrors: errors });
          return errors.length === 0;
        }
      }),
      {
        name: 'workflow-store',
        partialize: (state) => ({
          projectName: state.projectName,
          corsSettings: state.corsSettings,
          projectFeatures: state.projectFeatures,
          nodes: state.nodes,
          edges: state.edges
        })
      }
    ),
    { name: 'workflow-store' }
  )
);