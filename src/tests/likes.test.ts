import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import likeModel from "../models/likes_model";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";
import { testPost, testUser } from "./test_data";

let app: Express;
let postId = "";

beforeAll(async () => {
  app = await initApp();
  await likeModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();

  // Register User for testing
  await request(app).post("/auth/register").send(testUser);
  const response = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = response.body.accessToken;
  testUser._id = response.body._id;
  expect(testUser.accessToken).toBeDefined();
  expect(testUser._id).toBeDefined();

  // Create a post for testing likes
  const postResponse = await request(app)
    .post("/posts")
    .set({ authorization: "JWT " + testUser.accessToken })
    .send(testPost);
  postId = postResponse.body._id;
  expect(postId).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Likes test suite", () => {
  test("Test create like", async () => {
    const response = await request(app)
      .post("/likes/")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({ postId });

    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(testUser._id);
    expect(response.body.postId).toBe(postId);
  });

  test("Test create like with invalid post", async () => {
    const response = await request(app)
      .post("/likes/")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({ postId: "invalidPostId" });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Unauthorized or Invalid Data");
  });

  test("Test get like by owner (should return liked: true)", async () => {
    const response = await request(app)
      .get(`/likes/${postId}/${testUser._id}`)
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.liked).toBe(true);
  });

  test("Test get like by owner for unliked post (should return liked: false)", async () => {
    const response = await request(app)
      .get(`/likes/000000000000000000000000/${testUser._id}`)
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.liked).toBe(false);
  });

  test("Test delete like", async () => {
    const response = await request(app)
      .delete(`/likes/${postId}`)
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Like deleted successfully");
  });

  test("Test delete non-existent like", async () => {
    const response = await request(app)
      .delete("/likes/000000000000000000000000") 
      .set({ authorization: "JWT " + testUser.accessToken });
  
    expect(response.statusCode).toBe(400); 
    expect(response.body.message).toBe("Unauthorized or Invalid Data"); 
  });

  test("Test database error on like creation", async () => {
    jest.spyOn(likeModel, "create").mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/likes/")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({ postId });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Error creating like");
    expect(response.body.error).toBeDefined();

    jest.restoreAllMocks();
  });
});
