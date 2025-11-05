import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mariadb",
    port: Number(env.get<string>("DBPORT")),
    host: env.get<string>("DBHOST"),
    database: env.get<string>("DBNAME"),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [],
    synchronize: true
})