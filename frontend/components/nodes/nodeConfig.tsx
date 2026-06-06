
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

export const AllNodes = [
    {
        type: 'input',
        data: { label: 'Input', description: 'Define input fields' },
        icon: <RiInputCursorMove className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'llm',
        data: { label: 'LLM', description: 'Execute LLM prompt' },
        icon: <IoHardwareChipOutline className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'output',
        data: { label: 'Output', description: 'Define output fields' },
        icon: <MdOutput className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'text',
        data: { label: 'Text', description: 'Pass simple static text' },
        icon: <RxText className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'trigger',
        data: { label: 'Trigger', description: 'Initiate workflows' },
        icon: <FiZap className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'notification',
        data: { label: 'Notification', description: 'Send alerts or notifications' },
        icon: <FiSend className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'conditional',
        data: { label: 'Conditional', description: 'Branch the workflow' },
        icon: <FiList className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'delay',
        data: { label: 'Delay', description: 'Pause the workflow' },
        icon: <FiClock className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'loop',
        data: { label: 'Loop', description: 'Repeat a set of actions' },
        icon: <FiRotateCw className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
    {
        type: 'merge',
        data: { label: 'Merge', description: 'Combine multiple branches' },
        icon: <FiGitCommit className="w-5 h-5 text-[var(--nodes-item-icon-color)]" />
    },
];

