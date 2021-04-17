import AuthApi from "./AuthApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import * as jwt from "jsonwebtoken";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  axios.defaults.adapter = require("axios/lib/adapters/http");
  console.log("Preparing for new test.");
  console.log("Clearing AuthApi state.");
  AuthApi.clearSession();

  // Set the timeout.
  jest.setTimeout(45000);
});

test("auth positive login", async () => {
  // User can register, login, and validate their session.
  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200);
  await signInAndExpect(user, password, 200);

  // Token validation should succeed.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(200);
});

test("auth login account not verified", async () => {
  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200);
  const signInResponse = await signInAndExpect(user, password, 200);

  // Token should exist, and have the 'confirmed' status as false.
  expect(signInResponse.token).not.toBeUndefined();
  const tokenPayload = jwt.decode(signInResponse.token);
  expect(tokenPayload).toHaveProperty("confirmed");
  expect(tokenPayload["confirmed"]).toBe(false);
  console.log(tokenPayload);
});

test("validate with empty session fails", async () => {
  // // Validation should fail without a session.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(400);
});

test("can verify account", async () => {
  // // Validation should fail without a session.
  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200);

  // The account key should now exist in our session.
  expect(AuthApi.getSession().getUserAccountKey()).not.toBeUndefined();
  const account_key = AuthApi.getSession().getUserAccountKey();

  // Should be able to request validation email.
  const response = await requestAccountVerificationAndExpect(account_key, 200);
  expect(response.payload).toHaveProperty("confirm_token");
  const verificationToken = response.payload["confirm_token"];

  // Can verify account with the key.
  const verificationResult = await verifyAccountAndExpect(
    verificationToken,
    200
  );
  console.log(verificationResult);
});

const signUpAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const response = await AuthApi.signUp(user, password);
  expect(response.status).toBe(expectedCode);
  return response;
};

const signInAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const response = await AuthApi.signIn(user, password);
  expect(response.status).toBe(expectedCode);
  return response;
};

const requestAccountVerificationAndExpect = async (
  accountKey: string,
  expectedCode: number
) => {
  const response = await AuthApi.requestAccountVerification(accountKey);
  expect(response.status).toBe(expectedCode);
  return response;
};

const verifyAccountAndExpect = async (token: string, expectedCode: number) => {
  const response = await AuthApi.verifyAccount(token);
  expect(response.status).toBe(expectedCode);
  return response;
};

const randomUUID = () => {
  return uuidv4().replaceAll("-", "").substr(0, 12);
};

const newRandomUser = () => {
  return `tst-user-${randomUUID()}@pixegami.com`;
};

const newRandomPassword = () => {
  return `password-${randomUUID()}`;
};
