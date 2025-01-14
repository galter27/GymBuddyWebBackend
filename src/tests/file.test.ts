import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("File Tests - Upload File", () => {
  test("upload file", async () => {
    const filePath = path.join(__dirname, "test_file.txt");

    // Check if the test file exists
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return;
    }

    try {
      // Upload the file
      const response = await request(app)
        .post("/file").attach('file', filePath);
      expect(response.statusCode).toEqual(200);

      // Get the file URL from the response
      const url = response.body.url.replace(/^.*\/\/[^/]+/, '');
      console.log("File URL:", url);

      // Check if the file can be accessed by its URL
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.error("Test failed:", err);
      throw err;
    }
  });
});
