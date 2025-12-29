import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import { BookingStatus } from "../../constants/bookingStatus";
import { CreateBookingsDTO } from "./bookings.interfaces";
import { USER_ROLES } from "../../constants/userRoles";


// Create Booking
const createBookings = async (payload: CreateBookingsDTO) => {
    const {
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date
    } = payload;

    const userResult = await pool.query(`SELECT * FROM Users WHERE id=$1`, [customer_id]);

    if (userResult.rows.length === 0) {
        throw new Error("USER_NOT_EXISTS");
    }

    const vehicleResult = await pool.query(`
        SELECT vehicle_name, daily_rent_price, availability_status FROM Vehicles WHERE id = $1`
        , [vehicle_id]);

    if (vehicleResult.rows.length === 0) {
        throw new Error("VEHICLE_NOT_FOUND");
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
        throw new Error("VEHICLE_ALREADY_BOOKED");
    }

    const dailyRentPrice = Number(vehicle.daily_rent_price);

    const start = new Date(rent_start_date).getTime();
    const end = new Date(rent_end_date).getTime();

    if (start >= end) {
        throw new Error("INVALID_DURATION")
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDuration = Math.ceil((end - start) / msPerDay);

    const totalPrice = dailyRentPrice * rentalDuration;


    // Here, try/catch is essential to rollback the transaction if anything fails
    // Without try/catch, the DB could stay in inconsistent state (booking inserted, vehicle not updated)
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const bookingInfo = await client.query(`
            INSERT INTO Bookings( customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) 
            VALUES($1, $2, $3, $4, $5) 
            RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`
            , [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]);

        await client.query(`
            UPDATE Vehicles SET availability_status = $1 WHERE id = $2`
            , ["booked", vehicle_id]);

        await client.query(`COMMIT`);

        return {
            ...bookingInfo.rows[0],
            rent_start_date: new Date(bookingInfo.rows[0].rent_start_date).toLocaleDateString("en-CA"),
            rent_end_date: new Date(bookingInfo.rows[0].rent_end_date).toLocaleDateString("en-CA"),
            total_price: parseFloat(bookingInfo.rows[0].total_price),
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: parseFloat(vehicle.daily_rent_price)
            }
        };
    }
    catch (err) {
        await client.query(`ROLLBACK`);
        throw err;
    } finally {
        client.release();
    }
};

// Get All Bookings
const getAllBookings = async (user: JwtPayload) => {

    let query = `SELECT 
            b.id, 
            b.customer_id, 
            b.vehicle_id, 
            b.rent_start_date, 
            b.rent_end_date, 
            b.total_price, 
            b.status,

            u.name AS customer_name,
            u.email AS customer_email,

            v.vehicle_name,
            v.registration_number,
            v.type
        
        FROM Bookings b
        JOIN Users u ON b.customer_id = u.id
        JOIN Vehicles v ON b.vehicle_id = v.id`;


    const values = [];
    if (user.role !== USER_ROLES.ADMIN) {
        query += ` WHERE b.customer_id = $1`;
        values.push(user.id);
    }

    const bookingResults = await pool.query(query, values);

    return bookingResults.rows.map(row => ({    // returns an Array
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: new Date(row.rent_start_date).toLocaleDateString("en-CA"),
        rent_end_date: new Date(row.rent_end_date).toLocaleDateString("en-CA"),
        total_price: parseFloat(row.total_price),
        status: row.status,
        customer: {
            name: row.customer_name,
            email: row.customer_email
        },
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type
        },
    }));
};

// Update Booking
const updateBookings = async (status: BookingStatus, bookingId: string, user: JwtPayload) => {

    if (status === "active") {
        throw new Error("INVALID_INPUT");
    }

    const bookingStartResult = await pool.query(`
        SELECT customer_id, vehicle_id, rent_start_date FROM Bookings WHERE id=$1`
        , [bookingId]);

    if (bookingStartResult.rows.length === 0) {
        throw new Error("BOOKING_NOT_FOUND");
    }

    if (status === "cancelled") {
        if (user.role === USER_ROLES.ADMIN) {
            throw new Error("USER_IS_ADMIN");
        }

        const currentTime = Date.now();
        const bookingStartDate = new Date(bookingStartResult.rows[0].rent_start_date).getTime();

        if (currentTime >= bookingStartDate) {
            throw new Error("CAN_NOT_CANCEL");
        }

        if (user.id !== bookingStartResult.rows[0].customer_id) {
            throw new Error("NOT_OWNER");
        }
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const vehicle_id = bookingStartResult.rows[0].vehicle_id;
        const vehicleStatusUpdate = await client.query(`
            UPDATE Vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`
            , ["available", vehicle_id]);

        if (vehicleStatusUpdate.rows.length === 0) {
            throw new Error("VEHICLE_NOT_FOUND");
        }

        const bookingResult = await client.query(`
        UPDATE Bookings SET status=$1
        WHERE id=$2 RETURNING 
            id, 
            customer_id, 
            vehicle_id, 
            rent_start_date, 
            rent_end_date, 
            total_price, 
            status`, [status, bookingId]);

        await client.query("COMMIT");

        return status === "cancelled" ?
            bookingResult.rows[0]
            :
            {
                ...bookingResult.rows[0],
                rent_start_date: new Date(bookingResult.rows[0].rent_start_date).toLocaleDateString("en-CA"),
                rent_end_date: new Date(bookingResult.rows[0].rent_end_date).toLocaleDateString("en-CA"),
                total_price: parseFloat(bookingResult.rows[0].total_price),
                vehicle: {
                    availability_status: vehicleStatusUpdate.rows[0].availability_status
                }
            }
    }
    catch (err) {
        await client.query(`ROLLBACK`);
        throw err;
    } finally {
        client.release();
    }
};


export const bookingsServices = {
    createBookings,
    getAllBookings,
    updateBookings
}