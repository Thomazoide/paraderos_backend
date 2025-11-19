import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Departure } from "src/entities/departure.entity";
import { CreateRegPayload } from "src/types/types";
import { Repository } from "typeorm";

@Injectable()
export class DepartureService {
    constructor(
        @InjectRepository(Departure)
        private readonly repository: Repository<Departure>
    ){};

    async GetAllDepartures(): Promise<Departure[]> {
            return await this.repository.find({
                relations: [
                    "user",
                    "busStop"
                ]
            });
        };
    
    async SaveDeparture(data: CreateRegPayload<Partial<Departure>>): Promise<Departure> {
        const newDeparture = this.repository.create(data.registro);
        newDeparture.busStop = data.paradero;
        newDeparture.user = data.userData;
        return await this.repository.save(newDeparture);
    };

    async GetDeparturesByUserID(user_id: number): Promise<Departure[]> {
        return await this.repository.find({
            where: {
                user_id
            },
            relations: [
                "busStop"
            ]
        });
    };

    async GetDeparturesByStopID(bus_stop_id: number): Promise<Departure[]> {
        return await this.repository.find({
            where: {
                bus_stop_id
            },
            relations: [
                "user"
            ]
        })
    };
}