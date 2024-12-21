import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import { Express } from "express";

import { testComment, invalidComment, updatedComment } from "./test_data";
let commentId = ""

let app: Express;

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

  });
});