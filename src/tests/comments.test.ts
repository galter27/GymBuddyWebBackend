import request from "supertest";
import initApp from "../server";
import mongoose  from "mongoose";
import commentsModel from "../models/comments";
import {Express} from "express";


let app:Express;

const testComment = {
    postId: 1,
    sender: "Romi",
    content: "Test Comment",
} as { postId: number; sender: string; content: string; commentId?: string };

const invalidComment = {
    content: "Test Comment"
}


beforeAll(async () => {
    console.log("Before all test");
    app = await initApp();
    await commentsModel.deleteMany();
});

describe("Comments Test", () => {
  test("Test get all comments empty", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test create new comment", async () => {
    const response = await request(app).post("/comments").send(testComment);
    expect(response.statusCode).toBe(201);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.sender).toBe(testComment.sender);
    expect(response.body.content).toBe(testComment.content);
    testComment.commentId = response.body.commentId;
  });

  test("Test get all comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test get comment by comment id", async () => {
    const response = await request(app).get("/comments/" + testComment.commentId);
    expect(response.statusCode).toBe(200);
    console.log(response.body)
    expect(response.body.commentId).toBe(testComment.commentId);
  });

  test("Test filter comments by owner", async () => {
    const response = await request(app).get("/comments?sender=" + testComment.sender);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test get comment by postId", async () => {
    const response = await request(app).get("/comments/post/" + testComment.postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test delete comment", async () => {
    const response = await request(app).delete("/comments/" + testComment.commentId);
    expect(response.statusCode).toBe(200);
    const responseGet = await request(app).get("/comments/" + testComment.commentId);
    expect(responseGet.statusCode).toBe(404);
  });

  test ("Test create new comment fail", async () => {
    const response = await request(app).post("/comments").send(invalidComment);
    expect(response.statusCode).toBe(400);
  });

});

afterAll(() => {
    console.log("After all test");
    mongoose.connection.close();
});
