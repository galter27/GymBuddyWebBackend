const request = require("supertest");
const appInit = require("../server");
const mongoose = require('mongoose');
const postsModel = require("../models/posts");

const testPosts = require("./test_posts")
let app;

beforeAll(async () => {
    console.log("Before all test");
    app = await appInit();
    await postsModel.deleteMany();
});

describe("Posts Test", () => {
  test("Test get all posts empty", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test create new posts", async () => {
    for (let post of testPosts) {
    const response = await request(app).post("/posts").send(post);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(post.title);
    expect(response.body.content).toBe(post.content);
    expect(response.body.sender).toBe(post.sender);
    post.postId = response.body.postId;
    };
  });

  test("Test get all posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(testPosts.length);
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + testPosts[0].postId);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].postId).toBe(testPosts[0].postId);
  });

  test("Test filter post by owner", async () => {
    const response = await request(app).get("/posts?sender=" + testPosts[0].sender);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Test delete post", async () => {
    const response = await request(app).delete("/posts/" + testPosts[0].postId);
    expect(response.statusCode).toBe(200);
    const responseGet = await request(app).get("/posts/" + testPosts[0].postId);
    expect(responseGet.statusCode).toBe(404);
  });

  test ("Test create new post fail", async () => {
    const response = await request(app).post("/posts").send({
        title: "Test Post 1",
        content: "Test Contnet 1"
    });
    expect(response.statusCode).toBe(400);
  });

});

afterAll(() => {
    console.log("After all test");
    mongoose.connection.close();
});
