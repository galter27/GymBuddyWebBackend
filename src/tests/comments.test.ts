import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import { Express } from "express";

import { testComment, invalidComment, updatedComment } from "./test_data";
let commentId=""

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await commentsModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Commnents test suite", () => {
  test("Comment test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test Addding new comment", async () => {
    const response = await request(app).post("/comments").send(testComment);
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.owner).toBe(testComment.owner);
    commentId = response.body._id;
  });

  test("Test Addding invalid comment", async () => {
    const response = await request(app).post("/comments").send(invalidComment);
    expect(response.statusCode).not.toBe(201);
  });

  test("Test get all comments after adding", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test get comment by owner", async () => {
    const response = await request(app).get("/comments?owner=" + testComment.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testComment.owner);
  });

  test("Test get comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentId);
  });

  test("Test get comment by id fail", async () => {
    const response = await request(app).get("/comments/67447b032ce3164be7c4412d");
    expect(response.statusCode).toBe(404);
  });

  test("Test update comment", async () => {
    const response = await request(app).put("/comments/" + commentId).send(updatedComment);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(updatedComment.comment);
    expect(response.body._id).toBe(commentId);
  });

  test("Test update non-existing comment", async () => {
    const response = await request(app).put("/comments/67447b032ce3164be7c4412d").send(updatedComment);
    expect(response.statusCode).toBe(404);
  });

  test("Test delete comment", async () => {
    const response = await request(app).delete("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Post deleted successfully");
  });

  test("Test delete non-existing comment", async () => {
    const response = await request(app).delete("/comments/67447b032ce3164be7c4412d");
    expect(response.statusCode).toBe(404);
  });

  test("Test get all comments after delete", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});