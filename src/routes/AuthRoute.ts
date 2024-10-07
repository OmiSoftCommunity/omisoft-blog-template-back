import { Router } from "express";
import { API_ROUTES } from "../config/ApiRoutes";
import {
  AdminRegistrationController,
  ChangePasswordController,
  FinishResetPasswordController,
  LoginController,
  RegistrationController,
  ResetPasswordController,
  UpdateTokensController,
} from "../controllers/auth";
import authVerifyMiddleware from "../middleware/AuthVerifyMiddleware";

export default () => {
  const route = Router();

  route.post(API_ROUTES.AUTH.REGISTER_ADMIN, AdminRegistrationController);
  route.post(API_ROUTES.AUTH.CHANGE_PASSWORD, authVerifyMiddleware, ChangePasswordController);
  route.post(API_ROUTES.AUTH.FINISH_RESET_PASSWORD, FinishResetPasswordController);
  route.post(API_ROUTES.AUTH.LOGIN, LoginController);
  route.post(API_ROUTES.AUTH.REGISTER, RegistrationController);
  route.post(API_ROUTES.AUTH.RESET_PASSWORD, ResetPasswordController);
  route.post(API_ROUTES.AUTH.REFRESH_TOKEN, UpdateTokensController);

  return route;
};
