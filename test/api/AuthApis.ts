import supertest from "supertest";
import loadServer from "../../src/loaders/ExpressLoader";

const app = loadServer();

type UserBody = {
  email?: string;
  password?: string;
  name?: string;
};

type RefreshTokenBody = {
  refreshToken?: string;
};

type ChangePasswordBody = {
  password?: string;
  newPassword?: string;
};

type ResetPasswordBody = {
  email?: string;
};

type FinishResetPasswordBody = {
  token?: string;
  newPassword?: string;
};

const registerWithEmail = async (body: UserBody | undefined) => {
  return await supertest(app).post("/auth/register").send(body);
};

const loginWithEmail = async (body: UserBody | undefined) => {
  return await supertest(app).post("/auth/login").send(body);
};

const doRefreshToken = async (body: RefreshTokenBody | undefined) => {
  return await supertest(app).post("/auth/refresh-token").send(body);
};

const changePassword = async (body: ChangePasswordBody | undefined, accessToken?: string) => {
  const request = supertest(app).post("/auth/change-password/");

  if (accessToken) {
    request.set("Authorization", `Bearer ${accessToken}`);
  }

  return await request.send(body);
};

const resetPassword = async (body: ResetPasswordBody | undefined) => {
  return await supertest(app).post("/auth/reset-password").send(body);
};

const finishResetPassword = async (body: FinishResetPasswordBody | undefined) => {
  return await supertest(app).post("/auth/finish-reset-password").send(body);
};

export { registerWithEmail, loginWithEmail, doRefreshToken, changePassword, resetPassword, finishResetPassword };
