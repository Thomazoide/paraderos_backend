import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { WorkOrder, WorkOrderDTO } from "src/entities/work-order.entity";
import { WorkOrderService } from "src/services/work-order.service";
import { ResponsePayload, ResponsePayloadDTO } from "src/types/types";

@ApiTags("órdenes de trabajo")
@Controller("ordenes/v1")
export class WorkOrderController {
    constructor(
        private readonly service: WorkOrderService
    ){};

    @ApiOperation({
        description: "Entrega una lista con todas las ordenes de trabajo y sus rutas, usuarios y formularios asociados"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Órdenes encontradas",
            data: [],
            error: false
        }
    })
    @Get()
    async GetAll(): Promise<ResponsePayload<WorkOrder[]>> {
        try {
            return {
                message: "Ordenes encontradas",
                data: await this.service.GetAllOrders(),
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
        description: "API para crear una órden de trabajo"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        type: WorkOrderDTO
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Órden creada",
            data: new WorkOrderDTO(),
            error: false
        }
    })
    @Post()
    async SaveOrder(
        @Body()
        newOrder: Partial<WorkOrder>
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "orden creada/actualizada",
                data: await this.service.SaveOrder(newOrder),
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
        description: "Agrega un paradero visitado a una orden de trabajo"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                workOrder: {
                    type: "object",
                    description: "Objeto de la orden de trabajo"
                },
                busStopID: {
                    type: "number",
                    example: 1
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Orden actualizada",
            data: new WorkOrderDTO(),
            error: false
        }
    })
    @Post("agregar-paradero-visitado")
    async AddVisitStop(
        @Body()
        updateData: {
            workOrder: WorkOrder;
            busStopID: number;
        }
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden actualizada",
                data: await this.service.AddVisitedStopID(updateData),
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
        description: "Busca todas las órdenes de trabajo asociadas a un usuario específico"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 1,
        description: "ID del usuario"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<WorkOrder[]>,
        example: {
            message: "Órdenes encontradas",
            data: [],
            error: false
        }
    })
    @Get("buscar/usuario/:id")
    async FindByUserID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<WorkOrder[]>> {
        try {
            return {
                message: "Órdenes encontradas",
                data: await this.service.GetByUserID(id),
                error: false
            };
        } catch (err) {
            return {
                message: err instanceof Error ? err.message : "Error desconocido",
                error: true
            };
        }
    };

    @ApiOperation({
        description: "Busca una orden de trabajo específica por su ID"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 1,
        description: "ID de la orden de trabajo"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Orden encontrada",
            data: new WorkOrderDTO(),
            error: false
        }
    })
    @Get("buscar/:id")
    async FindByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden encontrada",
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

    @ApiOperation({
        description: "Busca una orden de trabajo por el ID de la ruta asociada"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 1,
        description: "ID de la ruta"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Orden encontrada",
            data: new WorkOrderDTO(),
            error: false
        }
    })
    @Get("ruta/:id")
    async FindByRouteID(
        @Param("id", ParseIntPipe)
        route_id: number
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden encontrada",
                data: await this.service.FindByRouteID(route_id),
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
        description: "Elimina una orden de trabajo por su ID"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 1,
        description: "ID de la orden de trabajo a eliminar"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<WorkOrder>,
        example: {
            message: "Orden borrada",
            data: new WorkOrderDTO(),
            error: false
        }
    })
    @Delete("borrar/:id")
    async DeleteWorkOrder(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden borrada",
                data: await this.service.DeleteWorkOrder(id),
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