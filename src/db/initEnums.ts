import { pool } from "../config/db";
import { AVAILABILITY_STATUS } from "../constants/availabilityStatus";
import { BOOKING_STATUS } from "../constants/bookingStatus";
import { USER_ROLES } from "../constants/userRoles"
import { VEHICLES_TYPES } from "../constants/vehiclesTypes";


const createEnumIfNotExists = async (enumName: string, values: readonly string[]) => {

    // for SQL it's a must to convert the array into a single_quoted('') value string list
    const valueList = values.map(val => `'${val}'`).join(", ");     // output => ["admin", "customer"] => ["'admin'", "'customer'"] => "'admin', 'customer'"

    // create custom enum type if not exists
    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = '${enumName}'
                ) THEN
                    CREATE TYPE ${enumName} AS ENUM (${valueList});
            END IF;
        END
        $$;
        `);
}


export const initEnums = async () => {
    await createEnumIfNotExists("user_role", Object.values(USER_ROLES));
    await createEnumIfNotExists("vehicle_type", Object.values(VEHICLES_TYPES));
    await createEnumIfNotExists("availability_status", Object.values(AVAILABILITY_STATUS));
    await createEnumIfNotExists("booking_status", Object.values(BOOKING_STATUS));
}