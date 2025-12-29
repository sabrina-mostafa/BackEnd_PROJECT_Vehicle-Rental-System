export const VEHICLES_TYPES = {
    CAR: 'car',
    BIKE: 'bike',
    VAN: 'van',
    SUV: 'SUV'
} as const;

export type vehiclesTypes = typeof VEHICLES_TYPES[keyof typeof VEHICLES_TYPES];