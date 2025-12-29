export const BOOKING_STATUS = {
    ACTIVE: "active",
    CANCELLED: "cancelled",
    RETURNED: "returned"
}  as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];