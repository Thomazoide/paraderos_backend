import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Report } from "src/entities/report.entity";
import { ReportService } from "src/services/report.service";
import { ResponsePayload, sinceDate } from "src/types/types";

@Controller("reportes/v1")
export class ReportController {
    constructor(
        private readonly service: ReportService
    ){};
    @Get(":sinceDate/:userID")
    async GenerateReport(
        @Param("sinceDate")
        sinceDate: sinceDate,
        @Param("userID", ParseIntPipe)
        userID: number
    ): Promise<ResponsePayload<{
        reportEntity: Report;
        reportFile: string;
    }>> {
        try {
            const reportEntity = await this.service.GenerateReport(sinceDate, userID);
            const fileString = await this.service.GetReportBase64(reportEntity.fileURL);
            return {
                message: "Reporte creado",
                error: false,
                data: {
                    reportEntity: reportEntity,
                    reportFile: fileString
                }
            };
        } catch (e) {
            return {
                message: "Error al crear/leer archivo",
                error: true
            };
        }
    }
};