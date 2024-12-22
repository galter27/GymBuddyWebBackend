import { NextFunction, Request, response, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user_model";


const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            message: "Email and password are required."
        });
        return;
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: req.body.email,
            password: hashPassword
        });
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error)
    }
}

const login = async (req: Request, res: Response) => {

    // verify user
    try {
        const user = await userModel.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(400).send("Invalid Username or Password")
            return;
        }

        // verify user
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send("Invalid Username or Password")
            return;
        }

        // generate token
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error')
            return;
        }
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string, { expiresIn: process.env.TOKEN_EXPIRES })
        res.status(200).send({ token: token, _id: user._id })
    } catch (error) {
        res.status(400).send(error);
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

}

export default {
    register,
    login
}