import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { ApiNotForPasswordChange, EntityNotFoundError, IncorrectPasswordError } from "src/types/errors";
import { UpdatePasswordPayload, UpdatePositionPayload } from "src/types/types";
import { Encrypter } from "src/utils/encrypter";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    private encrypter: Encrypter;
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        private readonly env: ConfigService
    ){
        this.encrypter = new Encrypter(this.env.get<string>("SECRET"), this.env.get<string>("PEPPER"));
    };

    private CreateBase(fullName: string): string {
        if(!fullName) return "";
        const parts = fullName.trim().split(/\s+/);
        const first = parts[0];
        const last = parts[parts.length - 1];
        const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const base = normalize(first.charAt(0) + last);
        return base;
    };

    private async CreateUsername(fullName: string): Promise<string> {
        const base = this.CreateBase(fullName);
        if(!base) return "";
        const existing = await this.repository
            .createQueryBuilder("user")
            .where("user.username LIKE :u", {u: `${base}%`})
            .select("user.username")
            .getMany();
        if(existing.length === 0) return base;
        const taken = new Set(existing.map( u => (u.username) ));
        if(!taken.has(base)) return base;
        let i = 1;
        while(taken.has(`${base}${i}`)) i++;
        return `${base}${i}`
    };

    async CreateUserV2(data: Partial<User>): Promise<User> {
        const newUser = data;
        newUser.username = await this.CreateUsername(data.full_name);
        newUser.password = this.encrypter.EncryptPasswordV2(data.password);
        return await this.repository.save(newUser);
    }

    //Obsoleto
    async CreateUser(data: Partial<User>): Promise<User> {
        const newUser = data;
        newUser.username = await this.CreateUsername(data.full_name);
        newUser.password = this.encrypter.EncryptPassword(data.password);
        return await this.repository.save(newUser);
    };

    async GetAllUsers(): Promise<User[]> {
        return await this.repository.find({
            select: ["id", "full_name", "email", "username", "user_type", "lat", "lng", "lastUpdated"]
        });
    };

    async UpdateUser(data: Partial<User>): Promise<User> {
        if(data.password) throw ApiNotForPasswordChange;
        const user = await this.repository.findOne({
            where: {
                id: data.id
            }
        });
        if(!user) throw EntityNotFoundError;
        const updatedUser = data;
        updatedUser.password = user.password;
        return await this.repository.save(updatedUser);
    };

    //Obsoleto
    async UpdatePassword(payload: UpdatePasswordPayload): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id: payload.id
            }
        });
        if(!user) throw EntityNotFoundError;
        if(!this.encrypter.VerifyPassword(payload.oldPassword, user.password)) throw IncorrectPasswordError;
        user.password = this.encrypter.EncryptPassword(payload.newPassword);
        return await this.repository.save(user);
    };

    async UpdatePasswordV2(payload: UpdatePasswordPayload): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id: payload.id
            }
        });
        if(!user) throw EntityNotFoundError;
        if(!this.encrypter.VerifyPasswordV2(payload.oldPassword, user.password)) throw IncorrectPasswordError;
        user.password = this.encrypter.EncryptPasswordV2(payload.newPassword);
        return await this.repository.save(user);
    };

    async DeleteUser(id: number): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id
            }
        });
        if(!user) throw EntityNotFoundError;
        return this.repository.remove(user);
    };

    async GetUserByID(id: number): Promise<User> {
        return await this.repository.findOne({
            where: {
                id
            }
        });
    };

    async UpdatePosition(payload: UpdatePositionPayload): Promise<User> {
        const user = await this.repository.findOne({
            where: {
                id: payload.id
            }
        });
        if(!user) throw EntityNotFoundError;
        user.lat = payload.lat;
        user.lng = payload.lng;
        user.lastUpdated = payload.timestamp;
        return await this.repository.save(user);
    };
};