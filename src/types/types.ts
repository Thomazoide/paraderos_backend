import { BusStop } from "src/entities/bus-stop.entity";
import { User } from "src/entities/user.entity";

export type UserType = "jefatura" | "terreno" | "oferente";
export type RoutePoint = {
    lat: number,
    lng: number
};
export interface ResponsePayload<T> {
    message: string;
    data?: T;
    error: boolean;
};
export interface CreateRegPayload<T> {
    userData: User;
    paradero: BusStop;
    registro: T;
};
export interface UpdatePasswordPayload {
    oldPassword: string;
    newPassword: string;
    id: number;
};
export interface LoginPayload {
    username: string;
    password: string;
};
export interface VerifyTokenPayload {
    token: string;
}