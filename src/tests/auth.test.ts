import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import { testUser, testPost, invalidEmailTestUser, noPasswordTestUser, shortPasswordTestUser } from "./test_data";
import userModel from "../models/user_model";
import postModel from "../models/posts_model";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
  console.log("beforeAll");
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

const baseUrl = "/auth";

describe("Authentication and Authorization test suite", () => {
  test("User Registration Test", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Duplicate User Registration Test - Should Fail", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("User Registration Test - Invalid Email", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(invalidEmailTestUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("User Registration Test - No Password", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(noPasswordTestUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("User Registration Test - Short Password", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(shortPasswordTestUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test - User Login Test", async () => {
    const response = await request(app).post(`${baseUrl}/login`).send(testUser);
    expect(response.statusCode).toBe(200);

    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body._id).toBeDefined();

    testUser.refreshToken = response.body.refreshToken;
    testUser.accessToken = response.body.accessToken;
    testUser._id = response.body._id;
  });

  test("Auth test - Different accessTokens", async () => {
    const firstLoginResponse = await request(app).post(`${baseUrl}/login`).send({
      email: testUser.email, 
      password: testUser.password,
    });
    
    const secondLoginResponse = await request(app).post(`${baseUrl}/login`).send({
      email: testUser.email, 
      password: testUser.password,
    });
    expect(firstLoginResponse.body.accessToken).not.toEqual(secondLoginResponse.body.accessToken);
  })

  test("Auth test - Create post", async () => {
    const response = await request(app).post("/posts").send(testPost)
    expect(response.statusCode).not.toBe(201);

    const approved_response = await request(app).post("/posts")
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send(testPost)

    expect(approved_response.statusCode).toBe(201);
  });

  test("Auth test - Create post with invalid token", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: `JWT ${testUser.accessToken}1` })
      .send(testPost)
    expect(response.statusCode).not.toBe(201);
  });

  test("Auth test - Refresh Token", async () => {
    const response = await request(app).post(`${baseUrl}/refresh`).send({
      refreshToken: testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Auth test - Logout invalidate refresh token", async () => {
    const logoutResponse = await request(app).post(`${baseUrl}/logout`).send({
      refreshToken: testUser.refreshToken
    });
    expect(logoutResponse.statusCode).toBe(200);

    const response = await request(app).post(`${baseUrl}/refresh`).send({
      refreshToken: testUser.refreshToken
    });
    expect(response.statusCode).not.toBe(200);
  })

  test("Auth test - Refresh token multiple usages", async () => {

    // Login and get A refresh token
    const loginResponse = await request(app).post(`${baseUrl}/login`).send({
      email: testUser.email,
      password: testUser.password
    });
    expect(loginResponse.statusCode).toBe(200);
    testUser.accessToken = loginResponse.body.accessToken;
    testUser.refreshToken = loginResponse.body.refreshToken;

    // Generate new refresh token
    const refreshResponse = await request(app).post(`${baseUrl}/refresh`).send({
      refreshToken: testUser.refreshToken
    });
    expect(refreshResponse.statusCode).toBe(200);

    // Save new Refresh Token
    const newRefreshToken = refreshResponse.body.refreshToken;

    // Try to generate new refresh token with first login refresh token - expect to fail
    const invalidResponse = await request(app).post(`${baseUrl}/refresh`).send({
      refreshToken: testUser.refreshToken
    });
    expect(invalidResponse.statusCode).not.toBe(200);

    // Try to generate new refresh token with `newRefreshToken` - expect to fail
    const secondInvalidResponse = await request(app).post(`${baseUrl}/refresh`).send({
      refreshToken: newRefreshToken
    })
    expect(secondInvalidResponse.statusCode).not.toBe(200);
  })
});
