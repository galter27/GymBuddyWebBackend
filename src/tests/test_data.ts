// Post data

import { iPost } from "../models/posts_model";
import { iComment } from "../models/comments_model";
import { IUser } from "../models/user_model";

export const testPost = {
  title: "Test title",
  content: "Test content",
};

export const testPost2 = {
  title: "Second Test title",
  content: "Second Test content",
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
  comment: "Test Comment",
  postId: "",
};

export const invalidComment = {
  comment: "Test title",
};

export const updatedComment = {
  comment: "Updated Test Title"
};


// User data
type User = IUser & { 
  accessToken?: string;
  refreshToken?: string;
}


export const testUser: User = {
  name: "Gabi",
  email: "gabi@example.com",
  password: "password123"
}

export const invalidEmailTestUser: User = {
  name: "Gabi",
  email: "gabi@example",
  password: "password123"
}

export const noPasswordTestUser: User = {
  name: "Gal",
  email: "gal@example.com",
  password: ""
}

export const shortPasswordTestUser: User = {
  name: "Gal",
  email: "gal@example.com",
  password: "123"
}