import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await postModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

var postId = "";
const testPost = {
  title: "Test title",
  content: "Test content",
  owner: "Gabi",
};
const invalidPost = {
  title: "Test title",
  content: "Test content",
};
const updatedPost = {
  title: "Updated title",
  content: "Updated content",
  owner: "Updated owner",
};

describe("Posts test suite", () => {
  test("Post test get all posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test Adding new post", async () => {
    const response = await request(app).post("/posts").send(testPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testPost.owner);
    postId = response.body._id;
  });

  test("Test Adding invalid post", async () => {
    const response = await request(app).post("/posts").send(invalidPost);
    expect(response.statusCode).not.toBe(201);
  });

  test("Test get all posts after adding", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get("/posts?owner=" + testPost.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testPost.owner);
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
    const response = await request(app).put("/posts/" + postId).send(updatedPost);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.content).toBe(updatedPost.content);
    expect(response.body.owner).toBe(updatedPost.owner);
  });

  test("Test update post by id fail", async () => {
    const response = await request(app).put("/posts/67447b032ce3164be7c4412d").send(updatedPost);
    expect(response.statusCode).toBe(404);
  });

  test("Test delete post by id", async () => {
    const response = await request(app).delete("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Post deleted successfully");
  });

  test("Test delete post by id fail", async () => {
    const response = await request(app).delete("/posts/67447b032ce3164be7c4412d");
    expect(response.statusCode).toBe(404);
  });

  test("Test get all posts after deleting", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test creating post with missing title", async () => {
    const invalidPostData = { content: "Content without title", owner: "Gabi" };
    const response = await request(app).post("/posts").send(invalidPostData);
    expect(response.statusCode).toBe(400);
  });

  test("Test creating post with unexpected field", async () => {
    const invalidPostData = { title: "Test", content: "Content", owner: "Gabi", extraField: "unexpected" };
    const response = await request(app).post("/posts").send(invalidPostData);
    expect(response.statusCode).toBe(201); // It should still create the post, ignoring extra fields
    expect(response.body.extraField).toBeUndefined(); // Ensure that extra fields are not saved
  });

  test("Test updating non-existent post", async () => {
    const response = await request(app).put("/posts/67447b032ce3164be7c4412d").send(updatedPost);
    expect(response.statusCode).toBe(404);
  });

});
