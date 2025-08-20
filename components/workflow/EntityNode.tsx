'use client';

import React, { memo } from 'react';
import { Handle, Position, Node } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '@/lib/store/workflowStore';
import { WorkflowProps } from '@/types/types';

const EntityNode = memo(({ id, data, selected }: Node<WorkflowProps>) => {
  const { setSelectedNodeId } = useWorkflowStore();

  const handleNodeClick = () => {
    setSelectedNodeId(id);
  };

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'string': return 'bg-blue-100 text-blue-800';
      case 'number': case 'int': case 'float': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'date': case 'datetime': return 'bg-orange-100 text-orange-800';
      case 'json': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`min-w-[200px] cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={handleNodeClick}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-blue-500 !border-white !border-2"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-blue-500 !border-white !border-2"
      />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {data.name || 'Untitled Entity'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {data.props && data.props.length > 0 ? (
          <div className="space-y-2">
            {data.props.slice(0, 5).map((prop, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 truncate flex-1">
                  {prop.name}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${getTypeColor(prop.type)}`}
                >
                  {prop.type}
                </Badge>
              </div>
            ))}
            {data.props.length > 5 && (
              <div className="text-xs text-gray-500 italic">
                +{data.props.length - 5} more properties
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            No properties defined
          </div>
        )}
        
        {data.relations && data.relations.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              {data.relations.length} relationship{data.relations.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

EntityNode.displayName = 'EntityNode';

export default EntityNode;