// src/nodes/CustomNode.tsx
import { Handle, Position } from '@xyflow/react';
import { RiInputCursorMove } from "react-icons/ri";
import { MdOutlineDownloadDone, MdOutput } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoHardwareChipOutline } from "react-icons/io5";
import { RxText } from "react-icons/rx";
import {
  FiSend,
  FiList,
  FiClock,
  FiGitCommit,
  FiBox,
} from 'react-icons/fi';

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

function CustomNode({ data, selected, type }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean, type: string }) {

  const iconMap: Record<string, React.ReactNode> = {
    input: <RiInputCursorMove />,
    conditional: <FiList />,
    merge: <FiGitCommit />,
    llm: <IoHardwareChipOutline />,
    text: <RxText />,
    delay: <FiClock />,
    output: <MdOutput />,
    notification: <FiSend />,
  };

  // Find which category the node belongs to based on label to apply proper color classes
  const getCategoryColorClass = (label: string) => {
    const inputs = ['Input'];
    const logics = ['Conditional', 'Merge'];
    const ais = ['LLM'];
    const transforms = ['Text', 'Delay'];
    const outputs = ['Output', 'Notification'];

    if (inputs.includes(label)) return 'ios-icon-bg-input';
    if (logics.includes(label)) return 'ios-icon-bg-logic';
    if (ais.includes(label)) return 'ios-icon-bg-ai';
    if (transforms.includes(label)) return 'ios-icon-bg-transform';
    if (outputs.includes(label)) return 'ios-icon-bg-output';
    return '';
  };

  return (
    <div className="w-72 bg-[var(--node-bg-color)] border border-[var(--node-border-color)] rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative">

      {/* Handles based on node type */}
      {type === "input" || type === "text" ? (
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyle}
        />
      ) : type === "output" || type === "notification" ? (
        <Handle
          type="target"
          position={Position.Left}
          style={handleStyle}
        />
      ) : type === "LLM" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle, top: `${100 / 3}%` }}
          />
          <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle, top: `${200 / 3}%` }}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={handleStyle}
          />
        </>
      ) : type === "conditional" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={handleStyle}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{ ...handleStyle, top: '35%', background: '#3b82f6' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{ ...handleStyle, top: '65%', background: '#ef4444' }}
          />
        </>
      ) : type === "merge" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle, top: '35%' }}
          />
          <Handle
            type="target"
            position={Position.Left}
            style={{ ...handleStyle, top: '65%' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={handleStyle}
          />
        </>
      ) : (
        // Default middle node
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
          <div className={`ios-node-icon-wrapper ${getCategoryColorClass(type) || 'bg-[var(--icon-bg-color)] text-[var(--icon-text-color)]'}`}>
            {
              iconMap[type] || <FiBox />
            }
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[var(--header-text-color)]">{data.label}</h3>
        </div>
        <button className="text-[var(--text-muted-color)] hover:text-[var(--text-muted-hover-color)] transition-colors flex items-center">
          <BsThreeDots />
        </button>
      </div>
      <div className="p-5 flex flex-col gap-3">

        <div className="flex flex-col gap-1">
          <div className="flex flex-col items-left gap-1.5">
            {
              type === 'llm' && (
                <label className="text-3xs text-[var(--text-muted-color)] font-sans mb-2">
                  Chatgpt Lite
                </label>
              )
            }
            <label className="text-2xs text-[var(--text-muted-color)] font-sans text-left">
              {type !== 'output' && (type === 'llm' ? 'output' : 'input')}
            </label>
          </div>
          {
            type !== 'output' &&
            <div className="relative">
              <input
                type="text"
                readOnly
                // disabled
                value={
                  type === 'llm'
                    ? (typeof data.nodeData?.output === 'object' && data.nodeData?.output !== null
                        ? JSON.stringify(data.nodeData.output)
                        : (data.nodeData?.output ?? ''))
                    : (data.nodeData?.input ?? '')
                }
                className="w-full pointer-events-none h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>
          }
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

export default CustomNode;