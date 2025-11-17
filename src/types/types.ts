import { BusStop } from "src/entities/bus-stop.entity";

export type UserType = "jefatura" | "terreno" | "oferente";
export type RoutePoint = {
    lat: number,
    lng: number
};
export interface ResponsePayload<T> {
    message: string;
    data?: T;
    error: boolean;
}
export interface CreateRegPayload<T> {
    paradero: BusStop;
    registro: T;
}