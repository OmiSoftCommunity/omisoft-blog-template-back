const BASE_URL = "/";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}auth/login/`,
    REGISTER: `${BASE_URL}auth/register/`,
    REFRESH_TOKEN: `${BASE_URL}auth/refresh/`,
    REGISTER_ADMIN: `${BASE_URL}auth/admin-register/`,
    RESET_PASSWORD: `${BASE_URL}auth/reset-password/`,
    FINISH_RESET_PASSWORD: `${BASE_URL}auth/finish-reset-password/`,
    CHANGE_PASSWORD: `${BASE_URL}auth/change-password/`,
  },
  USERS: {
    CREATE: `${BASE_URL}users/create/`,
    CREATE_MODERATOR: `${BASE_URL}users/moderator-create/`,
    DELETE_FOR_ADMIN: `${BASE_URL}users/delete-admin/:id/`,
    DELETE: `${BASE_URL}users/delete/:id/`,
    USER_BY_ID: `${BASE_URL}users/:id/`,
    ALL_USERS: `${BASE_URL}users/`,
    GET_ADMIN: `${BASE_URL}users/admin/`,
    UPDATE_USER: `${BASE_URL}users/:id/`,
    CLEAR_PASSWORD: `${BASE_URL}users/reset/`,
    GET_MY_PROFILE: `${BASE_URL}users/my-profile/`,
  },
  POSTS: {
    CREATE: `${BASE_URL}posts/create/`,
    IMPORT: `${BASE_URL}posts/import/`,
    DELETE: `${BASE_URL}posts/delete/:id/`,
    POST_BY_URL: `${BASE_URL}posts/blog/:url`,
    POST_BY_ID: `${BASE_URL}post/:id/`,
    POSTS_URL: `${BASE_URL}posts/blog/url`,
    ALL_POSTS: `${BASE_URL}posts/blog`,
    ALL_POSTS_ADMIN: `${BASE_URL}posts-admin/`,
    UPDATE_POST: `${BASE_URL}posts/update/:id/`,
    BACKUP: `${BASE_URL}posts/backup/`,
  },
  SERVICES: {
    SWAGGER: `${BASE_URL}swagger/`,
  },
  ONE_TIME_LINKS: {
    GENERATE: `${BASE_URL}one-time-link/generate/`,
    VALIDATE: `${BASE_URL}one-time-link/validate/`,
  },
};
