import { Request, Response } from "express";
import { BaseController } from "./base_controller";
import chatMessageModel, { iChatMessage } from "../models/chat_model";

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

    // Create the chat message object with the owner set to userId
    const chatMessage = {
      content,
      owner: userId, // Set the owner to userId from request params
      username
    };

    // Save the chat message (or whatever logic you want)
    try {
      const newChatMessage = await chatMessageModel.create(chatMessage);
      res.status(201).send(newChatMessage); // Respond with the created chat message
    } catch (err) {
      res.status(400).send({ message: "Error creating chat message", error: err });
    }
  }
}

export default new ChatMessageController();
