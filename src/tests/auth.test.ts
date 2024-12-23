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

  test("User Login Test", async () => {
    const response = await request(app).post(`${baseUrl}/login`).send(testUser);
    expect(response.statusCode).toBe(200);

    expect(response.body.token).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.token = response.body.token;
    testUser._id = response.body._id;
  });

  test("Auth test create post", async () => {
    const response = await request(app).post("/posts").send(testPost)
    expect(response.statusCode).not.toBe(201);

    const approved_response = await request(app).post("/posts")
      .set({ authorization: `JWT ${testUser.token}` })
      .send(testPost)

    expect(approved_response.statusCode).toBe(201);
  });

});
