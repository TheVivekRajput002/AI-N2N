

// src/nodes/CustomNode.jsx
import { Handle, Position } from '@xyflow/react'
import { RiInputCursorMove } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoHardwareChipOutline } from "react-icons/io5";
import { MdOutput } from "react-icons/md";
import { RxText } from "react-icons/rx";
import {
  FiZap,
  FiSend,
  FiList,
  FiClock,
  FiRotateCw,
  FiBox,
  FiGitCommit,
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


function CustomNode({ data, selected }: { data: { label: string; description?: string }, selected: boolean }) {
  
  const iconMap = {
    Input: <RiInputCursorMove />,
    LLM: <IoHardwareChipOutline />,
    Output: <MdOutput />,
    Text: <RxText />,
    Trigger: <FiZap />,
    Notification: <FiSend />,
    Conditional: <FiList />,
    Delay: <FiClock />,
    Loop: <FiRotateCw />,
    Merge: <FiGitCommit />,
  };

  return (
    <div className="w-72 bg-[var(--node-bg-color)] border border-[var(--node-border-color)] rounded-xl node-shadow transition-all duration-200 hover:node-active-shadow select-none relative">

      {/* Handles based on node type */}
      {data.label === "Input" || data.label === "Text" || data.label === "Trigger" ? (
        <Handle
          type="source"
          position={Position.Right}
          // id={data.label === "Text" ? `${id}-ouput` : `${id}-value`}
          style={handleStyle}
        />
      ) : data.label === "Output" ? (
        <Handle
          type="target"
          position={Position.Left}
          // id={`${id}-value`}
          style={handleStyle}
        />
      ) : data.label === "LLM" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-system`}
            style={{ ...handleStyle, top: `${100 / 3}%` }}
          />
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-prompt`}
            style={{ ...handleStyle, top: `${200 / 3}%` }}
          />
          <Handle
            type="source"
            position={Position.Right}
            // id={`${id}-response`}
            style={handleStyle}
          />
        </>
      ) : data.label === "Conditional" || data.label === "Decision" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-target`}
            style={handleStyle}
          />
          <Handle
            type="source"
            position={Position.Right}
            // id={`${id}-true`}
            style={{ ...handleStyle, top: '35%', background: '#3b82f6' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            // id={`${id}-false`}
            style={{ ...handleStyle, top: '65%', background: '#ef4444' }}
          />
        </>
      ) : data.label === "Merge" ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-input-1`}
            style={{ ...handleStyle, top: '35%' }}
          />
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-input-2`}
            style={{ ...handleStyle, top: '65%' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            // id={`${id}-output`}
            style={handleStyle}
          />
        </>
      ) : (
        // Default middle node
        <>
          <Handle
            type="target"
            position={Position.Left}
            // id={`${id}-target`}
            style={handleStyle}
          />
          <Handle
            type="source"
            position={Position.Right}
            // id={`${id}-source`}
            style={handleStyle}
          />
        </>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--header-border-color)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-[var(--icon-bg-color)] rounded text-[var(--icon-text-color)]">
            {
              iconMap[data.label] || <FiBox />
            }
          </div>
          <h3 className="text-sm font-bold tracking-tight text-[var(--header-text-color)]">{data.label}</h3>
        </div>
        <button className="text-[var(--text-muted-color)] hover:text-[var(--text-muted-hover-color)] transition-colors flex items-center">
          <BsThreeDots />
        </button>
      </div>
     <div className="p-4 flex flex-col gap-3">

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <label className="text-2xs text-[var(--text-muted-color)] font-sans">
                                {data.label !== 'LLM' && (data.label === 'Text' ? 'Text' : 'Name')}
                                {data.label === 'LLM' && ' This is LLM'}
                            </label>
                        </div>
                        {
                            data.label !== 'LLM' &&
                            <div className="relative">
                                <input
                                    type="text"
                                    // value={currName}
                                    // onChange={handleNameChange}
                                    className="w-full h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
                                />
                            </div>
                        }
                    </div>

                    {
                        (data.label === 'Input' || data.label === 'Output') && (
                            <div className="flex flex-col gap-1">
                                <label className="text-2xs text-[var(--text-muted-color)] font-sans pl-0.5">Type</label>
                                <div className="relative">
                                    <select
                                        // value={dataType}
                                        // onChange={handleTypeChange}
                                        className="w-full h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg pl-3 pr-8 font-sans text-xs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Text">Text</option>
                                        <option value="File">File</option>
                                    </select>
                                    <MdExpandMore className="absolute right-2 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        )
                    }

                </div>

                <div className="px-4 py-2 bg-[var(--footer-bg-color)] border-t border-[var(--footer-border-color)] rounded-b-xl flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[var(--text-muted-color)] text-xs">
                        <MdOutlineDownloadDone />
                        <span>Ready</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[var(--footer-accent-color)]">id</span>
                </div>


    </div>
  )
}

export default CustomNode