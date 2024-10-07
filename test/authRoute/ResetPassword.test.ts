import { describe, expect, test } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectMockDatabase, disconnectMockDatabase } from "../utils/MockMongoLoader";
import { registerWithEmail, resetPassword } from "../api/AuthApis";
import { USER_EMAIL, USER_PASSWORD } from "../api/UserCredentials";

const nodemailer = require("nodemailer"); // Don't work with imports

jest.mock("nodemailer", () => {
  const sendMailMock = jest.fn().mockResolvedValue("The Email was sent");
  return {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
    })),
  };
});

/**
 * Reset Password Tests
 *
 * To run only this tests:
 * npm run test -- ResetPassword.test.ts
 */
describe("Run Reset Password Tests", () => {
  let mongoDadabase: MongoMemoryServer;
  let userToken: string;

  beforeAll(async () => {
    mongoDadabase = await connectMockDatabase();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    disconnectMockDatabase(mongoDadabase);
  });

  test("Reset Password Testing - Registration User For Login Testing", async () => {
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

  test("Reset Password Testing - Empty Body", async () => {
    const response1 = await resetPassword({});

    expect(response1.statusCode).toBe(400);
    expect(response1.body.error).toBe(`Field \"email\" is required`);

    const response2 = await resetPassword({
      email: "",
    });
    expect(response2.statusCode).toBe(400);
    expect(response2.body.error).toBe(`"email" is not allowed to be empty`);
  });

  test("Reset Password Testing - Not Valid Email", async () => {
    const response = await resetPassword({
      email: "not valid email",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Wrong email format");
  });

  test("Reset Password Testing - If the User does not exist", async () => {
    const response = await resetPassword({
      email: "someemail@omisoft.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Further instructions have been sent to you by Email");
  });

  test("Reset Password Testing - Email sent successfully", async () => {
    const response = await resetPassword({
      email: USER_EMAIL,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({});

    // Check Email data
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
    expect(nodemailer.createTransport().sendMail.mock.calls.length).toBe(1);

    const mailArgs = nodemailer.createTransport().sendMail.mock.calls[0][0];
    expect(mailArgs.to).toBe(USER_EMAIL);
    expect(mailArgs.subject).toBe("Reset Password Link");
    expect(mailArgs.text).toContain("To change the password to a new one, go to the following link:");
  });
});
