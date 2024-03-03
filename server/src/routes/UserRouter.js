import express from "express";
import UserController from "../controllers/UserController.js";
import {
  validate,
  loginValidationRules,
  createUserValidationRules,
} from "../middleware/validation.js";

const UserRouter = express.Router();

UserRouter.post(
  "/",
  createUserValidationRules(),
  validate,
  UserController.postUser
);

UserRouter.post(
  "/login",
  loginValidationRules(),
  validate,
  UserController.login
);

UserRouter.post(
  "/logout",
  UserController.logout
);

UserRouter.post("/refresh", UserController.refresh);

export default UserRouter;
