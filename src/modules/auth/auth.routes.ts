import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();


// User Registration
router.post("/signup", authControllers.signUp);

// User Login
router.post("/signin", authControllers.signIn);


export const authRoutes = router;