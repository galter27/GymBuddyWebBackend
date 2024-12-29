import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Home Test Suite", () => {
    test("Post test get all posts", async () => {
        const response = await request(app).get("/");
        expect(response.text).toBe("Authors: Gabi Matatov 322404088 & Gal Ternovsky 323005512");
      });

    test("Should reject if MONGO_URI is not set", async () => {
    // Backup the original MONGO_URI
    const originalMongoUri = process.env.MONGO_URI;
    
    // Temporarily unset MONGO_URI
    delete process.env.MONGO_URI;

    try {
        await initApp();
    } catch (error) {
        expect(error).toBeUndefined();
    }

    // Restore the original MONGO_URI
    process.env.MONGO_URI = originalMongoUri;
    });
});