import React, { type FC } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type Edge,
  type EdgeProps,
  useReactFlow,
} from '@xyflow/react';
import { Relations } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// this is a little helper component to render the actual edge label
function EdgeLabel({
  transform,
  label,
  children,
}: {
  transform: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.75)',
        padding: '5px 10px',
        color: '#ff5050',
        fontSize: 12,
        fontWeight: 700,
        transform,
      }}
      className="nodrag nopan pointer-events-auto"
    >
      {label}
      {children}
    </div>
  );
}

const ParentChildCustomEdge: FC<
  EdgeProps<Edge<{ startLabel: string; endLabel: string; relation: Relations }>>
> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const reactFlow = useReactFlow();

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {data && data.startLabel && (
          <EdgeLabel
            transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
            label={data.startLabel}
          />
        )}
        <EdgeLabel
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
        >
          <Select
            onValueChange={(e) => {
              reactFlow.updateEdge(id, {
                data: {
                  relation: e,
                  startLabel: 'parent',
                  endLabel: 'child',
                },
              });
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'one-to-one'}>one-to-one</SelectItem>
                <SelectItem value="one-to-many">one-to-many</SelectItem>
                <SelectItem value="many-to-many">many-to-many</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </EdgeLabel>

        {data && data.endLabel && (
          <EdgeLabel
            transform={`translate(-50%, -100%) translate(${targetX}px,${targetY}px)`}
            label={data.endLabel}
          />
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default ParentChildCustomEdge;
