import { Request, Response } from "express";
import { bookingsServices } from "./bookings.services";
import { USER_ROLES } from "../../constants/userRoles";


// Create Booking
const createBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.createBookings(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (err: any) {
        if (err.message === "USER_NOT_EXISTS") {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists"
            });
        }
        if (err.message === "VEHICLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Vehicle doesn't exists"
            });
        }
        if (err.message === "VEHICLE_ALREADY_BOOKED") {
            return res.status(400).json({
                success: false,
                message: "This vehicle is already booked"
            });
        }
        if (err.message === "INVALID_DURATION") {
            return res.status(400).json({
                success: false,
                message: "End date must be after Start date"
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Get All Bookings
const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.getAllBookings(req.user!);

        if (result.length === 0) {
            return res.status(200).json({
                "success": true,
                "message": "No bookings found",
                "data": []
            });
        }
        if (req.user!.role !== USER_ROLES.ADMIN) {
            return res.status(200).json({
                "success": true,
                "message": "Your bookings retrieved successfully",
                "data": result
            });
        }
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Update Booking
const updateBookings = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const result = await bookingsServices.updateBookings(status, req.params.bookingId as string, req.user!);

        if (status === "cancelled") {
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result
            });
        }
        return res.status(200).json({
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: result
        });

    } catch (err: any) {
        if (err.message === "INVALID_INPUT") {
            return res.status(400).json({
                success: false,
                message: "Invalid input status",
            });
        }
        if (err.message === "BOOKING_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Booking doesn't exist",
            });
        }
        if (err.message === "USER_IS_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "You are Admin, only customers can cancel their bookings",
            });
        }
        if (err.message === "CAN_NOT_CANCEL") {
            return res.status(400).json({
                success: false,
                message: "Can't cancel as booking already started",
            });
        }
        if (err.message === "NOT_OWNER") {
            return res.status(400).json({
                success: false,
                message: "Can't cancel, kindly select your own booking",
            });
        }
        if (err.message === "VEHICLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Vehicle doesn't exist",
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};


export const bookingsControllers = {
    createBookings,
    getAllBookings,
    updateBookings
}