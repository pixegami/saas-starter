import AuthApi from "./AuthApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import AuthResponse from "./AuthResponse";

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
  expect(tokenPayload).toHaveProperty("verified");
  expect(tokenPayload["verified"]).toBe(false);
  console.log(tokenPayload);
});

test("validate with empty session fails", async () => {
  // // Validation should fail without a session.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(403);
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
  expect(response.payload).toHaveProperty("verification_token");
  const verificationToken = response.payload["verification_token"];

  // Can verify account with the key.
  const verificationResult = await verifyAccountAndExpect(
    verificationToken,
    200
  );
  console.log(verificationResult);
});

test("can reset account", async () => {
  // I should be able to reset my password.
  const user: string = newRandomUser();
  const oldPassword: string = newRandomPassword();
  const newPassword: string = newRandomPassword();
  await signUpAndExpect(user, oldPassword, 200);

  // Request password reset.
  const resetRequestResponse = await requestAccountResetAndExpect(user, 200);

  // Reset the password
  console.log(resetRequestResponse.payload);
  expect(resetRequestResponse.payload).toHaveProperty("reset_token");
  const resetToken = resetRequestResponse.payload["reset_token"];
  await resetAccountAndExpect(resetToken, newPassword, 200);

  // Cannot sign in with old password.
  await signInAndExpect(user, oldPassword, 403);

  // Can sign in with new password.
  await signInAndExpect(user, newPassword, 200);
});

test("premium not signed in", async () => {
  const validationResponse = await AuthApi.validateMembership();
  expect(validationResponse.status).toBe(403);
});

test("premium not a member", async () => {
  await createAndSignInToVerifiedAccount();
  const validationResponse = await AuthApi.validateMembership();
  expect(validationResponse.status).toBe(402);
});

test("premium is a member", async () => {
  await createAndSignInToVerifiedAccount(true);
  const validationResponse = await AuthApi.validateMembership();
  expect(validationResponse.status).toBe(200);
});

test("get premium is a member", async () => {
  await createAndSignInToVerifiedAccount(true);
  const validationResponse = await AuthApi.getMembershipStatus();
  expect(validationResponse).toBe(true);
});

test("get premium not a member", async () => {
  const validationResponse = await AuthApi.getMembershipStatus();
  expect(validationResponse).toBe(false);
});

const createAndSignInToVerifiedAccount = async (isMember: boolean = false) => {
  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200, true, isMember);
  await signInAndExpect(user, password, 200);
};

const signUpAndExpect = async (
  user: string,
  password: string,
  expectedCode: number,
  isVerified?: boolean,
  isMember?: boolean
) => {
  const response = await AuthApi.signUp(user, password, isVerified, isMember);
  return expectResponseOrPrint(response, expectedCode);
};

const signInAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const response = await AuthApi.signIn(user, password);
  return expectResponseOrPrint(response, expectedCode);
};

const requestAccountVerificationAndExpect = async (
  accountKey: string,
  expectedCode: number
) => {
  const response = await AuthApi.requestAccountVerification(accountKey);
  return expectResponseOrPrint(response, expectedCode);
};

const requestAccountResetAndExpect = async (
  accountKey: string,
  expectedCode: number
) => {
  const response = await AuthApi.requestAccountReset(accountKey);
  return expectResponseOrPrint(response, expectedCode);
};

const resetAccountAndExpect = async (
  token: string,
  new_password: string,
  expectedCode: number
) => {
  const response = await AuthApi.resetAccount(token, new_password);
  return expectResponseOrPrint(response, expectedCode);
};

const verifyAccountAndExpect = async (token: string, expectedCode: number) => {
  const response = await AuthApi.verifyAccount(token);
  return expectResponseOrPrint(response, expectedCode);
};

const expectResponseOrPrint = (
  response: AuthResponse,
  expectedCode: number
) => {
  if (response.status !== expectedCode) {
    console.log("Response Message", response.message);
    console.log("Response Payload", response.payload);
  }
  expect(response.status).toBe(expectedCode);

  return response;
};

const randomUUID = () => {
  return uuidv4().replaceAll("-", "").substr(0, 12);
};

const newRandomUser = () => {
  return `test-user-1aA${randomUUID()}@bonestack.com`;
};

const newRandomPassword = () => {
  return `password-1aA${randomUUID()}`;
};
