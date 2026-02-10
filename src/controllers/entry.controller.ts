import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Entry } from "src/entities/entry.entity";
import { EntryService } from "src/services/entry.service";
import { CreateRegPayload, ResponsePayload } from "src/types/types";

@ApiTags("entradas-deprecado")
@Controller("entradas/v1")
export class EntryController {
    constructor(
        private readonly service: EntryService
    ){};

    @ApiOperation({
            deprecated: true
        })
    @Get()
    async GetAllEntries(): Promise<ResponsePayload<Entry[]>> {
        try {
            return {
                message: "Entradas registradas",
                data: await this.service.GetAllEntries(),
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
    async SaveEntry(
        @Body()
        newEntry: CreateRegPayload<Partial<Entry>>
    ): Promise<ResponsePayload<Entry>> {
        try {
            return {
                message: "Entrada registrada",
                data: await this.service.SaveEntry(newEntry),
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
    ): Promise<ResponsePayload<Entry[]>> {
        try {
            return {
                message: `Registros de usuario ${user_id}`,
                data: await this.service.GetEntriesByUserID(user_id),
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
    @Get("paradero/:id")
    async GetByStopID(
        @Param("id", ParseIntPipe)
        bus_stop_id: number
    ): Promise<ResponsePayload<Entry[]>> {
        try {
            return {
                message: `Registros del paradero ${bus_stop_id}`,
                data: await this.service.GetEntriesByStopID(bus_stop_id),
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