import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RouteController } from "src/controllers/route.controller";
import { Route } from "src/entities/route.entity";
import { RouteService } from "src/services/route.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Route
        ])
    ],
    controllers: [
        RouteController
    ],
    providers: [
        RouteService
    ]
})
export class RouteModule {};