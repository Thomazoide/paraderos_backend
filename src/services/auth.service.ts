import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { LoginPayload } from "src/types/types";
import { EntityNotFoundError, IncorrectPasswordError } from "src/types/errors";
import { Encrypter } from "src/utils/encrypter";

@Injectable()
export class AuthService {
    private encrypter: Encrypter;
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        private readonly env: ConfigService
    ){
        this.encrypter = new Encrypter(this.env.get<string>("SECRET"), this.env.get<string>("PEPPER"));
    };

    async Login(payload: LoginPayload): Promise<string> {
        const user = await this.repository.findOne({
            where: {
                username: payload.username
            }
        });
        if(!user) throw EntityNotFoundError;
        if(!this.encrypter.VerifyPassword(payload.password, user.password)) throw IncorrectPasswordError;
        const userData: Partial<User> = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            username: user.username,
            user_type: user.user_type
        };
        return this.encrypter.CreateJWT(userData);
    };

    async VerifyToken(token: string): Promise<boolean> {
        return this.encrypter.VerifyJWT(token);
    }
};