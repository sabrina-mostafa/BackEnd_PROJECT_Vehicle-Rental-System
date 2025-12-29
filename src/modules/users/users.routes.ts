import express from "express";
import { usersControllers } from "./users.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";
import adminOrOwner from "../../middlewares/adminOrOwner";

const router = express.Router();

// Get All Users
router.get("/", auth(USER_ROLES.ADMIN), usersControllers.getAllUsers);

// Update User
router.put(
    "/:userId",
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    adminOrOwner,
    usersControllers.updateUser
);

// Delete User
router.delete("/:userId", auth(USER_ROLES.ADMIN), usersControllers.deleteUser);

export const usersRoutes = router;
