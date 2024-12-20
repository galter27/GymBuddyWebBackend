import request from "supertest";
import initApp from "../server";
import mongoose  from "mongoose";
import postsModel from "../models/posts";
import {Express} from "express";


let app:Express;

const testPost = {
      "title": "Test Post 1",
      "content": "Test Content 1",
      "sender": "Gal"
} as { title: string; content: string; sender: string; postId?: string };

const invalidPost = {
  title: "Test Post 1",
  content: "Test Contnet 1"
}


beforeAll(async () => {
    console.log("Before all test");
    app = await initApp();
    await postsModel.deleteMany();
});

describe("Posts Test", () => {
  test("Test get all posts empty", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test create new posts", async () => {
    const response = await request(app).post("/posts").send(testPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.sender).toBe(testPost.sender);
    testPost.postId = response.body.postId;
  });

  test("Test get all posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + testPost.postId);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].postId).toBe(testPost.postId);
  });

  test("Test filter post by owner", async () => {
    const response = await request(app).get("/posts?sender=" + testPost.sender);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test delete post", async () => {
    const response = await request(app).delete("/posts/" + testPost.postId);
    expect(response.statusCode).toBe(200);
    const responseGet = await request(app).get("/posts/" + testPost.postId);
    expect(responseGet.statusCode).toBe(404);
  });

  test ("Test create new post fail", async () => {
    const response = await request(app).post("/posts").send(invalidPost);
    expect(response.statusCode).toBe(400);
  });

});

afterAll(() => {
    console.log("After all test");
    mongoose.connection.close();
});
