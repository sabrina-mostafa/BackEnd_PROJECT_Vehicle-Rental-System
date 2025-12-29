import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import config from '../config';

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            })
        }

        const authToken = authHeader.split(" ")[1];

        if (!authToken) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }
        try {
            const decodedTokenPayload = jwt.verify(authToken, config.jwtSecret as string) as JwtPayload;

            req.user = decodedTokenPayload;

            if (roles.length && !roles.includes(decodedTokenPayload.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden, you are not allowed!!"
                })
            }

            next();
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    };
};


export default auth;