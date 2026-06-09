"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { type Node } from '@xyflow/react';
import { apiGet } from '@/utils/api';
import { useExecutionStore } from '@/utils/store';
import {
  FiInfo,
  FiList,
  FiSliders,
  FiTrash2,
  FiCopy,
  FiSave,
  FiPlus,
  FiX,
  FiMoreHorizontal,
  FiChevronDown,
  FiChevronRight,
  FiGitCommit,
  FiClock,
  FiSend,
  FiGlobe,
  FiMail,
} from 'react-icons/fi';
import { 
  RiInputCursorMove,
  RiDatabaseLine
} from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { RxText } from 'react-icons/rx';
import ReactMarkdown from 'react-markdown';

// Custom sidebar toggle icon that matches the design (split panel icon)
const SidebarToggleIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M15 3v18" />
  </svg>
);

interface FlowBarProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onSave?: () => void;
}

export default function FlowBar({ nodes, setNodes, onSave }: FlowBarProps) {
  const { workflowId } = useParams() as { workflowId: string };
  const selectedNode = nodes.find((n) => n.selected);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { lastExecutionDuration, lastExecutionStatus } = useExecutionStore();

  const formatNodeSlug = (label: string) => {
    return (label || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  };

  const getSuggestedProperties = (nodeType: string) => {
    const type = (nodeType || '').toLowerCase();
    if (type === 'llm') return ['output', 'model', 'provider'];
    if (type === 'http_get' || type === 'http_post') return ['output', 'status'];
    if (type === 'input') return ['output'];
    if (type === 'conditional') return ['output', 'conditionMet'];
    return ['output'];
  };

  const compileRulesToExpression = (rulesList: any[], comb: 'AND' | 'OR') => {
    if (!rulesList || rulesList.length === 0) return 'true';
    const ruleExpressions = rulesList.map(rule => {
      const field = rule.field || 'input';
      const op = rule.operator || 'equals';
      const val = rule.value || '';
      
      const isNumeric = !isNaN(Number(val)) && val.trim() !== '';
      const formattedValue = isNumeric ? val : JSON.stringify(val);
      const formattedField = field === 'input' || field === 'value' ? 'input' : field;
      
      switch (op) {
        case 'contains':
          return `(${formattedField} && String(${formattedField}).includes(${JSON.stringify(val)}))`;
        case 'not_contains':
          return `(${formattedField} && !String(${formattedField}).includes(${JSON.stringify(val)}))`;
        case 'equals':
          return `(String(${formattedField}) === String(${JSON.stringify(val)}) || ${formattedField} === ${formattedValue})`;
        case 'not_equals':
          return `(String(${formattedField}) !== String(${JSON.stringify(val)}) && ${formattedField} !== ${formattedValue})`;
        case 'gt':
          return `(Number(${formattedField}) > ${Number(val) || 0})`;
        case 'lt':
          return `(Number(${formattedField}) < ${Number(val) || 0})`;
        case 'gte':
          return `(Number(${formattedField}) >= ${Number(val) || 0})`;
        case 'lte':
          return `(Number(${formattedField}) <= ${Number(val) || 0})`;
        default:
          return 'true';
      }
    });
    
    const joinOp = comb === 'OR' ? ' || ' : ' && ';
    return ruleExpressions.join(joinOp);
  };

  // Auto-expand when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setIsCollapsed(false);
    }
  }, [selectedNode]);

  // Workflow states
  const [workflowDetails, setWorkflowDetails] = useState<{
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    versionNumber: number;
    isEnabled: boolean;
  }>({
    name: 'Simple Workflow Template',
    description: 'Add a short description...',
    createdAt: '',
    updatedAt: '',
    versionNumber: 1,
    isEnabled: true,
  });

  // Runtime settings (Workflow level)
  const [runtimeSettings, setRuntimeSettings] = useState({
    autoRun: true,
    timeout: 3000,
    retryAttempts: 2,
    stopOnError: true,
  });

  // Workflow variables
  const [workflowVars, setWorkflowVars] = useState<Array<{ key: string; value: string }>>([
    { key: 'user_id', value: '"usr_17832"' },
    { key: 'response_time', value: '148ms' },
  ]);

  // Section visibility states
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    info: false,
    properties: false,
    runtime: false,
    variables: false,
    nodeInfo: false,
    nodeData: false,
  });

  // Temp variables for adding a new variable / field
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');


  // Fetch workflow metadata from backend
  useEffect(() => {
    if (!workflowId) return;

    const fetchWorkflowData = async () => {
      try {
        const response = await apiGet<{
          success: boolean;
          workflowName?: string;
          description?: string;
          createdAt?: string;
          updatedAt?: string;
          isEnabled?: boolean;
          workflowVersion?: {
            versionNumber: number;
          };
        }>(`/workflow-version?workflowId=${workflowId}`);

        if (response.success) {
          setWorkflowDetails({
            name: response.workflowName || 'Simple Workflow Template',
            description: response.description || 'Add a short description...',
            createdAt: response.createdAt || new Date().toISOString(),
            updatedAt: response.updatedAt || new Date().toISOString(),
            versionNumber: response.workflowVersion?.versionNumber || 1,
            isEnabled: response.isEnabled ?? true,
          });
        }
      } catch (err) {
        console.error('Failed to fetch workflow meta in FlowBar:', err);
      }
    };

    fetchWorkflowData();
  }, [workflowId, selectedNode]); // Refresh meta details when deselecting or transitioning

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Node operations
  const updateNodeField = (fieldName: string, value: any) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [fieldName]: value
            },
          };
        }
        return node;
      })
    );
  };

  const updateNodeDataField = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          const currentNodeData = (node.data as any).nodeData || {};
          return {
            ...node,
            data: {
              ...node.data,
              nodeData: {
                ...currentNodeData,
                [key]: value,
              },
            },
          };
        }
        return node;
      })
    );
  };

  const updateNodeDataFields = (updates: Record<string, any>) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          const currentNodeData = (node.data as any).nodeData || {};
          return {
            ...node,
            data: {
              ...node.data,
              nodeData: {
                ...currentNodeData,
                ...updates,
              },
            },
          };
        }
        return node;
      })
    );
  };

  const deleteCurrentNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
  };

  const duplicateCurrentNode = () => {
    if (!selectedNode) return;
    const newNode: Node = {
      ...selectedNode,
      id: String(crypto.randomUUID()),
      position: {
        x: selectedNode.position.x + 40,
        y: selectedNode.position.y + 40,
      },
      selected: true,
    };
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, selected: false } : n)).concat(newNode)
    );
  };



  // Add variable to workflow level
  const handleAddWorkflowVar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarKey.trim()) return;
    setWorkflowVars((prev) => [...prev, { key: newVarKey.trim(), value: newVarValue }]);
    setNewVarKey('');
    setNewVarValue('');
  };

  const handleDeleteWorkflowVar = (index: number) => {
    setWorkflowVars((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Node icons and colors helper
  const getNodeCategoryColorClass = (label: string) => {
    const inputs = ['Input'];
    const logics = ['Conditional', 'Merge'];
    const ais = ['LLM'];
    const transforms = ['Text', 'Delay'];
    const integrations = ['HTTP GET', 'HTTP POST'];
    const outputs = ['Output', 'Email', 'Notification'];

    if (inputs.includes(label)) return 'ios-icon-bg-input';
    if (logics.includes(label)) return 'ios-icon-bg-logic';
    if (ais.includes(label)) return 'ios-icon-bg-ai';
    if (transforms.includes(label)) return 'ios-icon-bg-transform';
    if (integrations.includes(label)) return 'bg-[hsla(var(--ios-blue),0.12)] text-[hsl(var(--ios-blue))]';
    if (outputs.includes(label)) return 'ios-icon-bg-output';
    return '';
  };

  const nodeIconsMap: Record<string, React.ReactNode> = {
    Input: <RiInputCursorMove />,
    Conditional: <FiList />,
    Merge: <FiGitCommit />,
    LLM: <IoHardwareChipOutline />,
    Text: <RxText />,
    Delay: <FiClock />,
    'HTTP GET': <FiGlobe />,
    'HTTP POST': <FiGlobe />,
    Output: <MdOutput />,
    Email: <FiMail />,
    Notification: <FiSend />,
  };

const PROVIDER_MODELS: Record<string, string[]> = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  groq: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
};


  // Date formatter helper
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute right-4 top-16 w-11 h-11 bg-[var(--flowbar-bg)] border border-[var(--flowbar-border)] rounded-xl shadow-lg hover:shadow-xl backdrop-blur-md -webkit-backdrop-filter-md flex items-center justify-center text-[var(--flowbar-text-primary)] hover:text-[var(--flowbar-text-primary)] hover:bg-[var(--flowbar-btn-secondary-hover)] transition-all duration-200 z-45 cursor-pointer"
        title="Open Flow Details"
      >
        <SidebarToggleIcon />
      </button>
    );
  }

  return (
    <div className="absolute right-4 top-16 bottom-4 w-[310px] bg-[var(--flowbar-bg)] border border-[var(--flowbar-border)] rounded-2xl shadow-xl backdrop-blur-md -webkit-backdrop-filter-md flex flex-col overflow-hidden z-45 select-none transition-all duration-300">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--flowbar-border)]">
        <div className="flex items-center gap-2">
          {selectedNode ? (
            <>
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-sm ${getNodeCategoryColorClass(selectedNode.data.label as string) || 'bg-[var(--icon-bg-color)] text-[var(--icon-text-color)]'}`}>
                {nodeIconsMap[selectedNode.data.label as string] || <FiSliders />}
              </div>
              <h2 className="text-[15px] font-bold text-[var(--flowbar-text-primary)] font-sans tracking-tight">
                {selectedNode.data.label as string} Node
              </h2>
            </>
          ) : (
            <>
              <h2 className="text-[15.5px] font-bold text-[var(--flowbar-text-primary)] font-sans tracking-tight">
                Flow Details
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full bg-[hsla(var(--ios-green),0.12)] text-[hsl(var(--ios-green))]`}>
                Active
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          {selectedNode && (
            <button
              onClick={() => {
                // Deselect the selected node to return to pane view
                setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
              }}
              className="p-1.5 rounded-lg text-[var(--flowbar-text-secondary)] hover:text-[var(--flowbar-text-primary)] hover:bg-[var(--flowbar-btn-secondary-hover)] transition-colors cursor-pointer flex items-center justify-center"
              title="Deselect Node"
            >
              <FiX size={16} />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-[var(--flowbar-text-secondary)] hover:text-[var(--flowbar-text-primary)] hover:bg-[var(--flowbar-btn-secondary-hover)] active:bg-[var(--flowbar-btn-secondary-hover)] transition-colors cursor-pointer flex items-center justify-center"
            title="Collapse sidebar"
          >
            <SidebarToggleIcon />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-1 divide-y divide-[var(--flowbar-section-border)]">
        
        {selectedNode ? (
          /* ==============================================================
             NODE DETAILS PANEL
             ============================================================== */
          <>
            {/* Info Section (collapsible) */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('nodeInfo')}
              >
                <span className="ios-flowbar-section-title">Node Info</span>
                {collapsedSections.nodeInfo ? <FiChevronRight size={14} className="text-[var(--flowbar-text-secondary)]" /> : <FiChevronDown size={14} className="text-[var(--flowbar-text-secondary)]" />}
              </div>

              {!collapsedSections.nodeInfo && (
                <div className="flex flex-col gap-3 mt-1">
                  <div>
                    <div className="ios-flowbar-label">Label</div>
                    <input
                      type="text"
                      value={(selectedNode.data.label as string) || ''}
                      onChange={(e) => updateNodeField('label', e.target.value)}
                      className="ios-flowbar-input-box"
                      placeholder="Node Label"
                    />
                  </div>
                  <div>
                    <div className="ios-flowbar-label">Description</div>
                    <textarea
                      value={(selectedNode.data.description as string) || ''}
                      onChange={(e) => updateNodeField('description', e.target.value)}
                      className="ios-flowbar-input-box h-16 resize-none font-sans"
                      placeholder="Add a node description..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Node Data Fields Section */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('nodeData')}
              >
                <span className="ios-flowbar-section-title">Properties & Data</span>
                <FiMoreHorizontal size={14} className="text-[var(--flowbar-text-secondary)]" />
              </div>

              {!collapsedSections.nodeData && (
                <div className="flex flex-col gap-3 mt-1">
                

                  {/* List existing custom keys inside nodeData */}
                  <div className="flex flex-col gap-2.5">
                    {selectedNode.type === 'conditional' ? (
                      (() => {
                        const nodeDataObj = (selectedNode.data.nodeData || {}) as any;
                        const condition = nodeDataObj.condition || '';
                        const combinator = nodeDataObj.combinator || 'AND';
                        const rules = Array.isArray(nodeDataObj.rules) ? nodeDataObj.rules : [
                          { field: 'input', operator: 'contains', value: '' }
                        ];

                        const handleRulesChange = (updatedRules: any[], updatedComb?: 'AND' | 'OR') => {
                          const finalComb = updatedComb || combinator;
                          const compiled = compileRulesToExpression(updatedRules, finalComb);
                          updateNodeDataFields({
                            rules: updatedRules,
                            combinator: finalComb,
                            condition: compiled
                          });
                        };

                        const fieldOptions = [
                          { value: 'input', label: 'Parent Node Output' },
                          ...nodes.filter(n => n.id !== selectedNode.id).flatMap(node => {
                            const slug = formatNodeSlug(node.data.label as string);
                            const props = getSuggestedProperties(node.type || '');
                            return props.map(prop => ({
                              value: `{{${slug}.${prop}}}`,
                              label: `${node.data.label as string}.${prop}`
                            }));
                          })
                        ];

                        return (
                          <div className="flex flex-col gap-4 font-sans">
                            <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-[var(--flowbar-text-primary)]">
                                Rules List
                              </span>
                              <p className="text-[11px] text-[var(--flowbar-text-secondary)] leading-normal">
                                Define visual condition rules to route workflow execution path.
                              </p>
                            </div>

                            {/* Rules stack */}
                            <div className="flex flex-col gap-3.5">
                              {rules.map((rule: any, idx: number) => {
                                const showConnector = idx > 0;
                                return (
                                  <React.Fragment key={idx}>
                                    {showConnector && (
                                      <div className="flex justify-center -my-1.5 relative z-10">
                                        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-[var(--flowbar-input-focus)] text-white shadow-xs select-none">
                                          {combinator}
                                        </span>
                                      </div>
                                    )}

                                    {/* Spaced card for each rule */}
                                    <div className="bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] rounded-xl p-3.5 flex flex-col gap-3 relative shadow-xs hover:border-[rgba(0,122,255,0.2)] transition-all">
                                      {/* Rule header with title & delete */}
                                      <div className="flex items-center justify-between pb-1.5 border-b border-[var(--flowbar-section-border)]">
                                        <span className="text-3xs font-extrabold tracking-wider uppercase text-[var(--flowbar-text-secondary)]">
                                          Rule {idx + 1}
                                        </span>
                                        {rules.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newRules = rules.filter((_: any, rIdx: number) => rIdx !== idx);
                                              handleRulesChange(newRules);
                                            }}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                            title="Delete rule"
                                          >
                                            <FiTrash2 size={13} />
                                          </button>
                                        )}
                                      </div>

                                      {/* Field Picker Selection */}
                                      <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[var(--flowbar-text-secondary)]">
                                          When Field
                                        </label>
                                        <select
                                          value={rule.field || 'input'}
                                          onChange={(e) => {
                                            const newRules = [...rules];
                                            newRules[idx].field = e.target.value;
                                            handleRulesChange(newRules);
                                          }}
                                          className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)] cursor-pointer"
                                        >
                                          {fieldOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Operator & Value side-by-side or stacked in a clean grid */}
                                      <div className="grid grid-cols-2 gap-2.5">
                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-[11px] font-bold text-[var(--flowbar-text-secondary)]">
                                            Operator
                                          </label>
                                          <select
                                            value={rule.operator || 'contains'}
                                            onChange={(e) => {
                                              const newRules = [...rules];
                                              newRules[idx].operator = e.target.value;
                                              handleRulesChange(newRules);
                                            }}
                                            className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)] cursor-pointer"
                                          >
                                            <option value="contains">contains</option>
                                            <option value="not_contains">not contains</option>
                                            <option value="equals">equals</option>
                                            <option value="not_equals">not equals</option>
                                            <option value="gt">&gt; (greater than)</option>
                                            <option value="lt">&lt; (less than)</option>
                                            <option value="gte">&gt;= (greater or equal)</option>
                                            <option value="lte">&lt;= (less or equal)</option>
                                          </select>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-[11px] font-bold text-[var(--flowbar-text-secondary)]">
                                            Value
                                          </label>
                                          <input
                                            type="text"
                                            value={rule.value || ''}
                                            onChange={(e) => {
                                              const newRules = [...rules];
                                              newRules[idx].value = e.target.value;
                                              handleRulesChange(newRules);
                                            }}
                                            placeholder="e.g. error"
                                            className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-lg py-1.5 px-2.5 text-xs text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            </div>

                            {/* Add Rule Button & Combinator Settings */}
                            <div className="flex flex-col gap-3 mt-1.5 pt-3 border-t border-[var(--flowbar-section-border)]">
                              <button
                                type="button"
                                onClick={() => {
                                  const newRules = [...rules, { field: 'input', operator: 'contains', value: '' }];
                                  handleRulesChange(newRules);
                                }}
                                className="w-full py-2 bg-[var(--flowbar-btn-secondary)] hover:bg-[var(--flowbar-btn-secondary-hover)] active:scale-98 text-xs font-bold rounded-xl border border-[var(--flowbar-input-border)] text-[var(--flowbar-text-primary)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <FiPlus size={14} /> Add Comparison Rule
                              </button>

                              {rules.length > 1 && (
                                <div className="flex items-center justify-between bg-[var(--flowbar-input-bg)] p-2.5 rounded-xl border border-[var(--flowbar-input-border)]">
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-[var(--flowbar-text-primary)] font-sans">
                                      Match Condition
                                    </span>
                                    <span className="text-3xs text-[var(--flowbar-text-secondary)]">
                                      How to combine multiple rules
                                    </span>
                                  </div>
                                  <div className="flex bg-[var(--flowbar-btn-secondary)] p-0.5 rounded-lg border border-[var(--flowbar-input-border)]">
                                    <button
                                      type="button"
                                      onClick={() => handleRulesChange(rules, 'AND')}
                                      className={`px-3 py-1 text-3xs font-extrabold rounded-md transition-all ${combinator === 'AND' ? 'bg-[var(--node-bg-color)] text-[var(--flowbar-text-primary)] shadow-sm' : 'text-[var(--flowbar-text-secondary)]'}`}
                                    >
                                      AND
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRulesChange(rules, 'OR')}
                                      className={`px-3 py-1 text-3xs font-extrabold rounded-md transition-all ${combinator === 'OR' ? 'bg-[var(--node-bg-color)] text-[var(--flowbar-text-primary)] shadow-sm' : 'text-[var(--flowbar-text-secondary)]'}`}
                                    >
                                      OR
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Expression preview */}
                            <div className="bg-[var(--flowbar-input-bg)] p-3 rounded-xl border border-[var(--flowbar-input-border)] flex flex-col gap-1.5">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--flowbar-text-secondary)]">
                                Compiled Expression Preview
                              </span>
                              <div className="bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-lg px-2.5 py-2 font-mono text-xs text-[var(--flowbar-text-secondary)] break-all max-h-[65px] overflow-y-auto leading-relaxed">
                                {condition || 'true'}
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      (() => {
                        const nodeDataObj = { ...((selectedNode.data.nodeData as Record<string, any>) || {}) };
                        return Object.entries(nodeDataObj);
                      })().map(([key, val]) => {
                        if (key === 'type') return null;
                        const isProviderKey = key === "ai provider" || key === "company";
                        const currentNodeData = (selectedNode.data as any).nodeData || {};
                        return (
                          <div key={key} className="flex flex-col gap-1 bg-[var(--flowbar-input-bg)] p-2 rounded-lg border border-[var(--flowbar-input-border)]">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-2xs font-semibold text-[var(--flowbar-text-secondary)]">
                                {isProviderKey ? "ai provider" : key}
                              </span>
                            </div>
                            {key === "output" ? (
                              <div className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-md px-3 py-2.5 text-[11.5px] font-sans leading-relaxed text-[var(--flowbar-text-primary)] overflow-y-auto max-h-[300px] min-h-[90px]">
                                <ReactMarkdown
                                  components={{
                                    h1: ({node, ...props}: any) => <h1 className="text-sm font-bold mt-2.5 mb-1.5 border-b border-[var(--flowbar-border)] pb-0.5 text-[var(--flowbar-text-primary)]" {...props} />,
                                    h2: ({node, ...props}: any) => <h2 className="text-xs font-bold mt-2 mb-1 text-[var(--flowbar-text-primary)]" {...props} />,
                                    h3: ({node, ...props}: any) => <h3 className="text-[11px] font-bold mt-1.5 mb-1 text-[var(--flowbar-text-primary)]" {...props} />,
                                    p: ({node, ...props}: any) => <p className="mb-1.5 last:mb-0 text-[var(--flowbar-text-secondary)]" {...props} />,
                                    ul: ({node, ...props}: any) => <ul className="list-disc pl-4 mb-2 text-[var(--flowbar-text-secondary)]" {...props} />,
                                    ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 mb-2 text-[var(--flowbar-text-secondary)]" {...props} />,
                                    li: ({node, ...props}: any) => <li className="mb-0.5" {...props} />,
                                    code: ({node, ...props}: any) => <code className="bg-[var(--flowbar-input-bg)] px-1 rounded font-mono text-[10px] text-[var(--flowbar-text-primary)]" {...props} />,
                                    pre: ({node, ...props}: any) => <pre className="bg-[var(--flowbar-input-bg)] p-2 rounded font-mono text-[10px] overflow-x-auto my-1.5" {...props} />,
                                  }}
                                >
                                  {val === null || val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                                </ReactMarkdown>
                              </div>
                            ) : isProviderKey ? (
                              <select
                                value={val || 'gemini'}
                                onChange={(e) => {
                                  const newProvider = e.target.value;
                                  const defaultModel = PROVIDER_MODELS[newProvider]?.[0] || '';
                                  if (key === 'company') {
                                    const updatedNodeData = { ...currentNodeData };
                                    delete updatedNodeData['company'];
                                    updatedNodeData['ai provider'] = newProvider;
                                    updatedNodeData['model'] = defaultModel;
                                    setNodes((nds) =>
                                      nds.map((node) => {
                                        if (node.id === selectedNode.id) {
                                          return {
                                            ...node,
                                            data: {
                                              ...node.data,
                                              nodeData: updatedNodeData,
                                            },
                                          };
                                        }
                                        return node;
                                      })
                                    );
                                  } else {
                                    updateNodeDataFields({
                                      "ai provider": newProvider,
                                      model: defaultModel,
                                    });
                                  }
                                }}
                                className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-md px-2 py-1 text-2xs font-mono text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)] cursor-pointer"
                              >
                                <option value="gemini">Gemini (Google)</option>
                                <option value="openai">OpenAI</option>
                                <option value="groq">Groq</option>
                              </select>
                            ) : key === "model" ? (
                              <select
                                value={val || ''}
                                onChange={(e) => updateNodeDataField("model", e.target.value)}
                                className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-md px-2 py-1 text-2xs font-mono text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)] cursor-pointer"
                              >
                                {(PROVIDER_MODELS[currentNodeData["ai provider"] || currentNodeData.provider || currentNodeData.company || "gemini"] || []).map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={key === "api key" ? "password" : "text"}
                                value={val === null || val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val) : val}
                                onChange={(e) => updateNodeDataField(key, e.target.value)}
                                readOnly={key === "output"}
                                className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-md px-2 py-1 text-2xs font-mono text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)]"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                    
                    {Object.keys((selectedNode.data.nodeData as Record<string, any>) || {}).filter(k => k !== 'type').length === 0 && selectedNode.type !== 'conditional' && (
                      <span className="text-[11px] text-[var(--flowbar-text-secondary)] italic pl-1">No custom parameters.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ==============================================================
             WORKFLOW DETAILS PANEL
             ============================================================== */
          <>
            {/* Info section (collapsible) */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('info')}
              >
                <span className="ios-flowbar-section-title">Info</span>
                <FiMoreHorizontal size={14} className="text-[var(--flowbar-text-secondary)]" />
              </div>

              {!collapsedSections.info && (
                <div className="flex flex-col gap-3 mt-1">
                  <div>
                    <div className="ios-flowbar-label">Name</div>
                    <input
                      type="text"
                      value={workflowDetails.name}
                      onChange={(e) => setWorkflowDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="ios-flowbar-input-box"
                      placeholder="Workflow Name"
                    />
                  </div>
                  <div>
                    <div className="ios-flowbar-label">Description</div>
                    <textarea
                      value={workflowDetails.description}
                      onChange={(e) => setWorkflowDetails(prev => ({ ...prev, description: e.target.value }))}
                      className="ios-flowbar-input-box h-16 resize-none font-sans"
                      placeholder="Add a description..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Properties Section (collapsible) */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('properties')}
              >
                <span className="ios-flowbar-section-title">Properties</span>
                <FiMoreHorizontal size={14} className="text-[var(--flowbar-text-secondary)]" />
              </div>

              {!collapsedSections.properties && (
                <div className="flex flex-col gap-1.5 mt-1 font-sans">
                  <div className="ios-flowbar-row">
                    <span className="ios-flowbar-row-label">Type</span>
                    <span className="ios-flowbar-row-value text-slate-500">Workflow</span>
                  </div>
              
                  <div className="ios-flowbar-row">
                    <span className="ios-flowbar-row-label">Created</span>
                    <span className="ios-flowbar-row-value">{formatDateString(workflowDetails.createdAt)}</span>
                  </div>
                  <div className="ios-flowbar-row">
                    <span className="ios-flowbar-row-label">Updated</span>
                    <span className="ios-flowbar-row-value">{formatDateString(workflowDetails.updatedAt)}</span>
                  </div>
                  <div className="ios-flowbar-row">
                    <span className="ios-flowbar-row-label">Version</span>
                    <span className="ios-flowbar-row-value font-mono text-[11px] bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] px-1.5 py-0.5 rounded">
                      v1.{workflowDetails.versionNumber}.0
                    </span>
                  </div>
                  {lastExecutionStatus && (
                    <div className="ios-flowbar-row">
                      <span className="ios-flowbar-row-label">Last Status</span>
                      <span className={`ios-flowbar-row-value font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        lastExecutionStatus === 'SUCCESS'
                          ? 'bg-[hsla(var(--ios-green),0.12)] text-[hsl(var(--ios-green))]'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {lastExecutionStatus}
                      </span>
                    </div>
                  )}
                  {lastExecutionDuration !== null && (
                    <div className="ios-flowbar-row">
                      <span className="ios-flowbar-row-label">Duration</span>
                      <span className="ios-flowbar-row-value font-mono text-[11px] bg-[hsla(var(--ios-green),0.12)] text-[hsl(var(--ios-green))] border border-[hsla(var(--ios-green),0.2)] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <FiClock size={10} />
                        {lastExecutionDuration >= 1000
                          ? `${(lastExecutionDuration / 1000).toFixed(2)}s`
                          : `${lastExecutionDuration}ms`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
         
          </>
        )}

      </div>

      {/* Sidebar Footer (Buttons) */}
      <div className="p-4 border-t border-[var(--flowbar-border)] bg-[var(--flowbar-bg)] flex flex-col gap-2">
        {selectedNode ? (
          <>
            <div className="flex gap-2">
              <button
                onClick={duplicateCurrentNode}
                className="ios-flowbar-btn-secondary"
                title="Duplicate selected node"
              >
                <FiCopy size={14} className="mr-1.5" />
                Duplicate Node
              </button>
              
              <button
                onClick={deleteCurrentNode}
                className="ios-flowbar-btn-trash"
                title="Delete selected node"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={onSave}
              className="ios-flowbar-btn-green"
              title="Save current workflow to cloud"
            >
              <FiSave size={14} className="mr-1.5" />
              Save Change
            </button>
          </>
        )}
      </div>

    </div>
  );
}
