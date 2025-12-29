import express from 'express'
import initDB from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes';
import { usersRoutes } from './modules/users/users.routes';
import { bookingsRoutes } from './modules/bookings/bookings.routes';
import { autoReturnBookingsJob } from './jobs/autoReturnBookings';


const app = express();

app.use(express.json());


// Server startup
(async () => {
    // init DB
    await initDB();

    // Auto Return for Expired Bookings
    autoReturnBookingsJob();
})();


// Authentication Endpoints
app.use("/api/v1/auth", authRoutes);

// Vehicle Endpoints
app.use("/api/v1/vehicles", vehicleRoutes);

// User Endpoints
app.use("/api/v1/users", usersRoutes);

// Booking Endpoints
app.use("/api/v1/bookings", bookingsRoutes);


export default app;