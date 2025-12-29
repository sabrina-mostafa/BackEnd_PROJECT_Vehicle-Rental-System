import { Pool } from "pg";
import config from ".";
import { initEnums } from "../db/initEnums";
import { initTables } from "../db/initTables";

export const pool = new Pool({
    connectionString: config.connection_str
});


// ---------------------- DB initialization ----------------------
const initDB = async () => {

    // creates user-role type if the type already not exists
    await initEnums();

    // creates table if not exists
    await initTables();

}

export default initDB;