import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

interface ResizableNodeSelectedProps {
  data: {
    label: string;
  };
}

const ResizableNodeSelected = ({ data }: ResizableNodeSelectedProps) => {
  return (
    <>
      <NodeResizer color="#ff0071" minWidth={100} minHeight={30} />
      <div style={{ padding: 10 }} className="w-[200px] h-[200px]">
        {data.label}
      </div>
    </>
  );
};

export default memo(ResizableNodeSelected);
