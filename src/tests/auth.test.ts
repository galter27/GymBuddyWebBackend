import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import {
  testUser,
  testPost,
  testPost2,
  invalidEmailTestUser,
  noPasswordTestUser,
  shortPasswordTestUser,
} from "./test_data";
import userModel from "../models/user_model";
import postModel from "../models/posts_model";
import { generateTokens } from "../controllers/auth_controller";

let app: Express;
const baseUrl = "/auth";

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

describe("Authentication and Authorization Test Suite", () => {
  describe("User Registration", () => {
    test("Successful registration", async () => {
      const response = await request(app).post(`${baseUrl}/register`).send(testUser);
      expect(response.statusCode).toBe(200);
    });

    test("Duplicate registration", async () => {
      const response = await request(app).post(`${baseUrl}/register`).send(testUser);
      expect(response.statusCode).not.toBe(200);
    });

    test("Invalid email", async () => {
      const response = await request(app).post(`${baseUrl}/register`).send(invalidEmailTestUser);
      expect(response.statusCode).not.toBe(200);
    });

    test("No password", async () => {
      const response = await request(app).post(`${baseUrl}/register`).send(noPasswordTestUser);
      expect(response.statusCode).not.toBe(200);
    });

    test("Short password", async () => {
      const response = await request(app).post(`${baseUrl}/register`).send(shortPasswordTestUser);
      expect(response.statusCode).not.toBe(200);
    });
  });

  describe("User Login", () => {
    test("Successful login", async () => {
      const response = await request(app).post(`${baseUrl}/login`).send(testUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.accessToken).toBeDefined();
      expect(response.body._id).toBeDefined();

      testUser.refreshToken = response.body.refreshToken;
      testUser.accessToken = response.body.accessToken;
      testUser._id = response.body._id;
    });

    test("Invalid email", async () => {
      const response = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email + "m",
        password: testUser.password,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Username or Password");
    });

    test("Invalid password", async () => {
      const response = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password + "m",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid Username or Password");
    });

    test("Different access tokens for multiple logins", async () => {
      const firstLoginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });

      const secondLoginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(firstLoginResponse.body.accessToken).not.toEqual(secondLoginResponse.body.accessToken);
    });
  });

  describe("Post Creation", () => {
    test("Create post with valid token", async () => {
      const response = await request(app).post("/posts").send(testPost);
      expect(response.statusCode).not.toBe(201);

      const approvedResponse = await request(app)
        .post("/posts")
        .set({ authorization: `JWT ${testUser.accessToken}` })
        .send(testPost);

      expect(approvedResponse.statusCode).toBe(201);
    });

    test("Create post with invalid token", async () => {
      const response = await request(app)
        .post("/posts")
        .set({ authorization: `JWT ${testUser.accessToken}1` })
        .send(testPost);
      expect(response.statusCode).not.toBe(201);
    });

    test("Create post when TOKEN_SECRET is missing from server", async () => {
      const originalSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;

      const response = await request(app)
        .post("/posts")
        .set({ authorization: `JWT ${testUser.accessToken}` })
        .send(testPost);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Server Error");

      process.env.TOKEN_SECRET = originalSecret;
    });
  });

  describe("Token Handling", () => {
    test("Refresh token", async () => {
      const response = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.accessToken).toBeDefined();

      testUser.accessToken = response.body.accessToken;
      testUser.refreshToken = response.body.refreshToken;
    });

    test("Logout invalidates refresh token", async () => {
      const logoutResponse = await request(app).post(`${baseUrl}/logout`).send({
        refreshToken: testUser.refreshToken,
      });
      expect(logoutResponse.statusCode).toBe(200);

      const response = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken,
      });
      expect(response.statusCode).not.toBe(200);
    });

    test("Logout with invalid token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const response = await request(app).post(`${baseUrl}/logout`).send({
        refreshToken: testUser.refreshToken + "asdasd",
      });
      expect(response.statusCode).toBe(403);
    });

    test("Logout without refresh token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const response = await request(app).post(`${baseUrl}/logout`).send({
        refreshToken: "",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Missing Token");
    });

    test("Refresh with invalid token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const response = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken + "asdasd",
      });
      expect(response.statusCode).toBe(403);
    });

    test("Refresh without refresh token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const response = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: "",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Missing Token");
    });

    test("Multiple usages of refresh token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      testUser.accessToken = loginResponse.body.accessToken;
      testUser.refreshToken = loginResponse.body.refreshToken;

      const refreshResponse = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken,
      });
      expect(refreshResponse.statusCode).toBe(200);

      const newRefreshToken = refreshResponse.body.refreshToken;

      const invalidResponse = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken,
      });
      expect(invalidResponse.statusCode).not.toBe(200);

      const secondInvalidResponse = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: newRefreshToken,
      });
      expect(secondInvalidResponse.statusCode).not.toBe(200);
    });
  });

  describe("Token Generation", () => {
    test("Should return null if TOKEN_SECRET is missing", () => {
      const originalSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;

      const tokens = generateTokens("testUserId");
      expect(tokens).toBeNull();

      process.env.TOKEN_SECRET = originalSecret;
    });
  });

  describe("Server Errors", () => {
    test("Logout when TOKEN_SECRET is missing from server", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const originalSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;

      const response = await request(app).post(`${baseUrl}/logout`).send({
        refreshToken: testUser.refreshToken
      });
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Server Error");

      process.env.TOKEN_SECRET = originalSecret;
    });

    test("Refresh when TOKEN_SECRET is missing from server", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);

      const originalSecret = process.env.TOKEN_SECRET;
      delete process.env.TOKEN_SECRET;

      const response = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: testUser.refreshToken
      });
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Server Error");

      process.env.TOKEN_SECRET = originalSecret;
    });

    jest.setTimeout(10000);
    test("Timeout on refresh access token", async () => {
      const loginResponse = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body.accessToken).toBeDefined();
      expect(loginResponse.body.refreshToken).toBeDefined();
      testUser.accessToken = loginResponse.body.accessToken;
      testUser.refreshToken = loginResponse.body.refreshToken;

      // wait for 6 seconds
      await new Promise(resolve => setTimeout(resolve, 6000));

      //try to access with expired token
      const invalidResponse = await request(app).post("/posts").set({
        authorization: 'JWT ' + testUser.accessToken
      }).send(testPost);
      expect(invalidResponse.statusCode).not.toBe(201);

      const refreshResponse = await request(app).post("/auth/refresh").send({
        refreshToken: testUser.refreshToken
      });
      expect(refreshResponse.statusCode).toBe(200);
      testUser.accessToken = refreshResponse.body.accessToken;
      testUser.refreshToken = refreshResponse.body.refreshToken;

      const validResponse = await request(app).post("/posts").set({
        authorization: 'JWT ' + testUser.accessToken
      }).send(testPost);
      expect(validResponse.statusCode).toBe(201);
    });
  });
});