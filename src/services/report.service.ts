import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { Report } from "src/entities/report.entity";
import { Route } from "src/entities/route.entity";
import { User } from "src/entities/user.entity";
import { VisitForm } from "src/entities/visit-form.entity";
import { WorkOrder } from "src/entities/work-order.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(BusStop)
        private readonly busStopRepository: Repository<BusStop>,
        @InjectRepository(Route)
        private readonly routeRepository: Repository<Route>,
        @InjectRepository(VisitForm)
        private readonly visitFormRepository: Repository<VisitForm>,
        @InjectRepository(WorkOrder)
        private readonly workOrderRepository: Repository<WorkOrder>,
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>
    ){}


};