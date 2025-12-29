import { NextFunction, Request, Response } from "express";
import { USER_ROLES } from "../constants/userRoles";


const adminOrOwner = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    if (user.role === USER_ROLES.ADMIN) {
        return next();
    }

    if (user.id != req.params.userId) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: not admin or owner",
        });
    }
    next();
}

export default adminOrOwner;