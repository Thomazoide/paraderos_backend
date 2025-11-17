import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { BusStopService } from "src/services/bus-stop.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BusStop
        ])
    ],
    controllers: [
        BusStopModule
    ],
    providers: [
        BusStopService
    ]
})
export class BusStopModule {};