"use client"

import React, { useState } from 'react';
import { 
  FiActivity, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiSliders, 
  FiPlay, 
  FiArrowRight, 
  FiFolder, 
  FiRefreshCw,
  FiExternalLink,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { apiPost } from '@/utils/api';

interface DashboardStats {
  totalWorkflows: number;
  activeWorkflowsCount: number;
  totalExecutions: number;
  statusCounts: {
    SUCCESS: number;
    FAILED: number;
    RUNNING: number;
    PENDING: number;
    CANCELLED: number;
  };
  avgDuration: number;
}

interface ChartDay {
  dateStr: string;
  SUCCESS: number;
  FAILED: number;
  total: number;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  workspaceId: string;
  updatedAt: string;
  workspace: {
    name: string;
    color: string;
  };
  executions: Array<{
    status: string;
    startedAt: string;
  }>;
}

interface ExecutionItem {
  id: string;
  status: string;
  triggeredBy: string;
  totalDuration: number | null;
  startedAt: string;
  workflow: {
    name: string;
  };
}

interface DashboardClientProps {
  initialData: {
    stats: DashboardStats;
    chartData: ChartDay[];
    recentWorkflows: WorkflowItem[];
    recentExecutions: ExecutionItem[];
  } | null;
  error: string | null;
}

// ---------------- Helper Formats ----------------
const formatDuration = (ms: number | null) => {
  if (ms === null || ms === undefined || ms === 0) return '0s';
  if (ms < 1000) return `${ms}ms`;
  const secs = ms / 1000;
  if (secs < 60) return `${secs.toFixed(1)}s`;
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.round(secs % 60);
  return `${mins}m ${remainingSecs}s`;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTimeAgo = (isoString: string) => {
  const date = new Date(isoString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ---------------- Radial Success Gauge ----------------
const SuccessRateGauge = ({ rate }: { rate: number }) => {
  const radius = 32;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          stroke="var(--ios-card-border)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-colors duration-300"
        />
        {/* Progress circle */}
        <circle
          stroke="hsl(var(--ios-green))"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-extrabold text-[var(--ios-text-primary)]">
        {Math.round(rate)}%
      </span>
    </div>
  );
};

// ---------------- Custom SVG Performance Chart ----------------
const PerformanceChart = ({ data }: { data: ChartDay[] }) => {
  const maxTotal = Math.max(...data.map(d => d.total), 5); // default to scale of at least 5
  
  const height = 180;
  const width = 500;
  const paddingLeft = 35;
  const paddingBottom = 25;
  const chartHeight = height - paddingBottom;
  const chartWidth = width - paddingLeft;
  
  const barWidth = 32;
  const gap = (chartWidth - (data.length * barWidth)) / (data.length + 1);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative flex-1 min-h-[180px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-[var(--ios-text-primary)] select-none">
          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - (ratio * chartHeight);
            const gridVal = Math.round(ratio * maxTotal);
            return (
              <g key={index} className="opacity-30 dark:opacity-20">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width} 
                  y2={y} 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] fill-current opacity-70 font-medium"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Bar Charts */}
          {data.map((day, idx) => {
            const x = paddingLeft + gap + idx * (barWidth + gap);
            
            const successHeight = (day.SUCCESS / maxTotal) * chartHeight;
            const failedHeight = (day.FAILED / maxTotal) * chartHeight;
            
            const successY = chartHeight - successHeight;
            const failedY = successY - failedHeight; // stacked on top
            
            return (
              <g key={idx} className="group cursor-pointer">
                {/* Background full bar hover indicator */}
                <rect 
                  x={x - 4} 
                  y={0} 
                  width={barWidth + 8} 
                  height={chartHeight} 
                  fill="currentColor" 
                  className="opacity-0 group-hover:opacity-[0.02] dark:group-hover:opacity-[0.04] transition-opacity duration-200" 
                  rx={8}
                />

                {/* Successful Executions Bar (Green) */}
                {day.SUCCESS > 0 && (
                  <rect 
                    x={x} 
                    y={successY} 
                    width={barWidth} 
                    height={successHeight} 
                    fill="url(#successGradient)" 
                    rx={day.FAILED === 0 ? 4 : 0} 
                    className="transition-all duration-500 ease-out"
                  />
                )}

                {/* Failed Executions Bar (Red) */}
                {day.FAILED > 0 && (
                  <rect 
                    x={x} 
                    y={failedY} 
                    width={barWidth} 
                    height={failedHeight} 
                    fill="url(#failedGradient)" 
                    rx={4} 
                    className="transition-all duration-500 ease-out"
                  />
                )}

                {/* Empty State placeholder column */}
                {day.total === 0 && (
                  <rect 
                    x={x + barWidth/2 - 1.5} 
                    y={chartHeight - 4} 
                    width={3} 
                    height={4} 
                    fill="currentColor" 
                    className="opacity-10 dark:opacity-20"
                    rx={1.5}
                  />
                )}

                {/* Day Text */}
                <text 
                  x={x + barWidth / 2} 
                  y={height - 6} 
                  textAnchor="middle" 
                  className="text-[10px] fill-current opacity-60 font-semibold tracking-tight"
                >
                  {day.dateStr}
                </text>

                {/* Tooltip on Hover */}
                <title>{`${day.dateStr}: ${day.SUCCESS} Success, ${day.FAILED} Failed`}</title>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--ios-green))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(var(--ios-green))" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--ios-red))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(var(--ios-red))" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// ---------------- Dashboard Page Main Client Component ----------------
const DashboardClient = ({ initialData, error }: DashboardClientProps) => {
  const { getToken } = useAuth();
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [runStatusMsg, setRunStatusMsg] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const stats = data?.stats;
  const chartData = data?.chartData || [];
  const recentWorkflows = data?.recentWorkflows || [];
  const recentExecutions = data?.recentExecutions || [];

  // Manual trigger execution handler
  const handleQuickRun = async (workflowId: string) => {
    if (runningWorkflowId) return; // limit to one concurrent click triggers
    setRunningWorkflowId(workflowId);
    setRunStatusMsg(null);

    try {
      const token = await getToken();
      const response = await apiPost<{ success: boolean; message: string; execution?: any }>(
        `/executions/workflow/${workflowId}`, 
        { triggeredBy: 'MANUAL', input: {} }, 
        token
      );
      
      if (response.success) {
        setRunStatusMsg({ 
          id: workflowId, 
          success: true, 
          msg: 'Workflow executed successfully!' 
        });
        // refresh data automatically after short wait
        setTimeout(() => handleRefresh(false), 2000);
      } else {
        setRunStatusMsg({ 
          id: workflowId, 
          success: false, 
          msg: response.message || 'Workflow execution failed.' 
        });
      }
    } catch (err: any) {
      setRunStatusMsg({ 
        id: workflowId, 
        success: false, 
        msg: err?.message || 'API network error.' 
      });
    } finally {
      setRunningWorkflowId(null);
      // clear notifications after 5s
      setTimeout(() => setRunStatusMsg(null), 5000);
    }
  };

  // Manual statistics refresh
  const handleRefresh = async (showLoading = true) => {
    if (isRefreshing) return;
    if (showLoading) setIsRefreshing(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/executions/dashboard/stats`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const successRate = stats && stats.totalExecutions > 0 
    ? (stats.statusCounts.SUCCESS / stats.totalExecutions) * 100 
    : 100;

  return (
    <div className="flex-1 w-screen h-screen overflow-y-auto bg-[var(--app-bg-color)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[hsl(var(--ios-blue))]">
                <MdOutlineSpaceDashboard size={28} />
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ios-text-primary)]">
                Dashboard
              </h1>
            </div>
            <p className="text-sm text-[var(--ios-text-muted)] mt-1.5 font-medium">
              Operational overview of your workflows and analytics
            </p>
          </div>

          <button
            onClick={() => handleRefresh(true)}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[var(--ios-card-border)] bg-[var(--ios-card-bg)] backdrop-blur-md shadow-[var(--ios-card-shadow)] text-[var(--ios-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
            title="Refresh statistics"
          >
            <FiRefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-[hsla(var(--ios-red),0.1)] border border-[hsla(var(--ios-red),0.2)] text-[hsl(var(--ios-red))] rounded-2xl text-sm font-semibold flex items-center gap-2">
            <FiXCircle size={16} />
            <span>Failed to connect to backend api. Rendered dashboard in static fallback mode.</span>
          </div>
        )}

        {/* ---------------- Stat KPI Widgets Grid ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: Total Runs */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 transition-all duration-300 select-none flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ios-text-muted)]">
                Total Runs
              </span>
              <h3 className="text-3xl font-extrabold mt-1 text-[var(--ios-text-primary)] font-headline-lg">
                {stats?.totalExecutions ?? 0}
              </h3>
              <p className="text-[11px] text-[var(--ios-text-muted)] mt-1 font-medium">
                Overall executions count
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[hsla(var(--ios-blue),0.12)] text-[hsl(var(--ios-blue))] flex items-center justify-center">
              <FiActivity size={20} className="hover:animate-pulse" />
            </div>
          </div>

          {/* Card: Success Rate */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 transition-all duration-300 select-none flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ios-text-muted)]">
                Success Rate
              </span>
              <h3 className="text-3xl font-extrabold mt-1 text-[var(--ios-text-primary)] font-headline-lg">
                {stats ? `${Math.round(successRate)}%` : '0%'}
              </h3>
              <p className="text-[11px] text-[var(--ios-text-muted)] mt-1 font-medium">
                Healthy executions percentage
              </p>
            </div>
            <SuccessRateGauge rate={successRate} />
          </div>

          {/* Card: Average Duration */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 transition-all duration-300 select-none flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ios-text-muted)]">
                Avg Duration
              </span>
              <h3 className="text-3xl font-extrabold mt-1 text-[var(--ios-text-primary)] font-headline-lg">
                {formatDuration(stats?.avgDuration ?? 0)}
              </h3>
              <p className="text-[11px] text-[var(--ios-text-muted)] mt-1 font-medium">
                Successful runs speed
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[hsla(var(--ios-purple),0.12)] text-[hsl(var(--ios-purple))] flex items-center justify-center">
              <FiClock size={20} />
            </div>
          </div>

          {/* Card: Active Pipelines */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:-translate-y-1 transition-all duration-300 select-none flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ios-text-muted)]">
                Enabled Pipelines
              </span>
              <h3 className="text-3xl font-extrabold mt-1 text-[var(--ios-text-primary)] font-headline-lg">
                {stats ? `${stats.activeWorkflowsCount} / ${stats.totalWorkflows}` : '0 / 0'}
              </h3>
              <p className="text-[11px] text-[var(--ios-text-muted)] mt-1 font-medium">
                Active workflows ratio
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[hsla(var(--ios-orange),0.12)] text-[hsl(var(--ios-orange))] flex items-center justify-center">
              <FiSliders size={20} className="rotate-90" />
            </div>
          </div>

        </div>

        {/* ---------------- Analytics Chart Section ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Wrapper: occupying 2 columns */}
          <div className="lg:col-span-2 p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 select-none">
              <div>
                <h3 className="text-lg font-bold text-[var(--ios-text-primary)]">Execution Performance</h3>
                <p className="text-xs text-[var(--ios-text-muted)] font-medium">Total pipeline runs over the past 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[hsl(var(--ios-green))]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--ios-green))]" />
                  Success
                </span>
                <span className="flex items-center gap-1.5 text-[hsl(var(--ios-red))]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--ios-red))]" />
                  Failed
                </span>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[200px] w-full pt-4">
                <PerformanceChart data={chartData} />
              </div>
            ) : (
              <div className="h-[200px] w-full flex flex-col items-center justify-center text-[var(--ios-text-muted)] border border-dashed border-[var(--ios-card-border)] rounded-2xl">
                <FiActivity size={24} className="opacity-40 mb-2" />
                <span className="text-xs font-medium">No run analytics available for last 7 days</span>
              </div>
            )}
          </div>

          {/* Quick Actions Panel: occupying 1 column */}
          <div className="p-6 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--ios-text-primary)]">Quick Actions</h3>
              <p className="text-xs text-[var(--ios-text-muted)] font-medium mb-5">Common tasks to get you started quickly</p>
              
              <div className="flex flex-col gap-3">
                <Link
                  href="/workspaces"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--ios-blue))]"><FiFolder size={18} /></span>
                    <span className="text-sm font-semibold text-[var(--ios-text-primary)]">Go to Workspaces</span>
                  </div>
                  <FiArrowRight size={14} className="text-[var(--ios-text-muted)]" />
                </Link>

                <Link
                  href="/templates"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--ios-card-border)] hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--ios-purple))]"><FiLayers size={18} /></span>
                    <span className="text-sm font-semibold text-[var(--ios-text-primary)]">Browse templates</span>
                  </div>
                  <FiArrowRight size={14} className="text-[var(--ios-text-muted)]" />
                </Link>
              </div>
            </div>

            <div className="p-4 bg-[hsla(var(--ios-blue),0.06)] border border-[hsla(var(--ios-blue),0.1)] rounded-2xl text-[11px] text-[var(--ios-text-muted)] flex items-start gap-2.5 mt-6">
              <span className="text-[hsl(var(--ios-blue))] mt-0.5"><FiBookOpen size={14} /></span>
              <div>
                <p className="font-bold text-[var(--ios-text-primary)] mb-0.5">Need help?</p>
                Explore templates or view execution details by clicking their links. Integrate pipelines into your API by generating endpoints in pipeline versions.
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- Recent Pipelines Grid ---------------- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--ios-text-primary)]">Recent Pipelines</h3>
            <Link 
              href="/workspaces" 
              className="text-xs font-semibold text-[hsl(var(--ios-blue))] hover:underline flex items-center gap-1"
            >
              <span>View all workspaces</span>
              <FiArrowRight size={12} />
            </Link>
          </div>

          {recentWorkflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] px-6">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-3">
                <FiSliders size={22} className="rotate-90" />
              </div>
              <h4 className="text-sm font-bold text-[var(--ios-text-primary)]">No workflows found</h4>
              <p className="text-xs text-[var(--ios-text-muted)] mt-1.5 max-w-xs leading-relaxed">
                Create your first pipeline inside a workspace to start automation.
              </p>
              <Link
                href="/workspaces"
                className="mt-4 inline-flex items-center gap-1.5 bg-[hsl(var(--ios-blue))] text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:brightness-105 active:scale-95 shadow-sm transition-all"
              >
                <span>Go to Workspaces</span>
                <FiArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentWorkflows.map((workflow) => {
                const workspaceInitials = workflow.workspace.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const isTriggering = runningWorkflowId === workflow.id;
                const statusInfo = runStatusMsg?.id === workflow.id ? runStatusMsg : null;

                return (
                  <div
                    key={workflow.id}
                    className="p-5 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {/* Parent Workspace Tag */}
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `hsla(var(--ios-${workflow.workspace.color}), 0.12)`,
                            color: `hsl(var(--ios-${workflow.workspace.color}))`,
                          }}
                        >
                          <FiFolder size={10} />
                          <span>{workflow.workspace.name}</span>
                        </span>

                        <span className="text-[11px] text-[var(--ios-text-muted)] font-medium">
                          Updated {formatTimeAgo(workflow.updatedAt)}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-[var(--ios-text-primary)] line-clamp-1">
                        {workflow.name}
                      </h4>
                      <p className="text-xs text-[var(--ios-text-muted)] mt-1.5 leading-relaxed line-clamp-2 min-h-[2.2rem]">
                        {workflow.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Notification display for trigger status */}
                    {statusInfo && (
                      <div className={`mt-3 p-2 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 ${
                        statusInfo.success 
                          ? 'bg-[hsla(var(--ios-green),0.1)] text-[hsl(var(--ios-green))]' 
                          : 'bg-[hsla(var(--ios-red),0.1)] text-[hsl(var(--ios-red))]'
                      }`}>
                        {statusInfo.success ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                        <span>{statusInfo.msg}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-[var(--ios-card-border)]">
                      {/* Active Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        workflow.isEnabled ? 'text-[hsl(var(--ios-green))]' : 'text-[var(--ios-text-muted)]'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${workflow.isEnabled ? 'bg-[hsl(var(--ios-green))]' : 'bg-gray-400'}`} />
                        <span>{workflow.isEnabled ? 'Enabled' : 'Disabled'}</span>
                      </span>

                      {/* Controls: Go to Builder vs Run */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/workspaces/${workflow.workspaceId}/${workflow.id}`}
                          className="p-2.5 text-xs font-bold text-[hsl(var(--ios-blue))] hover:bg-[hsl(var(--ios-blue))]/5 active:scale-95 transition-all rounded-xl border border-[var(--ios-card-border)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Builder</span>
                          <FiExternalLink size={12} />
                        </Link>
                        
                        <button
                          onClick={() => handleQuickRun(workflow.id)}
                          disabled={isTriggering}
                          className="bg-[hsl(var(--ios-blue))] hover:brightness-105 active:scale-95 disabled:opacity-50 text-white font-bold text-xs p-2.5 rounded-xl shadow-[0_4px_12px_rgba(var(--ios-blue),0.2)] flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Trigger a quick manual execution run"
                        >
                          <FiPlay size={11} className={`${isTriggering ? 'animate-spin' : 'fill-current'}`} />
                          <span>{isTriggering ? 'Running...' : 'Run'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------- Recent Executions History Log Table ---------------- */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-[var(--ios-text-primary)] select-none">Recent Executions</h3>
          
          <div className="overflow-hidden bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] rounded-3xl backdrop-blur-md shadow-[var(--ios-card-shadow)]">
            {recentExecutions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--ios-text-muted)] mb-3">
                  <FiActivity size={22} />
                </div>
                <h4 className="text-sm font-bold text-[var(--ios-text-primary)]">No executions found</h4>
                <p className="text-xs text-[var(--ios-text-muted)] mt-1.5 max-w-xs leading-relaxed">
                  Executions logs will be displayed here as your pipelines run.
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--ios-card-border)] text-xs font-bold uppercase tracking-wider text-[var(--ios-text-muted)] select-none">
                      <th className="px-6 py-4">Pipeline</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Trigger</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Started At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ios-card-border)] font-medium text-[var(--ios-text-primary)]">
                    {recentExecutions.map((exec) => {
                      // Status Badge configuration
                      const statusConfig: Record<string, { label: string; textClass: string; bgClass: string; icon: any }> = {
                        SUCCESS: { 
                          label: 'Success', 
                          textClass: 'text-[hsl(var(--ios-green))]', 
                          bgClass: 'bg-[hsla(var(--ios-green),0.1)]', 
                          icon: FiCheckCircle 
                        },
                        FAILED: { 
                          label: 'Failed', 
                          textClass: 'text-[hsl(var(--ios-red))]', 
                          bgClass: 'bg-[hsla(var(--ios-red),0.1)]', 
                          icon: FiXCircle 
                        },
                        RUNNING: { 
                          label: 'Running', 
                          textClass: 'text-[hsl(var(--ios-blue))]', 
                          bgClass: 'bg-[hsla(var(--ios-blue),0.1)]', 
                          icon: FiRefreshCw 
                        },
                        PENDING: { 
                          label: 'Pending', 
                          textClass: 'text-[var(--ios-text-muted)]', 
                          bgClass: 'bg-black/5 dark:bg-white/5', 
                          icon: FiClock 
                        },
                        CANCELLED: { 
                          label: 'Cancelled', 
                          textClass: 'text-[var(--ios-text-muted)]', 
                          bgClass: 'bg-black/5 dark:bg-white/5', 
                          icon: FiXCircle 
                        }
                      };

                      const config = statusConfig[exec.status] || {
                        label: exec.status,
                        textClass: 'text-[var(--ios-text-muted)]',
                        bgClass: 'bg-black/5 dark:bg-white/5',
                        icon: FiClock
                      };

                      const StatusIcon = config.icon;

                      return (
                        <tr 
                          key={exec.id}
                          className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                        >
                          {/* Pipeline Name */}
                          <td className="px-6 py-4 font-bold text-[var(--ios-text-primary)]">
                            {exec.workflow?.name || 'Deleted Workflow'}
                          </td>
                          
                          {/* Status Badge */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${config.textClass} ${config.bgClass}`}>
                              <StatusIcon size={12} className={exec.status === 'RUNNING' ? 'animate-spin' : ''} />
                              <span>{config.label}</span>
                            </span>
                          </td>
                          
                          {/* Trigger By */}
                          <td className="px-6 py-4 text-xs font-bold text-[var(--ios-text-muted)]">
                            {exec.triggeredBy}
                          </td>
                          
                          {/* Duration */}
                          <td className="px-6 py-4 text-[var(--ios-text-primary)]">
                            {formatDuration(exec.totalDuration)}
                          </td>
                          
                          {/* Started At */}
                          <td className="px-6 py-4 text-xs text-[var(--ios-text-muted)] font-medium">
                            {formatDate(exec.startedAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardClient;
