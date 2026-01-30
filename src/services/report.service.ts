import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusStop } from "src/entities/bus-stop.entity";
import { Report } from "src/entities/report.entity";
import { Route } from "src/entities/route.entity";
import { User } from "src/entities/user.entity";
import { VisitForm } from "src/entities/visit-form.entity";
import { WorkOrder } from "src/entities/work-order.entity";
import { MoreThanOrEqual, Repository } from "typeorm";
import { promises as fs } from "fs";
import * as path from "path";
import { EntityNotFoundError } from "src/types/errors";
import { sinceDate } from "src/types/types";

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

    private generateCsv(data: any): string {
        const lines = [
            "REPORTE DE ESTADÍSTICAS",
            `Período: ${data.period}`,
            `Generado: ${data.generatedAt}`,
            "",
            "FORMULARIOS DE VISITA",
            "Métrica,Valor",
            `Formularios Creados,${data.visitForms.created}`,
            `Formularios Completados,${data.visitForms.completed}`,
            `Tiempo Promedio Completación (minutos),${data.visitForms.avgTimeMinutes}`,
            "",
            "ÓRDENES DE TRABAJO",
            "Métrica,Valor",
            `Órdenes Creadas,${data.workOrders.created}`,
            `Órdenes Completadas,${data.workOrders.completed}`,
            `Órdenes Pendientes,${data.workOrders.pending}`,
            `Ratio Completadas/Creadas,${data.workOrders.completionRatio}`,
            `Tiempo Promedio Completación (horas),${data.workOrders.avgTimeHours}`
        ];
        return lines.join("\r\n");
    };

    async GetReports(): Promise<Report[]> {
        return await this.reportRepository.find();
    };

    async GenerateReport(since: sinceDate, userID: number): Promise<Report> {
        const user = await this.userRepository.findOne({
            where: {
                id: userID
            }
        });
        if(!user) throw EntityNotFoundError;
        const now = new Date();
        let sinceDate: Date;
        if(since === "day") {
            sinceDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if(since === "week") {
            sinceDate = new Date(now);
            sinceDate.setDate(now.getDate() - 7);
        } else {
            sinceDate = new Date(now);
            sinceDate.setMonth(now.getMonth() - 1);
        }
        // estadisticas formularios de visita
        const visitFormsCreated = await this.visitFormRepository.count({
            where: { creation_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });
        
        const visitFormsCompleted = await this.visitFormRepository.count({
            where: { completed: true, completion_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });

        // promedio de completación de formularios
        const completedForms = await this.visitFormRepository.find({
            where: { completed: true, completion_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });
        
        let avgTimeToComplete = 0;
        if(completedForms.length > 0) {
            const totalTime = completedForms.reduce((acc, form) => {
                const createdAt = new Date(form.creation_date).getTime();
                const completedAt = new Date(form.completion_date).getTime();
                return acc + (completedAt - createdAt);
            }, 0);
            avgTimeToComplete = Math.round(totalTime / completedForms.length / 1000 / 60); // en minutos
        }
        // estadisticas de OTs
        const workOrdersCreated = await this.workOrderRepository.count({
            where: { creation_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });

        const workOrdersCompleted = await this.workOrderRepository.count({
            where: { completada: true, complete_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });

        const workOrdersPending = await this.workOrderRepository.count({
            where: { completada: false, creation_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });
        // OTs completadas vs creadas
        const workOrderRatio = workOrdersCreated > 0 
            ? (workOrdersCompleted / workOrdersCreated * 100).toFixed(2)
            : "0";
        // promedio completacion de de OTs
        const completedWorkOrders = await this.workOrderRepository.find({
            where: { completada: true, complete_date: MoreThanOrEqual(sinceDate.toISOString()) } as any
        });

        let avgTimeWorkOrder = 0;
        if(completedWorkOrders.length > 0) {
            const totalTime = completedWorkOrders.reduce((acc, wo) => {
                const createdAt = new Date(wo.creation_date).getTime();
                const completedAt = new Date(wo.complete_date).getTime();
                return acc + (completedAt - createdAt);
            }, 0);
            avgTimeWorkOrder = Math.round(totalTime / completedWorkOrders.length / 1000 / 60 / 60); // en horas
        }
        // generacion de CSV
        const csv = this.generateCsv({
            period: since,
            generatedAt: now.toISOString(),
            visitForms: {
                created: visitFormsCreated,
                completed: visitFormsCompleted,
                avgTimeMinutes: avgTimeToComplete
            },
            workOrders: {
                created: workOrdersCreated,
                completed: workOrdersCompleted,
                pending: workOrdersPending,
                completionRatio: `${workOrderRatio}%`,
                avgTimeHours: avgTimeWorkOrder
            }
        });
        const reportsDir = path.join(process.cwd(), "reports");
        await fs.mkdir(reportsDir, { recursive: true });
        const filename = `report-${since}-${now.toISOString().replace(/[:.]/g, "-")}.csv`;
        const filepath = path.join(reportsDir, filename);
        await fs.writeFile(filepath, csv, "utf8");

        // Guardar entidad Report
        const report: Partial<Report> = {
            fileURL: filepath,
            createdAt: new Date().toISOString(),
            userId: user.id,
            userName: user.username
        };
        
        return await this.reportRepository.save(report);
    }

    async GetReportBase64(filePath: string): Promise<string> {
        const fileBuffer = await fs.readFile(filePath);
        return fileBuffer.toString("base64");
    }

};