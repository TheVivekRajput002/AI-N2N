import { Request, Response } from "express";
import prisma from "@/config/db";
import { executeGraph } from "../lib/executeGraph";

/**
 * Triggers workflow execution synchronously. It loads the graph, runs Kahn's algorithm,
 * creates DB logs for execution tracking, and awaits completion to return outputs.
 */
export async function executeWorkflow(req: Request, res: Response): Promise<void> {
  const { workflowId } = req.params;
  const { input, triggeredBy } = req.body;
  
  const triggerType = triggeredBy === "API" ? "API" : "MANUAL";

  try {
    // 1. Fetch workflow and its current active version
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

    // 2. Create parent execution log in database
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
      // 3. Execute the graph traversal synchronously
      const output = await executeGraph({
        nodes,
        edges,
        executionId: execution.id,
        globalInput: input,
      });

      const finishedAt = new Date();
      const totalDuration = finishedAt.getTime() - startedAt.getTime();

      // 4. Record successful execution
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

      // Record failed execution
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

/**
 * Returns the history of executions for a specific workflow.
 */
export async function getWorkflowExecutions(req: Request, res: Response): Promise<void> {
  const { workflowId } = req.params;

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

/**
 * Returns granular node-by-node details for a specific execution run.
 */
export async function getExecutionDetails(req: Request, res: Response): Promise<void> {
  const { executionId } = req.params;

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
