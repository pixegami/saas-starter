import PaymentApi from "./PaymentApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import ApiResponse from "../base/ApiResponse";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  axios.defaults.adapter = require("axios/lib/adapters/http");

  // Set the timeout.
  jest.setTimeout(45000);
});

test("request checkout session", async () => {
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
