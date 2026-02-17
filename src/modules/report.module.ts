import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController, ReportControllerV2 } from "src/controllers/report.controller";
import { Report } from "src/entities/report.entity";
import { User } from "src/entities/user.entity";
import { VisitForm } from "src/entities/visit-form.entity";
import { WorkOrder } from "src/entities/work-order.entity";
import { ReportService } from "src/services/report.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Report,
            User,
            VisitForm,
            WorkOrder
        ])
    ],
    controllers: [
        ReportController,
        ReportControllerV2
    ],
    providers: [
        ReportService
    ]
})
export class ReportModule {};