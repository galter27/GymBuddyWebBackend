import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import { testUser, testPost } from "./test_data";

let app: Express;

type User = {
  email: string;
  password: string;
  token?: string;
  _id?: string;
};

const tokenedTestUser: User = { ...testUser };

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

const baseUrl = "/auth";

describe("Authentication and Authorization test suite", () => {
  test("User Registration Test", async () => {
    const response = await request(app).post(`${baseUrl}/register`).send(tokenedTestUser);
    expect(response.statusCode).toBe(200);
  });

  test("User Login Test", async () => {
    const response = await request(app).post(`${baseUrl}/login`).send(tokenedTestUser);
    expect(response.statusCode).toBe(200);

    expect(response.body.token).toBeDefined();
    expect(response.body._id).toBeDefined();
    tokenedTestUser.token = response.body.token;
    tokenedTestUser._id = response.body._id;
  });

  test("Auth test create post", async () => {
    const response = await request(app).post("/posts").send(testPost)
    expect(response.statusCode).not.toBe(201);

    const approved_response = await request(app).post("/posts")
      .set({authorization: `JWT ${tokenedTestUser.token}`})
      .send(testPost)

    expect(approved_response.statusCode).toBe(201);
  });

});
