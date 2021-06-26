import FooApi from "./FooApi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import AuthApi from "../../auth/api/AuthApi";
import AuthResponse from "../../auth/api/AuthResponse";

beforeEach(async () => {
  // HTTP Adapter required to solve CORS error.
  axios.defaults.adapter = require("axios/lib/adapters/http");
  console.log("Preparing for new test.");
  console.log("Clearing AuthApi state.");
  AuthApi.clearSession();

  // Set the timeout.
  jest.setTimeout(45000);
});

test("foo not signed in", async () => {
  // Token validation should succeed.
  const response = await FooApi.foo();
  expect(response.status).toBe(200);
  expect(response.isSignedIn).toBe(false);
  expect(response.isPremium).toBe(false);
  expect(response.isVerified).toBe(false);
});

test("foo signed in but not verified", async () => {
  // Token validation should succeed.
  await createAndSignUser();
  const response = await FooApi.foo();
  expect(response.status).toBe(200);
  expect(response.isSignedIn).toBe(true);
  expect(response.isPremium).toBe(false);
  expect(response.isVerified).toBe(false);
});

test("foo can write and get post", async () => {
  const randomContent = `My random content ${randomUUID()}`;

  await createAndSignUser();
  const response = await FooApi.putPost("My Post Title", randomContent);
  expect(response.status).toBe(200);
  expect(response.itemKey).not.toBeUndefined();
  const postKey = response.itemKey;

  // Try to get the post from batch.
  const getPostsResponse = await FooApi.getPosts();
  expect(getPostsResponse.status).toBe(200);
  expect(getPostsResponse.items).not.toBeUndefined();

  // Check that most recent item is the one we put.
  const mostRecentItem = getPostsResponse.items[0];
  expect(mostRecentItem.content).toEqual(randomContent);
  expect(mostRecentItem.key).not.toBeUndefined();
  expect(mostRecentItem.user).not.toBeUndefined();

  // Try to get the specific post directly.
  const getPostResponse = await FooApi.getPost(postKey);
  expect(getPostResponse.status).toBe(200);
  expect(getPostResponse.items).not.toBeUndefined();
});

// ===================================================================================================
//
// ===================================================================================================

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
