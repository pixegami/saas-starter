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

test("Test Auth Positive Login", async () => {
  // User can register, login, and validate their session.

  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200);
  await signInAndExpect(user, password, 200);

  // Validation should succeed.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(200);
});

test("Auth Login Account Not Verified", async () => {
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

test("Validate with empty Session fails", async () => {
  // // Validation should fail without a session.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(400);
});

const signUpAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const signUpResponse = await AuthApi.signUp(user, password);
  expect(signUpResponse.status).toBe(expectedCode);
  return signUpResponse;
};

const signInAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const signInResponse = await AuthApi.signIn(user, password);
  expect(signInResponse.status).toBe(expectedCode);
  return signInResponse;
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
