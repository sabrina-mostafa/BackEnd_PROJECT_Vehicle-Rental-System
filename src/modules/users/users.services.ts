import { pool } from "../../config/db";
import { UpdateUserDTO } from "./users.interfaces";


// Get All Users
const getAllUsers = async () => {
    const result = await pool.query("SELECT id, name, email, phone, role FROM Users");
    return result;
}

// Update User
const updateUser = async (payload: UpdateUserDTO, userId: string) => {
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
        UPDATE Users SET ${fields.join(", ")}  WHERE id = $${index} RETURNING 
        id, 
        name, 
        email, 
        phone, 
        role`
        , [...values, userId]);

    if (result.rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    return result.rows[0];
};

// Delete User
const deleteUser = async (userId: string) => {

    const activeBookings = await pool.query(`
        SELECT * FROM Bookings
        WHERE customer_id = $1
        AND status = 'active'
        `, [userId]);

    if (activeBookings.rows.length !== 0) {
        throw new Error("CAN_NOT_DELETE")
    }

    const result = await pool.query(`
        DELETE FROM Users WHERE id = $1`
        , [userId]);

    if (result.rowCount === 0) {
        throw new Error("USER_NOT_FOUND");
    }
    return;
};


export const usersServices = {
    getAllUsers,
    updateUser,
    deleteUser
}