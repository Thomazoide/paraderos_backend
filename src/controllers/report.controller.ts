import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Report } from "src/entities/report.entity";
import { ReportService } from "src/services/report.service";
import { ResponsePayload, sinceDate } from "src/types/types";

@Controller("reportes/v1")
export class ReportController {
    constructor(
        private readonly service: ReportService
    ){};
    @Get("generar/:sinceDate/:userID")
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
                message: e instanceof Error ? e.message : "Error al crear/leer archivo",
                error: true
            };
        }
    }

    @Get()
    async GetAllReports(): Promise<ResponsePayload<Report[]>> {
        try {
            return {
                message: "Reportes encontrados",
                error: false,
                data: await this.service.GetReports()
            };
        } catch (e) {
            return {
                message: (e instanceof Error ? e.message : "Error desconocido"),
                error: true
            };
        }
    }

    @Post("descargar")
    async DownloadReport(
        @Body()
        body: {
            fileURL: string;
        }
    ): Promise<ResponsePayload<string>> {
        try {
            return {
                message: "Reporte",
                data: await this.service.GetReportBase64(body.fileURL),
                error: false
            };
        } catch (e) {
            return {
                message: (e instanceof Error ? e.message : "Error desconocido"),
                error : true
            };
        }
    }

    @Delete("eliminar/:id")
    async DeleteReport(
        @Param("id", ParseIntPipe)
        reportID: number
    ): Promise<ResponsePayload<boolean>> {
        try {
            await this.service.DeleteReport(reportID);
            return {
                message: `Reporte #${reportID} eliminado con éxito`,
                data: true,
                error: false
            };
        } catch (e) {
            return {
                message: e instanceof Error ? e.message : "Error desconocido",
                data: false,
                error: true
            };
        }
    }
};