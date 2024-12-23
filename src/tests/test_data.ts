// Post data

import { iPost } from "../models/posts_model";
import { iComment } from "../models/comments_model";
import { IUser } from "../models/user_model";

export const testPost = {
  title: "Test title",
  content: "Test content",
};

export const invalidPost = {
  title: "Test title2",
  content: "",
};

export const updatedPost = {
  title: "Updated title",
  content: "Updated content",
};


// Comment data
export const testComment = {
  comment: "Test title",
  postId: "erwtgwerbt245t4256b345",
  owner: "Gal",
};

export const invalidComment = {
  comment: "Test title",
};

export const updatedComment = {
  comment: "Updated Test Title" 
};


// User data
type User = IUser & {token?: string}


export const testUser: User = {
  email: "gabi@example.com",
  password: "password123"
}

export const invalidEmailTestUser: User = {
  email: "gabi@example",
  password: "password123"
}

export const noPasswordTestUser: User = {
  email: "gal@example.com",
  password: ""
}

export const shortPasswordTestUser: User = {
  email: "gal@example.com",
  password: "123"
}