import express from "express";
import { bookingsControllers } from "./bookings.controllers";
import { USER_ROLES } from "../../constants/userRoles";
import auth from "../../middlewares/auth";

const router = express.Router();


// Create Booking
router.post("/", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bookingsControllers.createBookings);

// Get All Bookings
router.get("/", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bookingsControllers.getAllBookings);

// Update Booking
router.put("/:bookingId", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bookingsControllers.updateBookings);


export const bookingsRoutes = router;