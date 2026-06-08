"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { type Node } from '@xyflow/react';
import { apiGet } from '@/utils/api';
import {
  FiInfo,
  FiList,
  FiSliders,
  FiLayers,
  FiTrash2,
  FiCopy,
  FiSave,
  FiPlus,
  FiX,
  FiMoreHorizontal,
  FiZap,
  FiChevronDown,
  FiChevronRight,
  FiRotateCw,
  FiGitCommit,
  FiClock,
  FiSend
} from 'react-icons/fi';
import { 
  RiInputCursorMove,
  RiDatabaseLine
} from 'react-icons/ri';
import { MdOutput } from 'react-icons/md';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { RxText } from 'react-icons/rx';

interface FlowBarProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onSave?: () => void;
}

export default function FlowBar({ nodes, setNodes, onSave }: FlowBarProps) {
  const { workflowId } = useParams() as { workflowId: string };
  const selectedNode = nodes.find((n) => n.selected);

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
    const inputs = ['Input', 'Trigger'];
    const logics = ['Conditional', 'Loop', 'Merge'];
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

  const nodeIconsMap: Record<string, React.ReactNode> = {
    Trigger: <FiZap />,
    Input: <RiInputCursorMove />,
    Conditional: <FiList />,
    Loop: <FiRotateCw />,
    Merge: <FiGitCommit />,
    LLM: <IoHardwareChipOutline />,
    Text: <RxText />,
    Delay: <FiClock />,
    Output: <MdOutput />,
    Notification: <FiSend />,
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
        
        {selectedNode && (
          <button
            onClick={() => {
              // Deselect the selected node to return to pane view
              setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
            }}
            className="p-1 rounded-md text-[var(--flowbar-text-secondary)] hover:text-[var(--flowbar-text-primary)] transition-colors"
            title="Deselect Node"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-1 divide-y divide-[var(--flowbar-section-border)]">
        
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
                    <div className="ios-flowbar-label pl-0.5">Parameters</div>
                    {Object.entries((selectedNode.data.nodeData as Record<string, any>) || {}).map(([key, val]) => (
                      // Exclude the 'type' field if rendered above
                      key !== 'type' && (
                        <div key={key} className="flex flex-col gap-1 bg-[var(--flowbar-input-bg)] p-2 rounded-lg border border-[var(--flowbar-input-border)]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-2xs font-semibold text-[var(--flowbar-text-secondary)]">{key}</span>
                          </div>
                          <input
                            type="text"
                            value={val === null || val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val) : val}
                            onChange={(e) => updateNodeDataField(key, e.target.value)}
                            readOnly={selectedNode.type === "llm"}
                            className="w-full bg-[var(--node-bg-color)] border border-[var(--flowbar-input-border)] rounded-md px-2 py-1 text-2xs font-mono text-[var(--flowbar-text-primary)] focus:outline-none focus:border-[var(--flowbar-input-focus)]"
                          />
                        </div>
                      )
                    ))}
                    
                    {Object.keys((selectedNode.data.nodeData as Record<string, any>) || {}).filter(k => k !== 'type').length === 0 && (
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
                    <span className="ios-flowbar-row-label">Status</span>
                    <span className="ios-flowbar-row-value text-emerald-500 font-semibold">Enabled</span>
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
                </div>
              )}
            </div>

            {/* Runtime Settings Section (collapsible) */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('runtime')}
              >
                <span className="ios-flowbar-section-title">Runtime Settings</span>
                <FiMoreHorizontal size={14} className="text-[var(--flowbar-text-secondary)]" />
              </div>

              {!collapsedSections.runtime && (
                <div className="flex flex-col gap-3.5 mt-1.5">
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-[var(--flowbar-text-secondary)]">Auto-run on trigger</span>
                    <button
                      type="button"
                      onClick={() => setRuntimeSettings(prev => ({ ...prev, autoRun: !prev.autoRun }))}
                      className={`px-3 py-1 font-bold text-[10.5px] rounded-lg transition-all border ${runtimeSettings.autoRun ? 'bg-[hsla(var(--ios-orange),0.12)] border-[hsla(var(--ios-orange),0.2)] text-[hsl(var(--ios-orange))]' : 'bg-[var(--flowbar-btn-secondary)] border-[var(--flowbar-input-border)] text-[var(--flowbar-text-secondary)]'}`}
                    >
                      [ {runtimeSettings.autoRun ? 'On' : 'Off'} ]
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-[var(--flowbar-text-secondary)]">Timeout (ms)</span>
                    <input
                      type="number"
                      value={runtimeSettings.timeout}
                      onChange={(e) => setRuntimeSettings(prev => ({ ...prev, timeout: Number(e.target.value) }))}
                      className="w-16 h-7 bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] rounded-lg text-center font-mono font-bold text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-[var(--flowbar-text-secondary)]">Retry attempts</span>
                    <input
                      type="number"
                      value={runtimeSettings.retryAttempts}
                      onChange={(e) => setRuntimeSettings(prev => ({ ...prev, retryAttempts: Number(e.target.value) }))}
                      className="w-16 h-7 bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] rounded-lg text-center font-mono font-bold text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="text-[var(--flowbar-text-secondary)]">Stop on error</span>
                    <button
                      type="button"
                      onClick={() => setRuntimeSettings(prev => ({ ...prev, stopOnError: !prev.stopOnError }))}
                      className={`px-3 py-1 font-bold text-[10.5px] rounded-lg transition-all border ${runtimeSettings.stopOnError ? 'bg-[hsla(var(--ios-orange),0.12)] border-[hsla(var(--ios-orange),0.2)] text-[hsl(var(--ios-orange))]' : 'bg-[var(--flowbar-btn-secondary)] border-[var(--flowbar-input-border)] text-[var(--flowbar-text-secondary)]'}`}
                    >
                      [ {runtimeSettings.stopOnError ? 'On' : 'Off'} ]
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Variables Section (collapsible) */}
            <div className="ios-flowbar-section">
              <div 
                className="ios-flowbar-section-header cursor-pointer"
                onClick={() => toggleSection('variables')}
              >
                <span className="ios-flowbar-section-title">Variables</span>
                <FiMoreHorizontal size={14} className="text-[var(--flowbar-text-secondary)]" />
              </div>

              {!collapsedSections.variables && (
                <div className="flex flex-col gap-2 mt-1">
                  {workflowVars.map((v, index) => (
                    <div key={index} className="flex items-center justify-between text-xs py-0.5">
                      <span className="font-mono text-2xs text-[var(--flowbar-text-secondary)]">{v.key}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-2xs text-[var(--flowbar-text-primary)] font-semibold">{v.value}</span>
                        <button
                          onClick={() => handleDeleteWorkflowVar(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Variable"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add dynamic variable form */}
                  <form onSubmit={handleAddWorkflowVar} className="flex gap-1.5 mt-2 pt-2 border-t border-[var(--flowbar-section-border)]">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      className="flex-1 min-w-0 bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] rounded-lg px-2 py-1 text-2xs font-mono focus:outline-none focus:border-[var(--flowbar-input-focus)]"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={newVarValue}
                      onChange={(e) => setNewVarValue(e.target.value)}
                      className="flex-1 min-w-0 bg-[var(--flowbar-input-bg)] border border-[var(--flowbar-input-border)] rounded-lg px-2 py-1 text-2xs font-mono focus:outline-none focus:border-[var(--flowbar-input-focus)]"
                    />
                    <button
                      type="submit"
                      className="bg-[var(--flowbar-input-focus)] hover:opacity-90 text-white rounded-lg p-1 flex items-center justify-center shrink-0"
                      title="Add Variable"
                    >
                      <FiPlus size={12} />
                    </button>
                  </form>
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
              className="ios-flowbar-btn-primary"
              title="Save current workflow to cloud"
            >
              <FiSave size={14} className="mr-1.5" />
              Save Change
            </button>

            <div className="flex gap-2">
              <button
                className="ios-flowbar-btn-secondary"
                title="Duplicate workflow"
              >
                <FiCopy size={13} className="mr-1.5" />
                Duplicate Flow
              </button>
              
              <button
                className="ios-flowbar-btn-trash"
                title="Delete workflow"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
