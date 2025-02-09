// Post data

import { iPost } from "../models/posts_model";
import { iComment } from "../models/comments_model";
import { IUser } from "../models/user_model";

export const testPost = {
  username: "Gabi17",
  title: "Test title",
  content: "Test content",
};

export const testPost2 = {
  username: "Gabi17",
  title: "Second Test title",
  content: "Second Test content",
};

export const invalidPost = {
  title: "Test title2",
  content: "",
};

export const updatedPost = {
  username: "Gabi17",
  title: "Updated title",
  content: "Updated content",
};


// Comment data
export const testComment = {
  username: "Gabi3",
  comment: "Test Comment",
  postId: "",
};

export const invalidComment = {
  comment: "Test title",
};

export const updatedComment = {
  username: "Gabi3",
  comment: "Updated Test Title"
};


// User data
type User = IUser & { 
  accessToken?: string;
  refreshToken?: string;
}


export const testUser: User = {
  username: "Gabi17",
  email: "gabi@example.com",
  password: "password123"
}

export const invalidEmailTestUser: User = {
  username: "Gabi18",
  email: "gabi@example",
  password: "password123"
}

export const noPasswordTestUser: User = {
  username: "Gal12",
  email: "gal@example.com",
  password: ""
}

export const shortPasswordTestUser: User = {
  username: "Gal11",
  email: "gal@example.com",
  password: "123"
}


// Chat data
export const testChatMessage = {
  content: "How do I build muscle?",
  username: "testUser",
};

export const invalidChatMessage = {
  username: "testUser", 
};