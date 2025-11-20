import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { WorkOrder } from "src/entities/work-order.entity";
import { WorkOrderService } from "src/services/work-order.service";
import { ResponsePayload } from "src/types/types";

@Controller("ordenes/v1")
export class WorkOrderController {
    constructor(
        private readonly service: WorkOrderService
    ){};

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

    @Post()
    async SaveOrder(
        @Body()
        newOrder: Partial<WorkOrder>
    ): Promise<ResponsePayload<WorkOrder>> {
        try {
            return {
                message: "orden creada",
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