import AuthApi from "./AuthApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  axios.defaults.adapter = require("axios/lib/adapters/http");
  console.log("Preparing for new test.");
  console.log("Clearing AuthApi state.");
  AuthApi.clearSession();
});

test("Test Auth Positive Login", async () => {
  // User can register, login, and validate their session.
  jest.setTimeout(45000);

  const user: string = `tst-user-${randomUUID()}@pixegami.com`;
  const password: string = `password-${randomUUID()}`;

  // Sign Up.
  const signUpResponse = await AuthApi.signUp(user, password);
  expect(signUpResponse.status).toBe(200);

  // Sign In.
  const signInResponse = await AuthApi.signIn(user, password);
  expect(signInResponse.status).toBe(200);
  expect(signInResponse.payload.token).not.toBeUndefined();

  // Validation should succeed.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(200);
});

test("Validate with empty Session fails", async () => {
  // // Validation should fail without a session.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(400);
});

const randomUUID = () => {
  return uuidv4().replaceAll("-", "").substr(0, 12);
};
