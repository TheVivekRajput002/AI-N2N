import express from "express";
import {
  executeWorkflow,
  getWorkflowExecutions,
  getExecutionDetails,
} from "../controllers/execution.controller";

const router = express.Router();

router.post("/workflow/:workflowId", executeWorkflow);

router.get("/workflow/:workflowId", getWorkflowExecutions);

router.get("/:executionId", getExecutionDetails);

export default router;
