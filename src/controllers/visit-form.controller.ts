import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_AUTH_HEADER_NAME, AuthDocsConfig } from "src/constants/auth-docs-config";
import { VisitForm } from "src/entities/visit-form.entity";
import { VisitFormService } from "src/services/visit-form.service";
import { FileNotAccepted } from "src/types/errors";
import { Base64Pics, Base64PicsDTO, CloseVisitFormPayload, ResponsePayload, ResponsePayloadDTO } from "src/types/types";
import { ParseJSONPipe } from "src/utils/parse-json.pipe";

@ApiTags("formularios de visita")
@Controller("formularios/v1")
export class VisitFormController {
    constructor(
        private readonly service: VisitFormService
    ){};

    @ApiOperation({
        description: "Api para iniciar un formulario de visita de un paradero"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "file",
        description: "Foto del paradero a la hora de iniciar el formulario",
        schema: {
            type: "file",
            format: "binary", 
        }
    })
    @ApiParam({
        name: "payload",
        description: "Objeto \"VisitForm\" stringificado",
        schema: {
            type: "string",
            example: JSON.stringify({
                description: "Comentario de llegada",
                user_id: 0,
                route_id: 0,
                busStop_id: 0
            })
        }
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario iniciado",
            data: new VisitForm(),
            error: false
        }
    })
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
        @Body("payload", ParseJSONPipe)
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

    @ApiOperation({
        description: "Api para cerrar un formulario de visita de un paradero según ID entregado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        description: "ID del formulario a cerrar",
        type: "number",
        example: 0
    })
    @ApiParam({
        name: "file",
        description: "Foto del paradero a la hora de cerrar el formulario",
        schema: {
            type: "file",
            format: "binary", 
        }
    })
    @ApiParam({
        name: "payload",
        description: "Objeto \"VisitForm\" stringificado",
        schema: {
            type: "string",
            example: JSON.stringify({
                description: "Comentario de cierre",
                user_id: 0,
                route_id: 0,
                busStop_id: 0
            })
        }
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario cerrado",
            data: new VisitForm(),
            error: false
        }
    })
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
        },
        @Body("finalComment")
        finalComment: string
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario cerrado",
                data: await this.service.FinishVisitForm(finalComment, file, id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @ApiOperation({
        description: "API para buscar los formularios que estén asociados a una ruta"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 0,
        description: "ID de la ruta"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario encontrado",
            data: new VisitForm(),
            error: false
        }
    })
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

    @ApiOperation({
        description: "API que responde con una lista de todos los formulario de visita existentes"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<VisitForm[]>,
        example: {
            message: "Formularios encontrados",
            data: [
                new VisitForm(),
                "...",
                new VisitForm()
            ],
            error: false
        }
    })
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

    @ApiOperation({
        description: "API para buscar los formularios correspondientes al usuario del ID entregado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 0
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<VisitForm[]>,
        example: {
            message: "Formularios encontrados",
            data: [
                new VisitForm(),
                "...",
                new VisitForm()
            ],
            error: false
        }
    })
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

@ApiTags("formularios de visita")
@Controller("formularios/v2")
export class VisitFormControllerV2 {

    constructor(
        private readonly service: VisitFormService
    ){};

