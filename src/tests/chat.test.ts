import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import chatMessageModel from "../models/chat_model";
import userModel from "../models/user_model";
import { Express } from "express";
import { testUser, testChatMessage, invalidChatMessage } from "./test_data";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await chatMessageModel.deleteMany();

  // Register User for Testing
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = response.body.accessToken;
  testUser._id = response.body._id;
  expect(testUser.accessToken).toBeDefined();
  expect(testUser._id).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("ChatMessageController test suite", () => {
    test("Create a chat message", async () => {
      const response = await request(app).post("/chat")
        .set({ authorization: "JWT " + testUser.accessToken })
        .send(testChatMessage);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("response");
      expect(typeof response.body.response).toBe("string");
    });

    test("Fail to create chat message (missing content)", async () => {
        const response = await request(app).post("/chat")
          .set({ authorization: "JWT " + testUser.accessToken })
          .send(invalidChatMessage);
      
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message", "Content, username, and userId are required");
    });
      
  test("Fail to create chat message (unauthenticated)", async () => {
    const response = await request(app).post("/chat").send(testChatMessage);
    expect(response.statusCode).toBe(401);
  });
});
