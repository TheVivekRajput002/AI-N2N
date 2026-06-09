// src/nodes/categories/LogicNode.tsx
import { Handle, Position } from '@xyflow/react';
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDownloadDone } from "react-icons/md";
import { FiList, FiRotateCw, FiLayers, FiBox } from 'react-icons/fi';

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
    switch: <FiLayers />,
    loop: <FiRotateCw />,
  };

  const categoryColorClass = 'ios-icon-bg-logic';

  // Dynamic output handles for Switch node
  const cases = Array.isArray(data.nodeData?.cases) ? data.nodeData.cases : [];
  const totalHandles = cases.length + 1; // cases + 1 default

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
      ) : type === 'loop' ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyle}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="body"
            style={{ ...handleStyle, top: '35%', background: '#a855f7' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="done"
            style={{ ...handleStyle, top: '65%', background: '#10b981' }}
          />
        </>
      ) : type === 'switch' ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyle}
          />
          {cases.map((caseItem: any, idx: number) => {
            const topPercent = `${((idx + 1) / (totalHandles + 1)) * 100}%`;
            return (
              <Handle
                key={idx}
                type="source"
                position={Position.Right}
                id={`case_${idx}`}
                style={{ ...handleStyle, top: topPercent }}
              />
            );
          })}
          <Handle
            type="source"
            position={Position.Right}
            id="default"
            style={{ ...handleStyle, top: `${(totalHandles / (totalHandles + 1)) * 100}%`, background: '#94a3b8' }}
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
        {type === 'conditional' && (
          <div className="text-2xs text-[var(--text-muted-color)] italic font-sans text-center py-2">
            Splits path based on conditions.
            <div className="flex justify-between mt-3 font-mono font-semibold px-2">
              <span className="text-blue-500">○ True</span>
              <span className="text-red-500">○ False</span>
            </div>
          </div>
        )}

        {type === 'loop' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Array Path
              </label>
              <input
                type="text"
                readOnly
                value={data.nodeData?.arrayPath ?? ''}
                placeholder="e.g. data.items"
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Mode
              </label>
              <input
                type="text"
                readOnly
                value={data.nodeData?.mode ?? 'sequential'}
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>
            <div className="flex justify-between mt-1 font-mono font-semibold px-2">
              <span className="text-purple-500 text-3xs">○ Loop Body</span>
              <span className="text-emerald-500 text-3xs">○ Done</span>
            </div>
          </div>
        )}

        {type === 'switch' && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
                Cases
              </label>
              <input
                type="text"
                readOnly
                value={
                  Array.isArray(data.nodeData?.cases) && data.nodeData.cases.length > 0
                    ? `${data.nodeData.cases.length} case(s)`
                    : 'No cases defined'
                }
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              {cases.map((c: any, i: number) => (
                <div key={i} className="flex justify-between text-3xs font-mono bg-[var(--input-bg-color)] p-1 rounded border border-[var(--input-border-color)] text-[var(--text-muted-color)]">
                  <span>{c.label || `Case ${i+1}`}</span>
                  <span>○</span>
                </div>
              ))}
              <div className="flex justify-between text-3xs font-mono bg-[var(--input-bg-color)] p-1 rounded border border-[var(--input-border-color)] text-[var(--text-muted-color)] font-semibold">
                <span>Default</span>
                <span className="text-slate-400">○</span>
              </div>
            </div>
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
