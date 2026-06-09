// src/nodes/categories/OutputNode.tsx
import { Handle, Position } from '@xyflow/react';
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDownloadDone, MdOutput } from "react-icons/md";
import { FiMail, FiBox } from 'react-icons/fi';

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

function OutputNode({ data, selected, type }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean, type: string }) {

  const iconMap: Record<string, React.ReactNode> = {
    output: <MdOutput />,
    email: <FiMail />,
  };

  const categoryColorClass = 'ios-icon-bg-output';

  return (
    <div className={`w-72 bg-[var(--node-bg-color)] border ${selected ? 'border-[var(--nodes-item-hover-border)] ring-1 ring-[var(--nodes-item-hover-border)]' : 'border-[var(--node-border-color)]'} rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative`}>

      {/* Output category nodes only have target handles on the left */}
      <Handle
        type="target"
        position={Position.Left}
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
        {type === 'output' ? (
          <div className="flex flex-col gap-1">
            <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
              Output
            </label>
            <input
              type="text"
              readOnly
              value={data.nodeData?.output ?? ''}
              placeholder="Final output value..."
              className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
            />
          </div>
        ) : type === 'email' ? (
          <div className="flex flex-col gap-3">
            {/* Email field */}
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Email
              </label>
              <input
                type="text"
                readOnly
                value={data.nodeData?.email ?? ''}
                placeholder="recipient@example.com"
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>

            {/* Subject field */}
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Subject
              </label>
              <input
                type="text"
                readOnly
                value={data.nodeData?.subject ?? ''}
                placeholder="Email Subject"
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>

            {/* Message field */}
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Message
              </label>
              <textarea
                readOnly
                value={data.nodeData?.message ?? ''}
                placeholder="Email body message..."
                className="w-full pointer-events-none h-16 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg p-2 resize-none font-sans text-xxs text-[var(--input-text-color)] focus:outline-none transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="text-2xs text-[var(--text-muted-color)] italic font-sans text-center py-2">
            No configuration needed
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

export default OutputNode;
