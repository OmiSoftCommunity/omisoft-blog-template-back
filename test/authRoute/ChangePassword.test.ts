import { describe, expect, test } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectMockDatabase, disconnectMockDatabase } from "../utils/MockMongoLoader";
import { changePassword, loginWithEmail, registerWithEmail } from "../api/AuthApis";
import { USER_EMAIL, USER_PASSWORD } from "../api/UserCredentials";

/**
 * Change Password Tests
 *
 * To run only this tests:
 * npm run test -- ChangePassword.test.ts
 */
describe("Run Change Password Tests", () => {
  let mongoDadabase: MongoMemoryServer;
  let userToken: string;

  beforeAll(async () => {
    mongoDadabase = await connectMockDatabase();
  });

  afterAll(async () => {
    disconnectMockDatabase(mongoDadabase);
  });

  test("Change Password Testing - Registration User For Testing", async () => {
    const response = await registerWithEmail({
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("_id");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user.email).toBe(USER_EMAIL);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    userToken = response.body.accessToken;
  });

  test("Change Password Testing - Try change password without Access Token", async () => {
    const response = await changePassword({
      password: undefined,
      newPassword: undefined,
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("The user is not authorized");
  });

  test("Change Password Testing - Empty Fields", async () => {
    const response1 = await changePassword(
      {
        password: undefined,
        newPassword: undefined,
      },
      userToken
    );

    console.log("response1 = " + JSON.stringify(response1));

    expect(response1.statusCode).toBe(400);
    expect(response1.body).toHaveProperty("error");
    expect(response1.body.error).toBe(`Field "password" is required`);

    const response2 = await changePassword(
      {
        password: "1",
        newPassword: undefined,
      },
      userToken
    );
    expect(response2.statusCode).toBe(400);
    expect(response2.body).toHaveProperty("error");
    expect(response2.body.error).toBe(`Field "newPassword" is required`);
  });

  test("Change Password Testing - Incorrect Old Password", async () => {
    const response = await changePassword(
      {
        password: "1",
        newPassword: "12345678bB!",
      },
      userToken
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("The old password is incorrect");
  });

  test("Change Password Testing - Incorrect New Passwort REGEX", async () => {
    const response = await changePassword(
      {
        password: "0",
        newPassword: "1",
      },
      userToken
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain(`"newPassword" with value \"1\" fails to match the required pattern`);
  });

  const testLogin = async (password: string) => {
    const loginResponse = await loginWithEmail({
      email: USER_EMAIL,
      password,
    });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("accessToken");
  };

  test("Change Password Testing - Successful changing of Password", async () => {
    const NEW_PASSWORD = "12345678bB!";

    // Test login with Old password
    await testLogin(USER_PASSWORD);

    // Change Password
    const response = await changePassword(
      {
        password: USER_PASSWORD,
        newPassword: NEW_PASSWORD,
      },
      userToken
    );
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({});

    // Test login with New password
    await testLogin(NEW_PASSWORD);
  });
});
