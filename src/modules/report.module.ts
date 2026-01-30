import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "src/controllers/report.controller";
import { BusStop } from "src/entities/bus-stop.entity";
import { Report } from "src/entities/report.entity";
import { Route } from "src/entities/route.entity";
import { User } from "src/entities/user.entity";
import { VisitForm } from "src/entities/visit-form.entity";
import { WorkOrder } from "src/entities/work-order.entity";
import { ReportService } from "src/services/report.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BusStop,
            Report,
            Route,
            User,
            VisitForm,
            WorkOrder
        ])
    ],
    controllers: [
        ReportController
    ],
    providers: [
        ReportService
    ]
})
export class ReportModule {};