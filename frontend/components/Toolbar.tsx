// toolbar.js

import { DraggableNode } from './nodes/DraggableNode';

export const PipelineToolbar = () => {

    return (
        // <div className=' w-full h-16 flex items-center justify-center bg-red-400 p-6' >
            <div className='absolute top-4 flex flex-wrap gap-4 mt-10 z-50' >
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
            </div>
        // </div>
    );
};