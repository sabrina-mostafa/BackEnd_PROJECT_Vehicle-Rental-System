import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

// Create Vehicle
const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.createVehicle(req.body);
        const vehicle = result.rows[0];

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: {
                ...vehicle,
                daily_rent_price: parseFloat(vehicle.daily_rent_price),
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Get All Vehicles
const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getAllVehicles();

        if (result.length === 0) {
            return res.status(200).json({
                "success": true,
                "message": "No vehicles found",
                "data": []
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

// Get Vehicle by ID
const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getSingleVehicle(req.params.vehicleId as string);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        });
    } catch (err: any) {
        if (err.message === "VEHICLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Update Vehicle
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.updateVehicle(req.body, req.params.vehicleId as string);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        });
    } catch (err: any) {
        if (err.message === "VEHICLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err,
        });
    }
};

// Delete Vehicle
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        await vehiclesServices.deleteVehicle(req.params.vehicleId as string);
        res.status(200).json({
            "success": true,
            "message": "Vehicle deleted successfully"
        });
    } catch (err: any) {
        if (err.message === "VEHICLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
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


export const vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
};
