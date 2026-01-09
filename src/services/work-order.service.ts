import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkOrder } from "src/entities/work-order.entity";
import { AlreadyVisitedBusStop, EntityNotFoundError } from "src/types/errors";
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
                "user_final",
                "forms"
            ]
        });
    };

    async SaveOrder(newWorkOrder: Partial<WorkOrder>): Promise<WorkOrder> {
        newWorkOrder.stops_visited = [];
        return await this.repository.save(newWorkOrder);
    };

    async FindByID(id: number): Promise<WorkOrder> {
        return await this.repository.findOne({
            where: {
                id
            },
            relations: [
                "route",
                "user_final",
                "forms"
            ]
        });
    };

    async FindByRouteID(route_id: number): Promise<WorkOrder> {
        return this.repository.findOne({
            where: {
                route_id
            },
            relations: [
                "user_final",
                "forms"
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
    };

    async AddVisitedStopID(updateData: {
        workOrder: WorkOrder;
        busStopID: number;
    }): Promise<WorkOrder> {
        const exist = await this.repository.findOne({
            where: {
                id: updateData.workOrder.id
            },
            relations: [
                "route",
            ]
        });
        if(!exist) throw EntityNotFoundError;
        const idSet = new Set(Array.from(exist.stops_visited));
        if(idSet.has(updateData.busStopID)) throw AlreadyVisitedBusStop;
        exist.stops_visited.push(updateData.busStopID);
        if(this.checkCompletion(exist.route.route_points, exist.stops_visited)) {
            exist.complete_date = new Date().toISOString();
            exist.completada = true;
        }
        return await this.repository.save(exist);
    }

    private checkCompletion(routeArray: number[], visitedArray: number[]): boolean {
        const routeSet = new Set(routeArray);
        const visitedSet = new Set(visitedArray);
        if(routeSet.size !== visitedSet.size) return false;
        for(const id of visitedSet) {
            if(!routeSet.has(id)) return false;
        }
        return true;
    }

};