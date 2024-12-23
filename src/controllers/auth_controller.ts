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

    if (password.length < 6) {
        res.status(400).send({
            message: "Password must be at least 6 characters long.",
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

type Payload = {
    _id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header('authorization');
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (!token) {
        res.status(401).send("Access Denied")
        return;
    }

    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if(err) {
            res.status(401).send("Access Denied")
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
}

export default {
    register,
    login
}