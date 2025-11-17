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
                ""
            ]
        });
    };

    async SaveEntry(data: CreateRegPayload<Partial<Entry>>): Promise<Entry> {
        return await this.repo.save(data.registro);
    }
};