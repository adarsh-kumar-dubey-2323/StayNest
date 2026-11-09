import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getOwnerApplications,
  reviewOwnerApplication,
  submitOwnerApplication,
} from "../controller/ownerApplication.controller.js";

const ownerApplicationRouter = express.Router();

ownerApplicationRouter.post("/", isAuthenticated, submitOwnerApplication);
ownerApplicationRouter.get("/admin", isAuthenticated, isAdmin, getOwnerApplications);
ownerApplicationRouter.patch("/admin/:applicationId", isAuthenticated, isAdmin, reviewOwnerApplication);

export default ownerApplicationRouter;
