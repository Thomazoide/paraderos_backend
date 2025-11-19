import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkOrder } from "src/entities/work-order.entity";
import { EntityNotFoundError } from "src/types/errors";
import { Repository } from "typeorm";

@Injectable()
export class WorkOrderService {
    constructor(
        @InjectRepository(WorkOrder)
        private readonly repository: Repository<WorkOrder>
    ){};

    async GetAllOrders(): Promise<WorkOrder[]> {
        return await this.repository.find({
            relations: [
                "route",
                "user_final"
            ]
        });
    };

    async SaveOrder(newWorkOrder: Partial<WorkOrder>): Promise<WorkOrder> {
        return await this.repository.save(newWorkOrder);
    };

    async FindByID(id: number): Promise<WorkOrder> {
        return await this.repository.findOne({
            where: {
                id
            },
            relations: [
                "route",
                "user_final"
            ]
        });
    };

    async FindByRouteID(route_id: number): Promise<WorkOrder> {
        return this.repository.findOne({
            where: {
                route_id
            },
            relations: [
                "user_final"
            ]
        });
    };

    async DeleteWorkOrder(id: number): Promise<WorkOrder> {
        const wo = await this.repository.findOne({
            where: {
                id
            }
        });
        if(!wo) throw EntityNotFoundError;
        return await this.repository.remove(wo);
    }

};