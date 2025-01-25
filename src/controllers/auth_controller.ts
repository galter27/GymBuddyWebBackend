import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user_model";


export const generateTokens = (_id: string): { accessToken: string, refreshToken: string } | null => {
    const random = Math.floor(Math.random() * 1000000);

    if (!process.env.TOKEN_SECRET) {
        return null;
    }

    const accessToken = jwt.sign(
        { _id: _id, randNum: random },
        process.env.TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    )

    const refreshToken = jwt.sign(
        { _id: _id, randNum: random },
        process.env.TOKEN_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    )

    return { accessToken, refreshToken }
}


const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            message: "Email and password are required."
        });
        return;
    }

    if (await userModel.findOne({ email })) {
        res.status(400).send({
            message: "Email already exists.",
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
        if(!req.body.avatar) {
            req.body.avatar = null;   
        }
        const user = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            avatar: req.body.avatar
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
        const tokens = generateTokens(user._id.toString())
        if (!tokens) {
            res.status(400).send("Missing Configuration")
            return;
        }

        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();

        res.status(200).send({
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
            _id: user._id
        });
    } catch (error) {
        res.status(400).send(error);
    }
}


const logout = async (req: Request, res: Response) => {
    // Extracting Refresh Token
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("Missing Token");
        return;
    }

    // Environment Check
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    // Validate Refresh Token
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
        if (err) {
            res.status(403).send("Invalid Token")
            return;
        }

        const payload = data as TokenPayload;
        try {
            const user = await userModel.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("User Not Found");
                return;
            }

            // Checking Token in User's List:
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("Invalid Token");
                return;
            }

            // Removing the Refresh Token
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken)
            await user.save();
            res.status(200).send("Logged Out");

        } catch (error) {
            res.status(400).send("Invalid Token");
        }
    });
}

const refresh = async (req: Request, res: Response) => {
    // Validate the refresh token
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("Missing Token");
        return;
    }
    // Environment Check
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, data: any) => {
        if (err) {
            res.status(403).send("Token expired or invalid")
            return;
        }
        // Find User 
        const payload = data as TokenPayload;
        try {
            const user = await userModel.findOne({ _id: payload._id })
            if (!user) {
                res.status(400).send("User Not Found");
                return;
            }

            // Check that the token is registerd with the user
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("Invalid Token");
                return;
            }

            // Generate Tokens
            const newTokens = generateTokens(user.id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("Missing Configuration")
                return;
            }

            // Delete Old Refresh Token
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens.push(newTokens.refreshToken);
            await user.save();

            res.status(200).send({
                refreshToken: newTokens.refreshToken,
                accessToken: newTokens.accessToken,
                _id: user._id
            });
        } catch (error) {
            res.status(400).send("Invalid Token");
        }
    })
}


type TokenPayload = {
    _id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header('authorization');
    const accessToken = authorizationHeader && authorizationHeader.split(' ')[1];

    if (!accessToken) {
        res.status(401).send("Access Denied")
        return;
    }

    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            res.status(401).send("Access Deniedasdasd")
            return;
        }
        req.params.userId = (data as TokenPayload)._id;
        next();
    });
}

export default {
    register,
    login,
    logout,
    refresh
}