import { WorkflowsProps } from '@/types/types';
import { postData } from './api';

// Call your real backend endpoint, e.g., /workflows
export const saveWorkflow = async (workflow: WorkflowsProps) => {
    return await postData<WorkflowsProps, { message: string }>(
        '/workflows/generate',
        workflow, `${workflow.name}.zip`
    );
};