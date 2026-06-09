// src/nodes/categories/LogicNode.tsx
import { Handle, Position } from '@xyflow/react';
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { FiList, FiBox } from 'react-icons/fi';

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

function LogicNode({ data, selected, type }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean, type: string }) {

  const iconMap: Record<string, React.ReactNode> = {
    conditional: <FiList />,
  };

  const categoryColorClass = 'ios-icon-bg-logic';

  return (
    <div className={`w-72 bg-[var(--node-bg-color)] border ${selected ? 'border-[var(--nodes-item-hover-border)] ring-1 ring-[var(--nodes-item-hover-border)]' : 'border-[var(--node-border-color)]'} rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative`}>

      {/* Handles */}
      {type === 'conditional' ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyle}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ ...handleStyle, top: '35%', background: '#3b82f6' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ ...handleStyle, top: '65%', background: '#ef4444' }}
          />
        </>
      ) : (
        <>
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
        </>
      )}

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
        {type === 'conditional' ? (
          <div className="text-2xs text-[var(--text-muted-color)] italic font-sans text-center py-2">
            Splits path based on conditions.
            <div className="flex justify-between mt-3 font-mono font-semibold px-2">
              <span className="text-blue-500">○ True</span>
              <span className="text-red-500">○ False</span>
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

export default LogicNode;
