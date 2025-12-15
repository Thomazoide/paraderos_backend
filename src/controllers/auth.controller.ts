import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "src/services/auth.service";
import { LoginPayload, ResponsePayload, VerifyTokenPayload } from "src/types/types";

@Controller("auth/v1")
export class AuthController {
    constructor(
        private readonly service: AuthService
    ){};

    @Public()
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

    @Public()
    @Post("verificar-token")
    async VerifyToken(
        @Body()
        payload: VerifyTokenPayload
    ): Promise<ResponsePayload<boolean>> {
        try {
            const isValid = await this.service.VerifyToken(payload.token);
            return {
                message: isValid ? "Sesión valida" : "Sesión expirada",
                data: isValid,
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

@Controller("auth/v2")
export class AuthControllerV2 {
    constructor(
        private readonly service: AuthService
    ){};

    @Public()
    @Post("login")
    async Login(
        @Body()
        payload: LoginPayload
    ): Promise<ResponsePayload<string>> {
        try {
            return {
                message: "Sesión iniciada",
                data: await this.service.LoginV2(payload),
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