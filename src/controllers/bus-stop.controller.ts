import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { BusStop } from "src/entities/bus-stop.entity";
import { BusStopService } from "src/services/bus-stop.service";
import { ResponsePayload } from "src/types/types";

@Controller("/paraderos")
export class BusStopController {
    constructor(
        private readonly service: BusStopService
    ){};

    //Para crear o actualizar
    @Post()
    async SaveBusStop(
        @Body()
        data: Partial<BusStop>
    ): Promise<ResponsePayload<BusStop>> {
        try {
            return {
                message: "Paradero guardado!",
                data: await this.service.SaveBusStop(data),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Get()
    async GetAllBusStops(): Promise<ResponsePayload<BusStop[]>> {
        try {
            return {
                message: "Paraderos existentes",
                data: await this.service.GetBusStops(),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Get("find/:index")
    async FindOneBusStop(
        @Param("index")
        index: string | number
    ): Promise<ResponsePayload<BusStop>> {
        try {
            return {
                message: "Paradero encontrado",
                data: await this.service.FindOneBusStop(index),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Delete("delete/:index")
    async DeleteBusStop(
        @Param("index")
        index: string | number
    ): Promise<ResponsePayload<BusStop>> {
        try {
            return {
                message: "Paradero eliminado del sistema",
                data: await this.service.DeleteBusStop(index),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
};