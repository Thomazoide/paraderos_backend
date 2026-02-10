import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { Route } from "src/entities/route.entity";
import { RouteService } from "src/services/route.service";
import { ResponsePayload, ResponsePayloadDTO } from "src/types/types";

@ApiTags("rutas")
@Controller("rutas/v1")
export class RouteController {
    constructor(
        private readonly service: RouteService
    ){};

    @ApiOperation({
        description: "Entrega una lista con todas las rutas"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Route[]>,
        example: {
            message: "Rutas encontradas",
            data: [
                new Route(),
                new Route(),
                new Route()
            ],
            error: false
        }
    })
    @Get()
    async GetAllRoutes(): Promise<ResponsePayload<Route[]>> {
        try {
            return {
                message: "Rutas encontradas",
                data: await this.service.GetAllRoutes(),
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
        description: "Crea o guarda los cambios de una ruta"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        type: Route
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<Route>,
        example: {
            message: "Ruta creada/guardada",
            data: new Route(),
            error: false
        }
    })
    @Post()
    async SaveRoute(
        @Body()
        newRoute: Partial<Route>
    ): Promise<ResponsePayload<Route>> {
        try {
            return {
                message: "Ruta creada/guardada",
                data: await this.service.SaveRoute(newRoute),
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
        description: "Busca una ruta segun el ID entregado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        example: 1
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Route>,
        example: {
            message: "Ruta encontrada",
            data: new Route(),
            error: false
        }
    })
    @Get("find/:id")
    async FindByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<Route>> {
        try {
            return {
                message: "Ruta encontrada",
                data: await this.service.FindByID(id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
}