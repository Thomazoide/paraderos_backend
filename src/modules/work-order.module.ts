import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkOrderController } from "src/controllers/work-order.controller";
import { WorkOrder } from "src/entities/work-order.entity";
import { WorkOrderService } from "src/services/work-order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkOrder
        ])
    ],
    controllers: [
        WorkOrderController
    ],
    providers: [
        WorkOrderService
    ]
})
export class WorkOrderModule {};