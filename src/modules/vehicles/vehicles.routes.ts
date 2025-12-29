import express from "express";
import { vehicleControllers } from "./vehicles.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../constants/userRoles";

const router = express.Router();


// Create Vehicle
router.post("/", auth(USER_ROLES.ADMIN), vehicleControllers.createVehicle);

// Get All Vehicles
router.get("/", vehicleControllers.getAllVehicles);

// Get Vehicle by ID
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// Update Vehicle
router.put("/:vehicleId", auth(USER_ROLES.ADMIN), vehicleControllers.updateVehicle);

// Delete Vehicle
router.delete("/:vehicleId", auth(USER_ROLES.ADMIN), vehicleControllers.deleteVehicle);


export const vehicleRoutes = router;