import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { SignUpDTO } from "./auth.interface";


// User Registration
const signUp = async (payload: SignUpDTO) => {
    const { name, email, password, phone, role } = payload;

    const hashedPass = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO Users(name, email, password, phone, role) values($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
        [name, email, hashedPass, phone, role]);
    return result;
}

// User Login
const signIn = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT id, name, email, password, phone, role FROM Users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }
    const user = result.rows[0];
    const matchPass = await bcrypt.compare(password, user.password);

    // never return password
    delete user.password;

    if (!matchPass) {
        throw new Error("INVALID_PASSWORD");
    }
    const secret = config.jwtSecret;
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, secret as string, { expiresIn: "3d" });

    return { token, user };
}


export const authServices = {
    signUp,
    signIn,
}