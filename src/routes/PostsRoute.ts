import { Router } from "express";
import { API_ROUTES } from "../config/ApiRoutes";
import {
  CreatePostController,
  DeletePostController,
  GetAllPostAdminController,
  GetAllPostsController,
  GetAllPostsUrlController,
  GetPostByIdController,
  GetPostByUrlController,
  PostsBackupController,
  ImportPostsController,
  UpdatePostByIdController,
} from "../controllers/posts";
import multer from "multer";
import { adminVerifyMiddleware } from "../middleware/RoleVerifyMiddleware";
import authVerifyMiddleware from "../middleware/AuthVerifyMiddleware";
const upload = multer({ dest: "uploads/" });

export default () => {
  const route = Router();

  route.post(API_ROUTES.POSTS.CREATE, authVerifyMiddleware, CreatePostController);
  route.delete(API_ROUTES.POSTS.DELETE, [authVerifyMiddleware, adminVerifyMiddleware], DeletePostController);
  route.get(API_ROUTES.POSTS.ALL_POSTS_ADMIN, authVerifyMiddleware, GetAllPostAdminController);
  route.get(API_ROUTES.POSTS.ALL_POSTS, GetAllPostsController);
  route.get(API_ROUTES.POSTS.POSTS_URL, GetAllPostsUrlController);
  route.get(API_ROUTES.POSTS.POST_BY_ID, GetPostByIdController);
  route.get(API_ROUTES.POSTS.POST_BY_URL, GetPostByUrlController);
  route.get(API_ROUTES.POSTS.BACKUP, authVerifyMiddleware, PostsBackupController);
  route.post(API_ROUTES.POSTS.IMPORT, [authVerifyMiddleware, upload.single("posts")], ImportPostsController);
  route.put(API_ROUTES.POSTS.UPDATE_POST, authVerifyMiddleware, UpdatePostByIdController);

  return route;
};
