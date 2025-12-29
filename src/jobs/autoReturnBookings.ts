import cron from 'node-cron';
import { pool } from '../config/db';


export const autoReturnBookingsJob = () => {
    // every hour
    cron.schedule('0 * * * *', async () => {

        const client = await pool.connect();

        try {
            await client.query(`BEGIN`);

            // expired active bookings
            const expiredBookings = await client.query(`
                SELECT id, vehicle_id FROM Bookings
                WHERE status = 'active'
                AND rent_end_date < NOW()
                `);

            if (expiredBookings.rows.length === 0) {
                await client.query(`COMMIT`);
                return;
            }

            const bookingIds = expiredBookings.rows.map(b => b.id);
            const vehicleIds = expiredBookings.rows.map(v => v.vehicle_id);

            // Marking bookings as returned & vehicles as available
            await client.query(`
                UPDATE Bookings
                SET status = 'returned'
                WHERE id = ANY($1)`
                , [bookingIds]);

            await client.query(`
                UPDATE Vehicles
                SET availability_status = 'available'
                WHERE id = ANY($1)`
                , [vehicleIds])

            await client.query(`COMMIT`);
            // console.log("Auto-return job executed successfully");
        }
        catch (err) {
            await client.query(`ROLLBACK`);
            // console.error("Auto-return job failed", err);
        }
        finally {
            client.release();
        }
    });
} 