import express from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "../controller/auth.controller";
import requireUser from "../middleware/requireUser";

const router = express.Router();

// create session
router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

// get Sessions
router.get("/api/sessions", requireUser, getUserSessionsHandler);

// delete Session
router.delete("/api/sessions", requireUser, deleteSessionHandler);



export default router;
