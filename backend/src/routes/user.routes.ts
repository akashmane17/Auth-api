import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import requireUser from "../middleware/requireUser";

const router = express.Router();

// create user
router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

// verify user
router.post(
  "/api/users/verify/:id",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

// forgot password
router.post(
  "/api/users/forgotpassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

// password reset code
router.post(
  "/api/users/resetPassword/:id",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

// get current user
router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;
