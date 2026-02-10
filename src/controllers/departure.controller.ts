import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Departure } from "src/entities/departure.entity";
import { DepartureService } from "src/services/departure.service";
import { CreateRegPayload, ResponsePayload } from "src/types/types";

@ApiTags("salidas-deprecado")
@Controller("salidas/v1")
export class DepartureController {
    constructor(
        private readonly service: DepartureService
    ){};

    @ApiOperation({
        deprecated: true
    })
    @Get()
    async GetAllDepartures(): Promise<ResponsePayload<Departure[]>> {
        try {
            return {
                message: "Todas las salidas",
                data: await this.service.GetAllDepartures(),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
    
    @ApiOperation({
        deprecated: true
    })
    @Post()
    async SaveDeparture(
        @Body()
        newDeparture: CreateRegPayload<Partial<Departure>>
    ): Promise<ResponsePayload<Departure>> {
        try {
            return {
                message: "Salida registrada",
                data: await this.service.SaveDeparture(newDeparture),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @ApiOperation({
        deprecated: true
    })
    @Get("usuario/:id")
    async GetByUserID(
        @Param("id", ParseIntPipe)
        user_id: number
    ): Promise<ResponsePayload<Departure[]>> {
        try {
            return {
                message: `Salidas del usuario ${user_id}`,
                data: await this.service.GetDeparturesByUserID(user_id),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            }
        }
    };

    @ApiOperation({
        deprecated: true
    })
    @Get("paradero/:id")
    async GetByStopID(
        @Param("id", ParseIntPipe)
        bus_stop_id: number
    ): Promise<ResponsePayload<Departure[]>> {
        try {
            return {
                message: `Salidas asociadas al paradero: #${bus_stop_id}`,
                data: await this.service.GetDeparturesByStopID(bus_stop_id),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }
};