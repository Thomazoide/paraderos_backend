import { Body, Controller, Get, Post } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { User } from "src/entities/user.entity";
import { UserService } from "src/services/user.service";
import { ResponsePayload, UpdatePasswordPayload } from "src/types/types";

@Controller("usuarios/v1")
export class UserController {
    constructor(
        private readonly service: UserService
    ){};

    @Get()
    async GetAllUsers(): Promise<ResponsePayload<User[]>> {
        try {
            return {
                message: "usuarios",
                data: await this.service.GetAllUsers(),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Public()
    @Post("registrar")
    async Register(
        @Body()
        data: Partial<User>
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Usuario creado",
                data: await this.service.CreateUser(data),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Post("actualizar")
    async UpdateUser(
        @Body()
        data: Partial<User>
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Usuario actualizado",
                data: await this.service.UpdateUser(data),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Post("actualizar/clave")
    async UpdatePassword(
        @Body()
        payload: UpdatePasswordPayload
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Clave actualizada",
                data: await this.service.UpdatePassword(payload),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
};

@Controller("usuarios/v2")
export class UserControllerV2 {
    constructor(
        private readonly service: UserService
    ){};

    @Public()
    @Post("registrar")
    async Resgister(
        @Body()
        data: Partial<User>
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Usuario creado",
                data: await this.service.CreateUserV2(data),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Post("actualizar/clave")
    async UpdatePassword(
        @Body()
        payload: UpdatePasswordPayload
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Clave actualizada",
                data: await this.service.UpdatePasswordV2(payload),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
};