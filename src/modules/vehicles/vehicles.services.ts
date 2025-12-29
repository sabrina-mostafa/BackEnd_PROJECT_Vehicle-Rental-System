import { pool } from "../../config/db";
import { UpdateVehicleDTO, CreateVehicleDTO } from "./vehicles.interfaces";

// Create Vehicle
const createVehicle = async (payload: CreateVehicleDTO) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;

    const result = await pool.query(`
    INSERT INTO Vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`
        , [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result;
};

// Get All Vehicles
const getAllVehicles = async () => {

    const result = await pool.query(`
        SELECT id, 
        vehicle_name, 
        type, 
        registration_number, 
        daily_rent_price, 
        availability_status FROM Vehicles
    `);

    const vehicles = result.rows.map(vehicle => ({
        ...vehicle,
        daily_rent_price: parseFloat(vehicle.daily_rent_price)
    }));

    return vehicles;
};

// Get Vehicle by ID
const getSingleVehicle = async (vehicleId: string) => {

    const result = await pool.query(`
        SELECT id, 
        vehicle_name, 
        type, 
        registration_number, 
        daily_rent_price, 
        availability_status FROM Vehicles WHERE id = $1`
        , [vehicleId]);

    if (result.rows.length === 0) {
        throw new Error("VEHICLE_NOT_FOUND");
    }

    const row = result.rows[0];

    const vehicle = {
        ...row,
        daily_rent_price: parseFloat(row.daily_rent_price)
    };

    return vehicle;
};

// Update Vehicle
const updateVehicle = async (payload: UpdateVehicleDTO, vehicleId: string) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
            fields.push(`${key}=$${index}`);
            values.push(val);
            index++;
        }
    }

    const result = await pool.query(`
        UPDATE Vehicles SET ${fields.join(", ")}  WHERE id = $${index} RETURNING 
        id, 
        vehicle_name, 
        type, 
        registration_number, 
        daily_rent_price, 
        availability_status`
        , [...values, vehicleId]);

    if (result.rows.length === 0) {
        throw new Error("VEHICLE_NOT_FOUND");
    }

    const vehicle = {
        ...result.rows[0],
        daily_rent_price: parseFloat(result.rows[0].daily_rent_price)
    };

    return vehicle;
};

// Delete Vehicle
const deleteVehicle = async (vehicleId: string) => {

    const bookingStatus = await pool.query(`
        SELECT * FROM Vehicles
        WHERE id = $1
        AND availability_status = 'booked'
        `, [vehicleId]);

    if(bookingStatus.rows.length !== 0) {
        throw new Error("CAN_NOT_DELETE")
    }

    const result = await pool.query(`
        DELETE FROM Vehicles WHERE id = $1`
        , [vehicleId]);

    if (result.rowCount === 0) {
        throw new Error("VEHICLE_NOT_FOUND");
    }
    return;
};


export const vehiclesServices = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
};
