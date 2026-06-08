

// src/nodes/CustomNode.tsx
import { Handle, Position } from '@xyflow/react'
import { RiInputCursorMove } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoHardwareChipOutline } from "react-icons/io5";
import { MdOutput } from "react-icons/md";
import { RxText } from "react-icons/rx";
import {
  FiPlay,
  FiFileText,
  FiGlobe,
  FiAnchor,
  FiUpload,
  FiDatabase,
  FiGitBranch,
  FiRefreshCw,
  FiRotateCw,
  FiGitCommit,
  FiGitPullRequest,
  FiCpu,
  FiMessageSquare,
  FiFile,
  FiLayers,
  FiMic,
  FiGrid,
  FiImage,
  FiSliders,
  FiType,
  FiCode,
  FiTerminal,
  FiPlusCircle,
  FiCalendar,
  FiMap,
  FiMail,
  FiSend,
  FiServer,
  FiSlack,
  FiZap,
  FiBox,
  FiClock,
  FiList,
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

function CustomNode({ data, selected }: { data: { label: string; description?: string, nodeData?: Record<string, any> }, selected: boolean }) {

  const iconMap: Record<string, React.ReactNode> = {
    // Legacy / fallback mappings
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

    // New categories mappings
    // Input
    'Start': <FiPlay />,
    'Form Input': <FiFileText />,
    'HTTP Request': <FiGlobe />,
    'Webhook': <FiAnchor />,
    'File Upload': <FiUpload />,
    'Database Query': <FiDatabase />,
    
    // Logic
    'If/Else': <FiGitBranch />,
    'Switch': <FiRefreshCw />,
    'Loop/For Each': <FiRotateCw />,
    'Split': <FiGitPullRequest />,
    
    // AI / Prompt
    'LLM Prompt': <FiCpu />,
    'Chat Completion': <FiMessageSquare />,
    'Text Summariz': <FiFile />,
    'Text Embedding': <FiLayers />,
    'Audio': <FiMic />,
    'Analysis': <FiGrid />,
    'Image': <FiImage />,
    
    // Transform
    'Set Variable': <FiSliders />,
    'Format Text': <FiType />,
    'Parse JSON': <FiCode />,
    'Build JSON': <FiTerminal />,
    'Math Expression': <FiPlusCircle />,
    'Date Formatter': <FiCalendar />,
    'Data Mapper': <FiMap />,
    
    // Output
    'Send Email': <FiMail />,
    'Post Webhook': <FiSend />,
    'Database Insert': <FiServer />,
    'Slack': <FiSlack />,
  };

  // Find which category the node belongs to based on label to apply proper color classes
  const getCategoryColorClass = (label: string) => {
    const inputs = ['Input', 'Start', 'Form Input', 'HTTP Request', 'Webhook', 'File Upload', 'Database Query', 'Trigger'];
    const logics = ['Logic', 'Conditional', 'Decision', 'If/Else', 'Switch', 'Loop/For Each', 'Loop', 'Merge', 'Split'];
    const ais = ['AI / Prompt', 'LLM', 'LLM Prompt', 'Chat Completion', 'Text Summariz', 'Text Embedding', 'Audio', 'Analysis', 'Image'];
    const transforms = ['Transform', 'Text', 'Set Variable', 'Format Text', 'Parse JSON', 'Build JSON', 'Math Expression', 'Date Formatter', 'Data Mapper', 'Delay'];
    const outputs = ['Output', 'Notification', 'Send Email', 'Post Webhook', 'Database Insert', 'Slack'];

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
      {data.label === "Input" || data.label === "Text" || data.label === "Trigger" || data.label === "Start" || data.label === "Webhook" ? (
        <Handle
          type="source"
          position={Position.Right}
          style={handleStyle}
        />
      ) : data.label === "Output" || data.label === "Send Email" || data.label === "Post Webhook" || data.label === "Database Insert" || data.label === "Slack" ? (
        <Handle
          type="target"
          position={Position.Left}
          style={handleStyle}
        />
      ) : data.label === "LLM" || data.label === "LLM Prompt" || data.label === "Chat Completion" ? (
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
      ) : data.label === "Conditional" || data.label === "Decision" || data.label === "If/Else" || data.label === "Split" ? (
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
      ) : data.label === "Merge" ? (
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
          <div className={`ios-node-icon-wrapper ${getCategoryColorClass(data.label) || 'bg-[var(--icon-bg-color)] text-[var(--icon-text-color)]'}`}>
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
              {data.label !== 'LLM' && data.label !== 'LLM Prompt' && data.label !== 'Chat Completion' && (data.label === 'Text' || data.label === 'Format Text' ? 'Text' : 'Name')}
              {(data.label === 'LLM' || data.label === 'LLM Prompt' || data.label === 'Chat Completion') && ' This is LLM'}
            </label>
          </div>
          {
            data.label !== 'LLM' && data.label !== 'LLM Prompt' && data.label !== 'Chat Completion' &&
            <div className="relative">
              <input
                type="text"
                value={data.nodeData?.input || 'nodeData.inputt'}
                className="w-full h-8 bg-[var(--input-bg-color)] border border-[var(--input-border-color)] rounded-lg px-3 font-mono text-xxs text-[var(--input-text-color)] focus:outline-none focus:border-[var(--input-focus-border-color)] focus:bg-[var(--input-focus-bg-color)] transition-all"
              />
            </div>
          }
        </div>

        {
          (data.label === 'Input' || data.label === 'Form Input' || data.label === 'Output') && (
            <div className="flex flex-col gap-1">
              <label className="text-2xs text-[var(--text-muted-color)] font-sans pl-0.5 text-left">Type</label>
              <div className="relative">
                <select
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