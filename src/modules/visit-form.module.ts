import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitFormController } from "src/controllers/visit-form.controller";
import { VisitForm } from "src/entities/visit-form.entity";
import { VisitFormService } from "src/services/visit-form.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VisitForm
        ])
    ],
    controllers: [
        VisitFormController
    ],
    providers: [
        VisitFormService
    ]
})
export class VisitFormModule {};