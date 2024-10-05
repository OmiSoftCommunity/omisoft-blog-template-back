import { Router } from "express";
import { API_ROUTES } from "../config/ApiRoutes";
import {
  ClearPasswordController,
  CreateModeratorController,
  CreateUserController,
  DeleteUserController,
  DeleteUserForAdminController,
  GetAdminController,
  GetAllUsersController,
  GetMyProfileController,
  GetUserByIdController,
  UpdateUserController,
} from "../controllers/users";
import { adminVerifyMiddleware } from "../middleware/RoleVerifyMiddleware";
import authVerifyMiddleware from "../middleware/AuthVerifyMiddleware";

export default () => {
  const route = Router();

  route.put(API_ROUTES.USERS.CLEAR_PASSWORD, [authVerifyMiddleware, adminVerifyMiddleware], ClearPasswordController);
  route.post(
    API_ROUTES.USERS.CREATE_MODERATOR,
    [authVerifyMiddleware, adminVerifyMiddleware],
    CreateModeratorController
  );
  route.post(API_ROUTES.USERS.CREATE, authVerifyMiddleware, CreateUserController);
  route.delete(API_ROUTES.USERS.DELETE, authVerifyMiddleware, DeleteUserController);
  route.delete(
    API_ROUTES.USERS.DELETE_FOR_ADMIN,
    [authVerifyMiddleware, adminVerifyMiddleware],
    DeleteUserForAdminController
  );
  route.get(API_ROUTES.USERS.GET_ADMIN, authVerifyMiddleware, GetAdminController);
  route.get(API_ROUTES.USERS.ALL_USERS, authVerifyMiddleware, GetAllUsersController);
  route.get(API_ROUTES.USERS.GET_MY_PROFILE, authVerifyMiddleware, GetMyProfileController);
  route.get(API_ROUTES.USERS.USER_BY_ID, authVerifyMiddleware, GetUserByIdController);
  route.put(API_ROUTES.USERS.UPDATE_USER, authVerifyMiddleware, UpdateUserController);

  return route;
};
