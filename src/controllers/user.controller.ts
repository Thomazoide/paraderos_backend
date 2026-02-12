import { Body, Controller, Get, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { Public } from "src/decorators/public.decorator";
import { User } from "src/entities/user.entity";
import { UserService } from "src/services/user.service";
import { RegisterUserDTO, ResponsePayload, ResponsePayloadDTO, UpdatePasswordPayload, UpdatePasswordPayloadDTO } from "src/types/types";

@ApiTags("usuarios")
@Controller("usuarios/v1")
export class UserController {
    constructor(
        private readonly service: UserService
    ){};

    @ApiOperation({
        description: "Entrega una lista con todos los usuarios registrados en BBDD"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<User[]>,
        example: {
            message: "Usuarios encontrados",
            data: [
                new User(),
                new User(),
                new User()
            ],
            error: false
        }
    })
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

    @ApiOperation({
        description: "Api depreciada por uso de encriptación incorrecta",
        deprecated: true
    })
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

    @ApiOperation({
        description: "Api para actualizar un usuario, el usuario a actualizar debe venir en el cuerpo de la petición con su ID"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        type: User
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<User>,
        example: {
            message: "Usuario actualizado",
            data: {
                id: 0,
                "...": "...",
                username: "username",
            }
        }
    })
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

    @ApiOperation({
        description: "Api depreciada por uso de encriptación incorrecta",
        deprecated: true
    })
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

@ApiTags("usuarios")
@Controller("usuarios/v2")
export class UserControllerV2 {
    constructor(
        private readonly service: UserService
    ){};

    @ApiOperation({
        description: "Api para registrar un usuario en BBDD"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        type: RegisterUserDTO
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<User>,
        example: {
            message: "Usuario registrado",
            data: new User(),
            error: false
        }
    })
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

    @ApiOperation({
        description: "Api para actualizar la contraseña de un usuario"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        type: UpdatePasswordPayloadDTO
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<User>,
        example: {
            message: "Clave actualizada",
            data: new User(),
            error: false
        }
    })
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

    @ApiOperation({
        description: "Busca un usuario según el ID entregado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        example: 1
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<User>,
        example: {
            message: "Usuario encontrado",
            data: new User(),
            error: false
        }
    })
    @Get(":id")
    async GetUserByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<User>> {
        try {
            return {
                message: "Usuario encontrado",
                data: await this.service.GetUserByID(id),
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
        description: "Api utilizada para cambiar el tipo de encriptación de contraseña para usuarios creados con \"/usuarios/v1/registrar\"",
        deprecated: true
    })
    @Public()
    @Post("update-password-to-v2")
    async UpdatePasswordHashingToV2(
        @Body()
        payload: {
            userID: number;
            newPassword: string;
        }
    ): Promise<ResponsePayload<boolean>> {
        try {
            const result = await this.service.UpdatePasswordHashingToV2(payload.newPassword, payload.userID);
            if(!result) throw new Error("Error al actualizar metodo de encriptado");
            return {
                message: "Contraseña actualizada",
                data: result,
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                data: false,
                error: true
            };
        }
    };
};