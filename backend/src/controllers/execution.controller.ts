import { Request, Response } from "express";
import prisma from "../config/db";
import { executeGraph } from "../lib/executeGraph";
import { getAuth } from "@clerk/express";
import { getOrCreateUser } from "./auth.controller";

export async function executeWorkflow(req: Request, res: Response): Promise<void> {
  const { workflowId } = req.params as { workflowId: string };
  const { input, triggeredBy } = req.body;
  
  const triggerType = triggeredBy === "API" ? "API" : "MANUAL";

  try {

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { currentVersion: true },
    });

    if (!workflow) {
      res.status(404).json({ success: false, message: "Workflow not found" });
      return;
    }

    const version = workflow.currentVersion;
    if (!version) {
      res.status(400).json({
        success: false,
        message: "Workflow has no active version. Please save a version first.",
      });
      return;
    }

    const graph = version.graph as any;
    const nodes = graph?.nodes || [];
    const edges = graph?.edges || [];

    if (nodes.length === 0) {
      res.status(400).json({
        success: false,
        message: "Workflow graph has no nodes to execute.",
      });
      return;
    }

    const startedAt = new Date();
    const execution = await prisma.execution.create({
      data: {
        workflowId,
        versionId: version.id,
        status: "RUNNING",
        triggeredBy: triggerType,
        input: input || {},
        startedAt,
      },
    });

    try {
      const output = await executeGraph({
        nodes,
        edges,
        executionId: execution.id,
        globalInput: input,
      });

      const finishedAt = new Date();
      const totalDuration = finishedAt.getTime() - startedAt.getTime();

      const updatedExecution = await prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: "SUCCESS",
          output,
          finishedAt,
          totalDuration,
        },
        include: {
          nodeExecutions: {
            orderBy: { startedAt: "asc" },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Workflow executed successfully.",
        execution: updatedExecution,
      });
    } catch (execErr: any) {
      const finishedAt = new Date();
      const totalDuration = finishedAt.getTime() - startedAt.getTime();
      const errorMsg = execErr?.message || String(execErr);


      const failedExecution = await prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: "FAILED",
          error: errorMsg,
          finishedAt,
          totalDuration,
        },
        include: {
          nodeExecutions: {
            orderBy: { startedAt: "asc" },
          },
        },
      });

      res.status(200).json({
        success: false,
        message: "Workflow execution failed.",
        error: errorMsg,
        execution: failedExecution,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error occurred during execution.",
      error: error?.message || String(error),
    });
  }
}


export async function getWorkflowExecutions(req: Request, res: Response): Promise<void> {
  const { workflowId } = req.params as { workflowId: string };

  try {
    const executions = await prisma.execution.findMany({
      where: { workflowId },
      orderBy: { startedAt: "desc" },
    });

    res.status(200).json({
      success: true,
      executions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workflow executions.",
      error: error?.message || String(error),
    });
  }
}


export async function getExecutionDetails(req: Request, res: Response): Promise<void> {
  const { executionId } = req.params as { executionId: string };

  try {
    const execution = await prisma.execution.findUnique({
      where: { id: executionId },
      include: {
        nodeExecutions: {
          orderBy: { startedAt: "asc" },
        },
        version: true,
      },
    });

    if (!execution) {
      res.status(404).json({
        success: false,
        message: "Execution log not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      execution,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve execution details.",
      error: error?.message || String(error),
    });
  }
}

export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await getOrCreateUser(userId);

    // 1. Get workspaces owned by user
    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true, color: true }
    });
    const workspaceIds = workspaces.map(w => w.id);

    // 2. Get workflows in these workspaces
    const workflows = await prisma.workflow.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { updatedAt: 'desc' },
      include: {
        workspace: {
          select: { name: true, color: true }
        }
      }
    });
    const workflowIds = workflows.map(w => w.id);

    // 3. Overall statistics
    const totalWorkflows = workflows.length;
    const activeWorkflowsCount = workflows.filter(w => w.isEnabled).length;

    // Total executions
    const totalExecutions = await prisma.execution.count({
      where: { workflowId: { in: workflowIds } }
    });

    // Counts grouped by status
    const statusGroups = await prisma.execution.groupBy({
      by: ['status'],
      where: { workflowId: { in: workflowIds } },
      _count: { status: true }
    });

    const statusCounts = {
      SUCCESS: 0,
      FAILED: 0,
      RUNNING: 0,
      PENDING: 0,
      CANCELLED: 0
    };
    statusGroups.forEach(g => {
      if (g.status in statusCounts) {
        statusCounts[g.status as keyof typeof statusCounts] = g._count.status;
      }
    });

    // Average duration of success runs
    const avgDurationResult = await prisma.execution.aggregate({
      where: {
        workflowId: { in: workflowIds },
        status: 'SUCCESS',
        totalDuration: { not: null }
      },
      _avg: {
        totalDuration: true
      }
    });
    const avgDuration = Math.round(avgDurationResult._avg.totalDuration || 0);

    // 4. Executions in the last 7 days for the chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); // start of day 7 days ago

    const chartExecutions = await prisma.execution.findMany({
      where: {
        workflowId: { in: workflowIds },
        startedAt: { gte: sevenDaysAgo }
      },
      select: {
        status: true,
        startedAt: true
      }
    });

    // Group executions by day for chart (7 days: from 6 days ago until today)
    const dailyStats: Record<string, { dateStr: string, SUCCESS: number, FAILED: number, total: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const key = d.toISOString().split('T')[0];
      dailyStats[key] = { dateStr, SUCCESS: 0, FAILED: 0, total: 0 };
    }

    chartExecutions.forEach(exec => {
      const key = exec.startedAt.toISOString().split('T')[0];
      if (key in dailyStats) {
        dailyStats[key].total += 1;
        if (exec.status === 'SUCCESS') {
          dailyStats[key].SUCCESS += 1;
        } else if (exec.status === 'FAILED') {
          dailyStats[key].FAILED += 1;
        }
      }
    });

    const chartData = Object.keys(dailyStats).sort().map(key => dailyStats[key]);

    // 5. Recent 5 Workflows with workspace and last execution status
    const recentWorkflows = await prisma.workflow.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        workspace: {
          select: { name: true, color: true }
        },
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 1,
          select: { status: true, startedAt: true }
        }
      }
    });

    // 6. Recent 10 executions
    const recentExecutions = await prisma.execution.findMany({
      where: { workflowId: { in: workflowIds } },
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: {
        workflow: {
          select: { name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalWorkflows,
        activeWorkflowsCount,
        totalExecutions,
        statusCounts,
        avgDuration,
      },
      chartData,
      recentWorkflows,
      recentExecutions
    });
  } catch (error: any) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard stats.",
      error: error?.message || String(error)
    });
  }
}
