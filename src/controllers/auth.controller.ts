import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "src/decorators/public.decorator";
import { AuthService } from "src/services/auth.service";
import { LoginPayload, LoginPayloadDTO, ResponsePayload, ResponsePayloadDTO, VerifyTokenPayload, VerifyTokenPayloadDTO } from "src/types/types";

@ApiTags("Autorización")
@Controller("auth/v1")
export class AuthController {
    constructor(
        private readonly service: AuthService
    ){};

    @ApiOperation({
        deprecated: true,
        description: "Api deprecada por mala encriptación de contraseñas"
    })
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

    @ApiOperation({
        description: "Se encarga de verificar si un token es valido o está vencido"
    })
    @ApiBody({
        type: VerifyTokenPayloadDTO
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<boolean>,
        example: {
            message: "Token válido",
            data: true,
            error: false
        }
    })
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

@ApiTags("Autorización")
@Controller("auth/v2")
export class AuthControllerV2 {
    constructor(
        private readonly service: AuthService
    ){};

    @ApiOperation({
        description: "Inicio de sesión con nombre de usuario y contraseña"
    })
    @ApiBody({
        type: LoginPayloadDTO
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<string>,
        example: {
            message: "Sesión iniciada",
            data: "TOKEN DE ACCESO",
            error: false
        },
        description: "Entrega un token de acceso al usuario para navegar durante 3 horas en la aplicación"
    })
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