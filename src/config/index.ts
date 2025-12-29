import path from 'path';
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT,
    connection_str: process.env.CONNECTION_STR,
    jwtSecret: process.env.JWT_SECRET
}

export default config;