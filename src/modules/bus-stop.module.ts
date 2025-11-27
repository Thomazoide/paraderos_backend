import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusStopController } from "src/controllers/bus-stop.controller";
import { BusStop } from "src/entities/bus-stop.entity";
import { BusStopService } from "src/services/bus-stop.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BusStop
        ])
    ],
    controllers: [
        BusStopController
    ],
    providers: [
        BusStopService
    ]
})
export class BusStopModule {};