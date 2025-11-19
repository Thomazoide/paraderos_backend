import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartureController } from "src/controllers/departure.controller";
import { Departure } from "src/entities/departure.entity";
import { DepartureService } from "src/services/departure.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Departure
        ])
    ],
    controllers: [
        DepartureController
    ],
    providers: [
        DepartureService
    ]
})
export class DepartureModule {};