import { ApiProperty } from "@nestjs/swagger";
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
};
export interface UpdatePositionPayload {
    id: number;
    lat: number;
    lng: number;
    timestamp: string;
};
export interface RequestPositionPayload {
    id: number;
};

export interface CloseVisitFormPayload {
    id: number;
    commentP2: string;
    picStr: string;
};

export interface Base64Pics {
    picBefore: string;
    picAfter: string;
};

export type sinceDate = "day" | "week" | "month";

export class ResponsePayloadDTO<T> {
    @ApiProperty()
    message: string;
    @ApiProperty()
    data?: T;
    @ApiProperty()
    error: boolean;
};