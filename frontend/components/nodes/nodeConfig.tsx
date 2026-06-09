import {
  FiZap,
  FiList,
  FiClock,
  FiRotateCw,
  FiLayers,
  FiGlobe,
  FiMail,
} from 'react-icons/fi';
import { RiInputCursorMove } from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { IoHardwareChipOutline } from 'react-icons/io5';

export interface NodeConfigItem {
  type: string;
  category: 'Input / Starter' | 'AI / Prompt' | 'Logic' | 'Transform' | 'Integration' | 'Output';
  data: {
    label: string;
    description: string;
    nodeData: Record<string, any>;
  };
  icon: React.ReactNode;
}

export const AllNodes: NodeConfigItem[] = [
  // === Input / Starter ===
  {
    type: 'trigger',
    category: 'Input / Starter',
    data: { label: 'Trigger', description: 'Initiate workflows', nodeData: {} },
    icon: <FiZap className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'input',
    category: 'Input / Starter',
    data: {
      label: 'Input',
      description: 'Define input fields',
      nodeData: {
        input: ''
      }
    },
    icon: <RiInputCursorMove className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === AI / Prompt ===
  {
    type: 'llm',
    category: 'AI / Prompt',
    data: {
      label: 'LLM',
      description: 'Execute LLM prompt',
      nodeData: {
        "api key": "",
        output: "",
        "system prompt": "answer in less than 100 words"
      }
    },
    icon: <IoHardwareChipOutline className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === Logic ===
  {
    type: 'conditional',
    category: 'Logic',
    data: { label: 'Conditional', description: 'Branch the workflow', nodeData: {} },
    icon: <FiList className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'switch',
    category: 'Logic',
    data: {
      label: 'Switch',
      description: 'Route execution to N branches',
      nodeData: {
        cases: []
      }
    },
    icon: <FiLayers className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'loop',
    category: 'Logic',
    data: {
      label: 'Loop',
      description: 'Iterate over an array',
      nodeData: {
        arrayPath: '',
        mode: 'sequential'
      }
    },
    icon: <FiRotateCw className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === Transform ===
  {
    type: 'delay',
    category: 'Transform',
    data: {
      label: 'Delay',
      description: 'Pause the workflow',
      nodeData: {
        time: ''
      }
    },
    icon: <FiClock className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === Integration ===
  {
    type: 'http_get',
    category: 'Integration',
    data: {
      label: 'HTTP GET',
      description: 'Make HTTP GET request',
      nodeData: {
        url: '',
        headers: ''
      }
    },
    icon: <FiGlobe className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'http_post',
    category: 'Integration',
    data: {
      label: 'HTTP POST',
      description: 'Make HTTP POST request',
      nodeData: {
        url: '',
        headers: '',
        body: ''
      }
    },
    icon: <FiGlobe className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },

  // === Output ===
  {
    type: 'output',
    category: 'Output',
    data: {
      label: 'Output',
      description: 'Define output fields',
      nodeData: {
        output: ''
      }
    },
    icon: <MdOutput className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  },
  {
    type: 'email',
    category: 'Output',
    data: {
      label: 'Email',
      description: 'Send email notification',
      nodeData: {
        email: '',
        subject: '',
        message: ''
      }
    },
    icon: <FiMail className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
  }
];
