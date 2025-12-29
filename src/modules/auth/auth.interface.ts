import { UserRoles } from "../../constants/userRoles";


export interface SignUpDTO {
    name: string,
    email: string,
    password: string,
    phone: string,
    role: UserRoles
}