    @ApiOperation({
        description: "API deprecada por falta de servicio de almacenado de archivos en la nube",
        deprecated: true
    })
    @Post("crear")
    async CreateVisitForm(
        @Body()
        data: Partial<VisitForm>
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario creado",
                data: await this.service.CreateVisitFormV2(data),
                error: false
            };
        } catch (err) {
            console.log(err);
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @ApiOperation({
        description: "API deprecada por falta de servicio de almacenado de archivos en la nube",
        deprecated: true
    })
    @Post("cerrar")
    async CloseVisitForm(
        @Body()
        data: CloseVisitFormPayload
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario completado",
                data: await this.service.FinishVisitFormV2(data),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @ApiOperation({
        description: "Busca un formulario según el ID entregado"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 0
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario encontrado",
            data: new VisitForm(),
            error: false
        }
    })
    @Get("find/:id")
    async FindByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario encontrado",
                data: await this.service.FindByID(id),
                error: false
            };
        } catch (err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    };

    @ApiOperation({
        description: "API que entrega las dos fotos correspondientes a un formulario de visita segun el ID entregado, estas son entregadas en BASE64"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number/INT",
        example: 0
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Base64PicsDTO>,
        example: {
            message: "Fotos encontradas",
            data: {
                picBefore: "base64 string",
                picAfter: "base64 string"
            },
            error: false
        }
    })
    @Get("get-pictures/:id")
    async GetBase64Pictures(
        @Param("id", ParseIntPipe)
        formID: number
    ): Promise<ResponsePayload<Base64Pics>> {
        try {
            const result = await this.service.GetBase64Pictures(formID);
            let message = "Fotos encontradas";
            if(result.picAfter === "" && result.picBefore === "") {
                message = "Formulario sin fotos asociadas";
            } 
            return {
                message,
                data: result,
                error: false
            };
        } catch (err) {
            return {
                message: err instanceof Error ? err.message : "Error desconocido",
                error: true
            };
        }
    }
};

@ApiTags("formularios de visita")
@Controller("formluarios/v3")
export class VisitFormControllerV3 {
    constructor(
        private readonly service: VisitFormService
    ){};

    @ApiOperation({
        description: "API para crear un formulario de visita con foto inicial"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "file",
        description: "Foto del paradero al iniciar el formulario",
        schema: {
            type: "file",
            format: "binary"
        }
    })
    @ApiParam({
        name: "payload",
        description: "Objeto VisitForm stringificado",
        schema: {
            type: "string",
            example: JSON.stringify({
                description: "Comentario de llegada",
                user_id: 0,
                route_id: 0,
                busStop_id: 0
            })
        }
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario iniciado",
            data: new VisitForm(),
            error: false
        }
    })
    @Post("crear")
    @UseInterceptors(FileInterceptor("file", {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (_, file, cb) => {
            if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
            return cb(FileNotAccepted, false);
        }
    }))
    async CreateVisitForm(
        @Body("payload", ParseJSONPipe)
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
                data: await this.service.CreateVisitFormV3(file, data),
                error: false
            };
        } catch (e) {
            return {
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    };

    @ApiOperation({
        description: "API para cerrar un formulario de visita con foto final"
    })
    @ApiBearerAuth(API_AUTH_HEADER_NAME)
    @ApiHeader(AuthDocsConfig)
    @ApiParam({
        name: "id",
        type: "number",
        example: 0,
        description: "ID del formulario a cerrar"
    })
    @ApiParam({
        name: "file",
        description: "Foto del paradero al cerrar el formulario",
        schema: {
            type: "file",
            format: "binary"
        }
    })
    @ApiParam({
        name: "finalComment",
        description: "Comentario final del formulario",
        schema: {
            type: "string",
            example: "Comentario de cierre"
        }
    })
    @ApiResponse({
        status: 201,
        type: ResponsePayloadDTO<VisitForm>,
        example: {
            message: "Formulario finalizado",
            data: new VisitForm(),
            error: false
        }
    })
    @Post("cerrar/:id")
    @UseInterceptors(FileInterceptor("file", {
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (_, file, cb) => {
            if(file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
            return cb(FileNotAccepted, false)
        }
    }))
    async FinishVisitForm(
        @Param("id", ParseIntPipe)
        id: number,
        @Body("finalComment")
        finalComment: string,
        @UploadedFile()
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        }
    ): Promise<ResponsePayload<VisitForm>> {
        try {
            return {
                message: "Formulario finalizado",
                data: await this.service.FinishVisitFormV3(finalComment, file, id),
                error: false
            };
        } catch (e) {
            return {
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    };
};