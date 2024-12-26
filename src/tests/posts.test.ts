import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";
import { testPost, invalidPost, updatedPost, testUser } from "./test_data";

let postId = ""

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();

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


describe("Posts test suite", () => {
  test("Post test get all posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test Adding new post", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(testPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testUser._id);
    postId = response.body._id;
  });

  test("Test Adding invalid post", async () => {
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(invalidPost);
    expect(response.statusCode).not.toBe(201);
  });

  test("Test get all posts after adding", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get("/posts?owner=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testUser._id);
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("Test get post by id fail", async () => {
    const response = await request(app).get("/posts/67447b032ce3164be7c4412d");
    expect(response.statusCode).toBe(404);
  });

  test("Test update post by id", async () => {
    const response = await request(app).put("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.content).toBe(updatedPost.content);
    expect(response.body.owner).toBe(testUser._id);
  });

  test("Test update post by id fail", async () => {
    const response = await request(app).put("/posts/67447b032ce3164be7c4412d")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(updatedPost);
    expect(response.statusCode).toBe(404);
  });

  test("Test delete post by id", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Post deleted successfully");
  });

  test("Test delete post by id fail", async () => {
    const response = await request(app)
      .delete("/posts/67447b032ce3164be7c4412d")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(404);
  });

  test("Test get all posts after deleting", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test creating post with missing title", async () => {
    const invalidPostData = { content: "Content without title" };
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(invalidPostData);
    expect(response.statusCode).toBe(400);
  });

  test("Test creating post with unexpected field", async () => {
    const invalidPostData = { title: "Test", content: "Content", extraField: "unexpected" };
    const response = await request(app).post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(invalidPostData);
    expect(response.statusCode).toBe(201);
    expect(response.body.extraField).toBeUndefined();
  });

  test("Test updating non-existent post", async () => {
    const response = await request(app).put("/posts/67447b032ce3164be7c4412d")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(updatedPost);
    expect(response.statusCode).toBe(404);
  });

});
