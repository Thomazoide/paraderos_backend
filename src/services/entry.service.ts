import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry } from "src/entities/entry.entity";
import { CreateRegPayload } from "src/types/types";
import { Repository } from "typeorm";

@Injectable()
export class EntryService {
    constructor(
        @InjectRepository(Entry)
        private readonly repo: Repository<Entry>
    ){};

    async GetAllEntries(): Promise<Entry[]> {
        return await this.repo.find({
            relations: [
                "user",
                "busStop"
            ]
        });
    };

    async SaveEntry(data: CreateRegPayload<Partial<Entry>>): Promise<Entry> {
        const newEntry = this.repo.create(data.registro);
        newEntry.busStop = data.paradero;
        newEntry.user = data.userData;
        return await this.repo.save(newEntry);
    };

    async GetEntriesByUserID(user_id: number): Promise<Entry[]> {
        return await this.repo.find({
            where: {
                user_id
            },
            relations: [
                "busStop"
            ]
        });
    };

    async GetEntriesByStopID(bus_stop_id: number): Promise<Entry[]> {
        return await this.repo.find({
            where: {
                bus_stop_id
            },
            relations: [
                "user"
            ]
        })
    };
};