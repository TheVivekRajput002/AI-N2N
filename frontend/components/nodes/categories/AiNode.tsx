// src/nodes/categories/AiNode.tsx
import { Handle, Position } from '@xyflow/react';
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { IoHardwareChipOutline } from "react-icons/io5";
import { FiBox } from 'react-icons/fi';

const handleStyle = {
  right: '-6px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'var(--handle-bg-color)',
  width: '12px',
  height: '12px',
  border: '2px solid var(--handle-border-color)',
  borderRadius: '9999px',
  zIndex: 10,
  boxShadow: '0 1px 2px 0 var(--handle-shadow-color)',
  cursor: 'crosshair'
};

function AiNode({ data, selected, type }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean, type: string }) {

  const iconMap: Record<string, React.ReactNode> = {
    llm: <IoHardwareChipOutline />,
    llm_free: <IoHardwareChipOutline />,
    'llm free': <IoHardwareChipOutline />,
  };

  const categoryColorClass = 'ios-icon-bg-ai';

  return (
    <div className={`w-72 bg-[var(--node-bg-color)] border ${selected ? 'border-[var(--nodes-item-hover-border)] ring-1 ring-[var(--nodes-item-hover-border)]' : 'border-[var(--node-border-color)]'} rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative`}>

      {/* LLM node has 2 target handles on the left and 1 source handle on the right */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ ...handleStyle, top: '33.33%', left: '-6px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="apiKey"
        style={{ ...handleStyle, top: '66.67%', left: '-6px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={handleStyle}
      />

      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--header-border-color)]">
        <div className="flex items-center gap-2">
          <div className={`ios-node-icon-wrapper ${categoryColorClass}`}>
            {iconMap[type] || <FiBox />}
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[var(--header-text-color)]">{data.label}</h3>
        </div>
        <button className="text-[var(--text-muted-color)] hover:text-[var(--text-muted-hover-color)] transition-colors flex items-center">
          <BsThreeDots />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {/* Model & Provider Info */}
        <div className="flex flex-col gap-1.5 text-2xs font-sans text-left text-[var(--text-muted-color)] bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg p-2.5">
          <div className="flex justify-between items-center">
            <span>Provider</span>
            <span className="font-semibold font-mono text-xxs text-[var(--input-text-color)] uppercase">
              {data.nodeData?.['ai provider'] || data.nodeData?.provider || data.nodeData?.company || 'gemini'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Model</span>
            <span className="font-semibold font-mono text-xxs text-[var(--input-text-color)]">
              {data.nodeData?.model || 'gemini-2.5-flash'}
            </span>
          </div>
        </div>

        {/* Output field */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-left gap-1.5">
            <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
              Output
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                typeof data.nodeData?.output === 'object' && data.nodeData?.output !== null
                  ? JSON.stringify(data.nodeData.output)
                  : (data.nodeData?.output ?? '')
              }
              placeholder="LLM generated output..."
              className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-[var(--footer-bg-color)] border-t border-[var(--footer-border-color)] rounded-b-xl flex items-center justify-between">
        <div className="flex items-center gap-1 text-[var(--text-muted-color)] text-xs">
          <MdOutlineDownloadDone />
          <span>Ready</span>
        </div>
        <span className="font-mono text-xs font-bold text-[var(--footer-accent-color)]">id</span>
      </div>

    </div>
  );
}

export default AiNode;