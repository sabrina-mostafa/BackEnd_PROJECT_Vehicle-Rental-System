import { availabilityStatus } from "../../constants/availabilityStatus";
import { vehiclesTypes } from "../../constants/vehiclesTypes";

// Data Transfer Objects(DTO)

export interface CreateVehicleDTO {
    vehicle_name: string,
    type: vehiclesTypes,
    registration_number: string,
    daily_rent_price: number,
    availability_status: availabilityStatus
}

export interface UpdateVehicleDTO {
  vehicle_name?: string;
  type?: vehiclesTypes;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: availabilityStatus;
}
