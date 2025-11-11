import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { Repository } from "typeorm";

@Injectable()
export class BusStopService {
    constructor(
        @InjectRepository(BusStop)
        private readonly repo: Repository<BusStop>
    ){};

    async SaveBusStop(data: Partial<BusStop>): Promise<BusStop> {
        return data as BusStop;
    }
};