export const USER_ROLES = {
    ADMIN: "admin",
    CUSTOMER: "customer"
} as const;

export type UserRoles = typeof USER_ROLES[keyof typeof USER_ROLES];