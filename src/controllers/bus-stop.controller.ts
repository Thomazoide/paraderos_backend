import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { BusStop, BusStopDTO } from "src/entities/bus-stop.entity";
import { BusStopService } from "src/services/bus-stop.service";
import { ResponsePayload, ResponsePayloadDTO } from "src/types/types";

@ApiTags("paraderos")
@Controller("/paraderos/v1")
export class BusStopController {
    constructor(
        private readonly service: BusStopService
    ){};

    //Para crear o actualizar
    @ApiOperation({
        description: "Crea o actualiza un paradero"
    })
    @ApiBody({
        type: BusStop
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<BusStop>,
        example: {
            message: "Paraderos creado/actualizado",
            data: new BusStopDTO(),
            error: false
        },
        description: "Entrega el paradero creado/modificado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
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

    @ApiOperation({
        description: "Entrega una lista con todos los paraderos"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<BusStop[]>,
        example: {
            message: "Paraderos encontrados",
            data: [
                new BusStopDTO(),
                new BusStopDTO(),
                new BusStopDTO(),
            ],
            error: false
        }
    })
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

    @ApiOperation({
        description: "Buscar paradero por código o ID"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "index",
        example: "STRING code: \"PF108-j\" OR NUMBER ID: \"2\"",
        description: "Puede ser el código del paradero como un string o simplemente el ID que tiene en BBDD"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<BusStop>,
        example: {
            message: "Paradero encontrado",
            data: new BusStopDTO(),
            error: false
        }
    })
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

    @ApiOperation({
        description: "Eliminar paradero por código o ID"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "index",
        example: "STRING code: \"PF108-j\" OR NUMBER ID: \"2\"",
        description: "Puede ser el código del paradero como un string o simplemente el ID que tiene en BBDD"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<BusStop>,
        example: {
            message: "Paradero '0' eliminado",
            data: new BusStopDTO(),
            error: false
        }
    })
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