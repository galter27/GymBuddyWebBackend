import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";
import { testUser, testPost, testComment, invalidComment, updatedComment } from "./test_data";

let commentId = ""
let postId = "";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await commentsModel.deleteMany();
  await postModel.deleteMany();

  // Register User for Testing
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = response.body.accessToken;
  testUser._id = response.body._id;
  expect(testUser.accessToken).toBeDefined();
  expect(testUser._id).toBeDefined();

  // Create Post for Testing
  const response_post = await request(app).post("/posts")
    .set({ authorization: "JWT " + testUser.accessToken })
    .send(testPost);
  postId = response_post.body._id;
  testComment.postId = postId;
  expect(postId).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Commnents test suite", () => {
  test("Comment test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test Adding new comment", async () => {
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(testComment);
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(postId);
    expect(response.body.owner).toBe(testUser._id);
    commentId = response.body._id;
  });

  test("Test Addding invalid comment", async () => {
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(invalidComment);
    expect(response.statusCode).not.toBe(201);
  });

  test("Test get all comments after adding", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test get comment by owner", async () => {
    const response = await request(app).get("/comments?owner=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testUser._id);
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

  test("Test get comments by postId", async () => {
    const response = await request(app).get("/comments/post/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].comment).toBe(testComment.comment);
  });
  
  test("Test get comments by postId with no comments", async () => {
    const newPostId = new mongoose.Types.ObjectId().toString();
  
    const response = await request(app).get("/comments/post/" + newPostId);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("No comments found for this post");
  });  

  test("Test update comment", async () => {
    const response = await request(app).put("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(updatedComment);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(updatedComment.comment);
    expect(response.body._id).toBe(commentId);
  });

  test("Test update non-existing comment", async () => {
    const response = await request(app).put("/comments/67447b032ce3164be7c4412d")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(updatedComment);
    expect(response.statusCode).toBe(404);
  });

  test("Test delete comment", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Post deleted successfully");
  });

  test("Test delete non-existing comment", async () => {
    const response = await request(app)
      .delete("/comments/67447b032ce3164be7c4412d")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(404);
  });

  test("Test get all comments after delete", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});