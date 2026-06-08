import express from "express";
import {
  executeWorkflow,
  getWorkflowExecutions,
  getExecutionDetails,
} from "../controllers/execution.controller";

const router = express.Router();

// Trigger execution for a specific workflow
router.post("/workflow/:workflowId", executeWorkflow);

// Get execution history for a specific workflow
router.get("/workflow/:workflowId", getWorkflowExecutions);

// Get detailed steps for a specific execution run
router.get("/:executionId", getExecutionDetails);

export default router;
