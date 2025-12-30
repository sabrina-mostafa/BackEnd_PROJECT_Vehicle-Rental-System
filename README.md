


# 🚗 Vehicle Rental System (Backend)

**Live URL (API Base):** [`https://back-end-project-vehicle-rental-sys.vercel.app/`](https://back-end-project-vehicle-rental-sys.vercel.app/)

A robust backend API for managing a vehicle rental system with modules for **vehicles, customers, bookings**, and **secure role-based authentication**.

---

## 🎯 Project Overview

The Vehicle Rental System backend provides a modular API for:

* **Vehicles** – Manage inventory, track availability, and handle CRUD operations.
* **Customers** – Register, update profiles, and manage own bookings.
* **Bookings** – Create bookings, calculate total rental cost, handle cancellations, returns, and auto-return logic.
* **Authentication** – Secure JWT-based authentication with **Admin** and **Customer** roles.
* **Auto-Return System** – Automatically marks bookings as returned when the rental period ends.

---

## 🛠️ Technology Stack

* **Node.js** + **TypeScript** – Backend development
* **Express.js** – Web framework
* **PostgreSQL** – Database
* **bcryptjs** – Password hashing
* **jsonwebtoken (JWT)** – Authentication
* **node-cron** – Scheduled jobs (auto-return)
* **tsx** – Run TypeScript directly in development

---

## 📁 Project Structure

```
src/
 ├─ app.ts                  # Express app setup
 ├─ server.ts               # Server bootstrap
 ├─ config/
 │    ├─ db.ts              # PostgreSQL pool configuration
 │    └─ index.ts           # Environment configuration
 ├─ constants/              # Enums and constants
 │    ├─ availabilityStatus.ts
 │    ├─ bookingStatus.ts
 │    ├─ userRoles.ts
 │    └─ vehiclesTypes.ts
 ├─ db/
 │    ├─ initEnums.ts       # Initialize ENUM types
 │    └─ initTables.ts      # Initialize DB tables
 ├─ jobs/
 │    └─ autoReturnBookings.ts  # Cron job to auto-mark bookings returned
 ├─ modules/
 │    ├─ auth/
 │    │    ├─ auth.routes.ts
 │    │    ├─ auth.controllers.ts
 │    │    ├─ auth.services.ts
 │    │    └─ auth.interface.ts
 │    ├─ users/
 │    │    ├─ users.routes.ts
 │    │    ├─ users.controllers.ts
 │    │    ├─ users.services.ts
 │    │    └─ users.interface.ts
 │    ├─ vehicles/
 │    │    ├─ vehicles.routes.ts
 │    │    ├─ vehicles.controllers.ts
 │    │    ├─ vehicles.services.ts
 │    │    └─ vehicles.interfaces.ts
 │    └─ bookings/
 │         ├─ bookings.routes.ts
 │         ├─ bookings.controllers.ts
 │         ├─ bookings.services.ts
 │         └─ bookings.interfaces.ts
 ├─ middleware/
 │    ├─ auth.ts
 │    └─ adminOrOwner.ts
 └─ types/
      └─ express/
           └─ name.d.ts      # Custom Express request types
```

---

## 🔐 Authentication & Authorization

* **User Roles**

  * **Admin** – Full system access to manage vehicles, users, and bookings.
  * **Customer** – Can view vehicles, manage own bookings, and update own profile.
* **Password Security** – Passwords are hashed using `bcrypt`.
* **JWT Authentication** – Protected endpoints require token in header:
  `Authorization: Bearer <token>`
* **Access Control** – Role-based validation for each endpoint. Unauthorized access returns `401` or `403`.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint            | Access | Description           |
| ------ | ------------------- | ------ | --------------------- |
| POST   | /api/v1/auth/signup | Public | Register new user     |
| POST   | /api/v1/auth/signin | Public | Login and receive JWT |

### Vehicles

| Method | Endpoint                    | Access | Description                                 |
| ------ | --------------------------- | ------ | ------------------------------------------- |
| POST   | /api/v1/vehicles            | Admin  | Add new vehicle                             |
| GET    | /api/v1/vehicles            | Public | List all vehicles                           |
| GET    | /api/v1/vehicles/:vehicleId | Public | Get vehicle details                         |
| PUT    | /api/v1/vehicles/:vehicleId | Admin  | Update vehicle details                      |
| DELETE | /api/v1/vehicles/:vehicleId | Admin  | Delete vehicle (only if no active bookings) |

### Users

| Method | Endpoint              | Access    | Description                              |
| ------ | --------------------- | --------- | ---------------------------------------- |
| GET    | /api/v1/users         | Admin     | List all users                           |
| PUT    | /api/v1/users/:userId | Admin/Own | Update user details                      |
| DELETE | /api/v1/users/:userId | Admin     | Delete user (only if no active bookings) |

### Bookings

| Method | Endpoint                    | Access         | Description                                                                                  |
| ------ | --------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| POST   | /api/v1/bookings            | Admin/Customer | Create booking, calculate total price, update vehicle status                                 |
| GET    | /api/v1/bookings            | Role-based     | Admin: all bookings; Customer: own bookings                                                  |
| PUT    | /api/v1/bookings/:bookingId | Role-based     | Customer: cancel booking before start date; Admin: mark returned; System: auto-mark returned |

---

## 🛠️ Setup & Usage Instructions

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Vehicle-Rental-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

* Create `.env` file in project root
* Add:

```
PORT=5000
DB_CONNECTION=<your-postgres-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### 4. Database Setup

* Connect to PostgreSQL (e.g., NeonDB)
* Initialize ENUMs and tables using `db/initEnums.ts` and `db/initTables.ts`

### 5. Run Project Locally

```bash
npm run dev
```

* Server runs on `http://localhost:5000`

### 6. Build Project

```bash
npm run build
```

* Compiles TypeScript to JavaScript in `dist/`

---

## 🔧 Additional Notes

* Follows **modular architecture** with separation of concerns (routes → controllers → services → database).
* Uses **transactions** for critical operations like booking updates.
* **Auto-return cron job** runs periodically using `node-cron`.
* All endpoints follow **strict request/response format** for consistency and API reliability.



