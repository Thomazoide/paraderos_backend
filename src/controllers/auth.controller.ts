import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/services/auth.service";
import { LoginPayload, ResponsePayload, VerifyTokenPayload } from "src/types/types";

@Controller("auth/v1")
export class AuthController {
    constructor(
        private readonly service: AuthService
    ){};

    @Post("login")
    async Login(
        @Body()
        payload: LoginPayload
    ): Promise<ResponsePayload<string>> {
        try {
            return {
                message: "Sesion iniciada",
                data: await this.service.Login(payload),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Post("verificar-token")
    async VerifyToken(
        @Body()
        payload: VerifyTokenPayload
    ): Promise<ResponsePayload<boolean>> {
        try {
            return {
                message: "Token valido",
                data: await this.service.VerifyToken(payload.token),
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