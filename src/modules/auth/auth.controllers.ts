import { Request, Response } from "express";
import { authServices } from "./auth.services";


// User Registration
const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signUp(req.body);

        res.status(201).json({
            "success": true,
            "message": "User registered successfully",
            "data": result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "errors": err
        });
    }
}

// User Login
const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authServices.signIn(email, password);

        res.status(200).json({
            "success": true,
            "message": "Login successful",
            "data": result
        });
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (err.message === "INVALID_PASSWORD") {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        
        res.status(500).json({
            "success": false,
            "message": err.message,
            "errors": err
        });
    }
}


export const authControllers = {
    signUp,
    signIn,
}