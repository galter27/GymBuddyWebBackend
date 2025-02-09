import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import os from "os";
import { Express } from "express";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("File Tests - Upload File", () => {
  test("upload file", async () => {
    // Create a temporary test file
    const tempFilePath = path.join(os.tmpdir(), "test_file.txt");

    // Create the file with some content
    fs.writeFileSync(tempFilePath, "This is a test file content");

    try {
      // Upload the temporary test file
      const response = await request(app)
        .post("/file")
        .attach('file', tempFilePath);
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
    } finally {
      // Delete the temporary test file after the test
      try {
        await unlinkAsync(tempFilePath);
        console.log("Temporary test file deleted.");
      } catch (err) {
        console.error("Error deleting temporary test file:", err);
      }
    }
  });

  test("should return 400 when no file is uploaded", async () => {
    const response = await request(app).post("/file");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("No file uploaded");
  });
});
