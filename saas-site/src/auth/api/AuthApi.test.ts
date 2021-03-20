import AuthApi from "./AuthApi";
import { v4 as uuidv4 } from "uuid";

beforeEach(async () => {
  console.log("Preparing for new test.");
  console.log("Clearing AuthApi state.");
  AuthApi.clearSession();
});

test("Test Auth Positive Login", async () => {
  // User can register, login, and validate their session.
  jest.setTimeout(30000);

  // Registration.
  const user: string = `tst-user-${randomUUID()}@pixegami.com`;
  const password: string = `password-${randomUUID()}`;
  const response = await AuthApi.register(user, password);
  expect(response.token).not.toBeUndefined();
  expect(response.status).toBe(200);

  // Sign In.
  const signInResponse = await AuthApi.signIn(user, password);
  expect(signInResponse.status).toBe(200);

  // Validation should succeed.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).toBe(200);
});

test("Validate with empty Session fails", async () => {
  // Validation should fail without a session.
  const validationResponse = await AuthApi.validate();
  expect(validationResponse.status).not.toBe(200);
});

const randomUUID = () => {
  return uuidv4().replaceAll("-", "").substr(0, 12);
};
