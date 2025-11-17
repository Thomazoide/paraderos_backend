import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { EntityNotFoundError } from "src/types/errors";
import { Repository } from "typeorm";

@Injectable()
export class BusStopService {
    constructor(
        @InjectRepository(BusStop)
        private readonly repo: Repository<BusStop>
    ){};

    async SaveBusStop(data: Partial<BusStop>): Promise<BusStop> {
        return await this.repo.save(data);
    };

    async GetBusStops(): Promise<BusStop[]> {
        return await this.repo.find({
            relations: [
                "visitForms"
            ]
        });
    };

    async FindOneBusStop(index: string | number): Promise<BusStop> {
        const str = "";
        const num = 0;
        if( typeof(index) === typeof(str) ) {
            const exists = await this.repo.findOne({
                where: {
                    codigo: (index as string)
                },
                relations: [
                    "visitForms"
                ]
            });
            if(!exists) throw EntityNotFoundError;
            return await this.repo.remove(exists);
        }
        if( typeof(index) === typeof(num) ) {
            const exists = await this.repo.findOne({
                where: {
                    id: (index as number)
                },
                relations: [
                    "visitForms"
                ]
            });
            if(!exists) throw EntityNotFoundError;
            return await this.repo.remove(exists);
        }
    };

    async DeleteBusStop(index: number | string): Promise<BusStop> {
        const str = "";
        const num = 0;
        if( typeof(index) === typeof(str) ) {
            const exists = await this.repo.findOneBy({
                codigo: (index as string)
            });
            if(!exists) throw EntityNotFoundError;
            return await this.repo.remove(exists);
        }
        if( typeof(index) === typeof(num) ) {
            const exists = await this.repo.findOneBy({
                id: (index as number)
            });
            if(!exists) throw EntityNotFoundError;
            return await this.repo.remove(exists);
        }
    }
};