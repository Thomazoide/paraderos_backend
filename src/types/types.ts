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
export class LoginPayloadDTO {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}
export interface VerifyTokenPayload {
    token: string;
};
export class VerifyTokenPayloadDTO {
    @ApiProperty()
    token: string;
}
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

export class Base64PicsDTO {
    @ApiProperty()
    picBefore: string;
    @ApiProperty()
    picAfter: string;
}

export type sinceDate = "day" | "week" | "month";

export class ResponsePayloadDTO<T> {
    @ApiProperty()
    message: string;
    @ApiProperty()
    data?: T;
    @ApiProperty()
    error: boolean;
};

export class RegisterUserDTO {
    @ApiProperty()
    full_name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    user_type: UserType;
    @ApiProperty()
    password: string;
}

export class UpdatePasswordPayloadDTO {
    @ApiProperty()
    oldPassword: string;
    @ApiProperty()
    newPassword: string;
    @ApiProperty()
    id: number;
};