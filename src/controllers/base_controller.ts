import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const ownerFilter = req.query.owner;
    try {
      if (ownerFilter) {
        const posts = await this.model.find({ owner: ownerFilter });
        res.status(200).send(posts);
      } else {
        const posts = await this.model.find();
        res.status(200).send(posts);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  };

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const object = await this.model.findById(id);
      if (object === null) {
        res.status(404).send("Object not found");
        return;
      }
      res.status(200).send(object);
    } catch (err) {
      res.status(400).send(err);
    }
  };

  async create(req: Request, res: Response) {
    try {
      const object = await this.model.create(req.body);
      res.status(201).send(object);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const updateData = req.body;
    try {
      const updatedObject = await this.model.findByIdAndUpdate(id, updateData, { new: true });
      if (updatedObject === null) {
        res.status(404).send("Object not found");
        return;
      } else {
        res.status(200).send(updatedObject);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const deletedObject = await this.model.findByIdAndDelete(id);
      if (deletedObject === null) {
        res.status(404).send("Object not found");
        return;
      } else {
        res.status(200).send("Object deleted successfully");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

const createController = <T>(model: Model<T>) => {
  return new BaseController(model);
}

export default createController;