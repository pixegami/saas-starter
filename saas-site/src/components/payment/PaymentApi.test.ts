import PaymentApi from "./PaymentApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ApiResponse from "../util/base_api/ApiResponse";
import AuthApi from "../auth/api/AuthApi";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  axios.defaults.adapter = require("axios/lib/adapters/http");

  // Set the timeout.
  jest.setTimeout(45000);
});

test("request checkout session", async () => {
  await createAndSignUser();
  const response = await requestPaymentCheckoutAndExpect(200);
  console.log(response.payload);
  expect(response.payload).toHaveProperty("session_id");
});

const requestPaymentCheckoutAndExpect = async (expectedCode: number) => {
  const response = await PaymentApi.requestCheckout();
  return expectResponseOrPrint(response, expectedCode);
};

const expectResponseOrPrint = (response: ApiResponse, expectedCode: number) => {
  if (response.status !== expectedCode) {
    console.log("Response Message", response.message);
    console.log("Response Payload", response.payload);
  }
  expect(response.status).toBe(expectedCode);
  return response;
};

const createAndSignUser = async () => {
  const user: string = newRandomUser();
  const password: string = newRandomPassword();
  await signUpAndExpect(user, password, 200);
  await signInAndExpect(user, password, 200);
};

const signUpAndExpect = async (
  user: string,
  password: string,
  expectedCode: number
) => {
  const response = await AuthApi.signUp(user, password);
  console.log("Signing up with user: " + user);
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

const randomUUID = () => {
  return uuidv4().replaceAll("-", "").substr(0, 12);
};

const newRandomUser = () => {
  return `test-user-1aA${randomUUID()}@bonestack.com`;
};

const newRandomPassword = () => {
  return `password-1aA${randomUUID()}`;
};
