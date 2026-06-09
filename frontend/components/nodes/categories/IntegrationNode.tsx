// src/nodes/categories/IntegrationNode.tsx
import { Handle, Position } from '@xyflow/react';
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { FiGlobe, FiBox } from 'react-icons/fi';

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

function IntegrationNode({ data, selected, type }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean, type: string }) {

  const iconMap: Record<string, React.ReactNode> = {
    http_get: <FiGlobe />,
    http_post: <FiGlobe />,
  };

  // Integration categories color - using a custom style or blue-ish/cyan-ish styling. Let's make it look premium
  // In NodesLibrary, we don't have Integration color defined yet, but we'll define it. Let's map it to an attractive background class.
  // We can use ios-icon-bg-transform (orange) or ios-icon-bg-logic (blue). Let's use a nice integration style.
  // Wait, let's look at getCategoryClass in NodesLibrary:
  // We can add text-[var(--nodes-item-icon-color)] or custom style. Let's use logic or custom color class.
  const categoryColorClass = 'bg-[hsla(var(--ios-blue),0.12)] text-[hsl(var(--ios-blue))]';

  return (
    <div className={`w-72 bg-[var(--node-bg-color)] border ${selected ? 'border-[var(--nodes-item-hover-border)] ring-1 ring-[var(--nodes-item-hover-border)]' : 'border-[var(--node-border-color)]'} rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative`}>

      {/* Integration nodes have input on left, output on right */}
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
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
        {/* URL field */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
            URL
          </label>
          <input
            type="text"
            readOnly
            value={data.nodeData?.url ?? ''}
            placeholder="https://api.example.com/endpoint"
            className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
          />
        </div>

        {/* Headers field */}
        <div className="flex flex-col gap-1">
          <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
            Headers
          </label>
          <input
            type="text"
            readOnly
            value={data.nodeData?.headers ?? ''}
            placeholder='{"Content-Type": "application/json"}'
            className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
          />
        </div>

        {/* Body field (only for POST) */}
        {type === 'http_post' && (
          <div className="flex flex-col gap-1">
            <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
              Body
            </label>
            <input
              type="text"
              readOnly
              value={data.nodeData?.body ?? ''}
              placeholder='{"key": "value"}'
              className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
            />
          </div>
        )}
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

export default IntegrationNode;
