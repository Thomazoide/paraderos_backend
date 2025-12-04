import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Route } from "src/entities/route.entity";
import { Repository } from "typeorm";

@Injectable()
export class RouteService {
    constructor(
        @InjectRepository(Route)
        private readonly repository: Repository<Route>
    ){};

    async GetAllRoutes(): Promise<Route[]> {
        return await this.repository.find({
            relations: [
                "visitForms"
            ]
        });
    };

    async SaveRoute(newRoute: Partial<Route>): Promise<Route> {
        return await this.repository.save(newRoute);
    };

    async FindByID(id: number): Promise<Route> {
        return await this.repository.findOne({
            where: {
                id
            },
            relations: [
                "visitForms"
            ]
        });
    };

};