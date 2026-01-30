import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { Departure } from "src/entities/departure.entity";
import { Entry } from "src/entities/entry.entity";
import { Report } from "src/entities/report.entity";
import { Route } from "src/entities/route.entity";
import { User } from "src/entities/user.entity";
import { VisitForm } from "src/entities/visit-form.entity";
import { WorkOrder } from "src/entities/work-order.entity";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mysql",
    port: Number(env.get<string>("DBPORT")),
    host: env.get<string>("DBHOST"),
    database: env.get<string>("DBNAME"),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [BusStop, Departure, Entry, Route, User, VisitForm, WorkOrder, Report],
    synchronize: true
})