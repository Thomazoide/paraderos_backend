import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { Report } from "src/entities/report.entity";
import { ReportService } from "src/services/report.service";
import { ResponsePayload, sinceDate, ResponsePayloadDTO } from "src/types/types";

@ApiTags("reportes")
@Controller("reportes/v1")
export class ReportController {
    constructor(
        private readonly service: ReportService
    ){};
    @ApiOperation({
        description: "Genera una solicitud para reporte, luego de verificar que los parametros entregados son válidos, devuelve el reporte solicitado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "sinceDate",
        description: "Define que tipo de reporte se debe generar, diario, semanal o mensual. Si el valor entregado no corresponse a uno de los ejemplos, se rechazará el informe.",
        examples: {
            diario: {
                value: "day"
            },
            semanal: {
                value: "week"
            },
            mensual: {
                value: "month"
            }
        }
    })
    @ApiParam({
        name: "userID", 
        example: 1, 
        description: "ID del usuario que solicita el informe"
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<Report>
    })
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

    @ApiOperation({
        description: "Entrega una lista de los reportes existentes"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Report>
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
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

    @ApiOperation({
        description: "Envía el archivo solicitado en Base64"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<string>
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
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

    @ApiOperation({
        description: "Se elimina el objeto \"Report\" de la base de datos segun el ID entregado"
    })
    @ApiParam({
        name: "id",
        example: 0
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
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