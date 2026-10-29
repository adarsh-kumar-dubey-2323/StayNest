import express from "express";
import {
  login,
  logout,
  signup,
  isAuth,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/is-auth", isAuthenticated, isAuth);
userRouter.get("/logout", isAuthenticated, logout);

export default userRouter;