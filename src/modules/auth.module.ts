import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { User } from "src/entities/user.entity";
import { JwtStrategy } from "src/guards/passport-strategy.service";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User
        ]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [
                ConfigModule
            ],
            useFactory: async (env: ConfigService) => ({
                secret: env.get<string>("SECRET"),
                signOptions: {
                    algorithm: "HS256",
                    expiresIn: "3h"
                }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy
    ]
})
export class AuthModule {};