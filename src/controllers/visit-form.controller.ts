import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VisitForm } from "src/entities/visit-form.entity";
import { VisitFormService } from "src/services/visit-form.service";
import { FileNotAccepted } from "src/types/errors";
import { ResponsePayload } from "src/types/types";

@Controller("formularios")
export class VisitFormController {
    constructor(
        private readonly service: VisitFormService
    ){};

    @Post("crear")
    @UseInterceptors(FileInterceptor("file", {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (_, file, cb) => {
            if(file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
            return cb(FileNotAccepted, false);
        }
    }))
    async CreateVisitForm(
        @Body()
        data: Partial<VisitForm>,
        @UploadedFile()
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        }
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario iniciado",
                data: await this.service.CreateVisitForm(data, file),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Post("cerrar/:id")
    @UseInterceptors(FileInterceptor("file", {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (_, file, cb) => {
            if(file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
            return cb(FileNotAccepted, false);
        }
    }))
    async FinishVisitForm(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFile()
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        }
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario cerrado",
                data: await this.service.FinishVisitForm(file, id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Get("ruta/:id")
    async FindByRouteID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<VisitForm[]>> {
        try {
            return {
                message: `Formularios de la ruta #${id}`,
                data: await this.service.FindByRouteID(id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Get()
    async FindAll(): Promise<ResponsePayload<VisitForm[]>> {
        try {
            return {
                message: "Todos los formularios existentes",
                data: await this.service.GetAllVisitForms(),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @Get("usuario/:id")
    async FindByUserID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<VisitForm[]>> {
        try {
            return {
                message: `Formularios creados por el usuario #${id}`,
                data: await this.service.GetByUserID(id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };
};