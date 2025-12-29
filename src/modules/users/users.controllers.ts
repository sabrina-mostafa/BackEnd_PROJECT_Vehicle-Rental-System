import { Request, Response } from "express";
import { usersServices } from "./users.services";


// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Update User
const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.updateUser(req.body, req.params.userId as string);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        });
    } catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Delete User
const deleteUser = async (req: Request, res: Response) => {
    try {
        await usersServices.deleteUser(req.params.userId as string);
        res.status(200).json({
            "success": true,
            "message": "User deleted successfully"
        });
    } catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (err.message === "CAN_NOT_DELETE") {
            return res.status(400).json({
                success: false,
                message: "Active booking present, can't delete",
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};


export const usersControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}