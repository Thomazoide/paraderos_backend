import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Route } from "src/entities/route.entity";
import { RouteService } from "src/services/route.service";
import { ResponsePayload } from "src/types/types";

@Controller("rutas/v1")
export class RouteController {
    constructor(
        private readonly service: RouteService
    ){};

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