import { UserRoles } from "../../constants/userRoles";


export interface UpdateUserDTO {
    name?: string,
    email?: string,
    phone?: string,
    role?: UserRoles
}