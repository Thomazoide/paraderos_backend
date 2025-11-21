import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controllers/user.controller";
import { User } from "src/entities/user.entity";
import { UserService } from "src/services/user.service";
import { GpsSocket } from "src/sockets/gps.socket";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User
        ])
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        GpsSocket
    ]
})
export class UserModule {};