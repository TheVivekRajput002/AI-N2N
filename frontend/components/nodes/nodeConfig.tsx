import {
  FiZap,
  FiSend,
  FiList,
  FiClock,
  FiRotateCw,
  FiGitCommit,
} from 'react-icons/fi';
import { RiInputCursorMove } from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { RxText } from 'react-icons/rx';

export interface NodeConfigItem {
  type: string;
  category: 'Input' | 'Logic' | 'AI / Prompt' | 'Transform' | 'Output';
  data: {
    label: string;
    description: string;
    nodeData: Record<string, any>;
  };
  icon: React.ReactNode;
}

export const AllNodes: NodeConfigItem[] = [
  // === INPUT ===
  {
    type: 'trigger',
    category: 'Input',
    data: { label: 'Trigger', description: 'Initiate workflows', nodeData: {} },
    icon: <FiZap className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'input',
    category: 'Input',
    data: {
      label: 'Input',
      description: 'Define input fields',
      nodeData: {
        input: ''
      }
    },
    icon: <RiInputCursorMove className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === LOGIC ===
  {
    type: 'conditional',
    category: 'Logic',
    data: { label: 'Conditional', description: 'Branch the workflow', nodeData: {} },
    icon: <FiList className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'loop',
    category: 'Logic',
    data: { label: 'Loop', description: 'Repeat a set of actions', nodeData: {} },
    icon: <FiRotateCw className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'merge',
    category: 'Logic',
    data: { label: 'Merge', description: 'Combine multiple branches', nodeData: {} },
    icon: <FiGitCommit className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === AI / PROMPT ===
  {
    type: 'llm',
    category: 'AI / Prompt',
    data: {
      label: 'LLM',
      description: 'Execute LLM prompt',
      nodeData: {
        "api key": "",
        output: "",
      }
    },
    icon: <IoHardwareChipOutline className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === TRANSFORM ===
  {
    type: 'text',
    category: 'Transform',
    data: { label: 'Text', description: 'Pass simple static text', nodeData: {} },
    icon: <RxText className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'delay',
    category: 'Transform',
    data: { label: 'Delay', description: 'Pause the workflow', nodeData: {} },
    icon: <FiClock className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === OUTPUT ===
  {
    type: 'output',
    category: 'Output',
    data: { label: 'Output', description: 'Define output fields', nodeData: {} },
    icon: <MdOutput className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'notification',
    category: 'Output',
    data: { label: 'Notification', description: 'Send alerts or notifications', nodeData: {} },
    icon: <FiSend className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  }
];
