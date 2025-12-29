export const AVAILABILITY_STATUS = {
    AVAILABLE: "available",
    BOOKED: "booked"
} as const;

export type availabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS];