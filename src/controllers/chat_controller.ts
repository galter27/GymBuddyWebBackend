import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import chatMessageModel, { iChatMessage } from "../models/chat_model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

class ChatMessageController extends BaseController<iChatMessage> {
  constructor() {
    super(chatMessageModel);  
  }

  async create(req: Request, res: Response): Promise<void> {
    const { content, username } = req.body;
    const userId = req.params.userId;

    if (!content || !username || !userId) {
      res.status(400).send({ message: "Content, username, and userId are required" });
      return;
    }

    // Simplified prompt without the check for sports/workouts
    const prompt = `
    Please provide a concise yet informative response focused on sports or workouts. 
    If the question is not about sports or workouts, please mention that the question is outside the scope of this service in a humorous or playful way, like "Oops! Looks like you're asking about something outside the gym." 
    Keep your answer balanced—not too short, but also not too long. Don't use special charactes. Use Numbers
    Question: ${content}
    `;    
  

    try {
      const result = await model.generateContent(prompt);

      // Save user request for future analytics
      const newChatMessage = await this.model.create({
        content,
        username,
        owner: userId,
      });

      // Send the response back to the client
      res.status(201).send({ response: result.response.text() });
    } catch (err) {
      res.status(500).send({ message: "Error creating chat message", error: err });
    }
  }
}

export default new ChatMessageController();
