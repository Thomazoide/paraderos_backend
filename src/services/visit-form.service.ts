import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VisitForm } from "src/entities/visit-form.entity";
import { EntityNotFoundError } from "src/types/errors";
import { Repository } from "typeorm";
import { extension as getExtension } from "mime-types";
import { randomUUID } from "crypto";
import { Base64Pics, CloseVisitFormPayload } from "src/types/types";
import * as fs from "fs";
import { join, sep } from "path";

@Injectable()
export class VisitFormService {
    constructor(
        @InjectRepository(VisitForm)
        private readonly repository: Repository<VisitForm>,
    ){};

    async CreateVisitFormV2(
        data: Partial<VisitForm>
    ): Promise<VisitForm> {
        const aux = data;
        aux.picBeforeURL = "";
        return await this.repository.save(aux);
    };

    async FinishVisitFormV2(
        data: CloseVisitFormPayload
    ): Promise<VisitForm> {
        const visitForm = await this.repository.findOne({
            where: {
                id: data.id
            }
        });
        if(!visitForm) throw EntityNotFoundError;
        visitForm.picAfterURL = "";
        const fullComment = `Comentario de llegada:\n${visitForm.description}\nComentario de cierre:\n${data.commentP2}`;
        visitForm.description = fullComment;
        visitForm.completed = true;
        visitForm.completion_date = new Date().toISOString();
        return await this.repository.save(visitForm);
    };

    async CreateVisitForm(
        data: Partial<VisitForm>,
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        }
    ): Promise<VisitForm> {
        const picURL = await this.SaveMulterFileLocally(file, data.busStopId, data.routeId);
        const newVisitForm = this.repository.create({
            ...data,
            picBeforeURL: picURL ?? null
        });
        return await this.repository.save(newVisitForm);
    };

    async FinishVisitForm(
        finalComment: string,
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        },
        id: number
    ): Promise<VisitForm> {
        const visitForm = await this.repository.findOne({
            where: {id}
        });
        if(!visitForm) throw EntityNotFoundError;
        const picURL = await this.SaveMulterFileLocally(file, visitForm.busStopId, visitForm.routeId);
        visitForm.picAfterURL = picURL;
        visitForm.description = "Comentario inicial:\n" + visitForm.description + "\n" + "Comentario final:\n" + finalComment;
        visitForm.completed = true;
        visitForm.completion_date = new Date().toISOString();
        return await this.repository.save(visitForm);
    };

    async FindByRouteID(id: number): Promise<VisitForm[]> {
        return await this.repository.find({
            where: {id}
        });
    };

    async GetAllVisitForms(): Promise<VisitForm[]> {
        return await this.repository.find({
            relations: [
                "route",
                "busStop",
                "user"
            ]
        });
    };

    async GetByUserID(userId: number): Promise<VisitForm[]> {
        return await this.repository.find({
            where: {userId},
            relations: [
                "busStop",
                "route",
                "user"
            ]
        });
    };

    async FindByID(id: number): Promise<VisitForm> {
        return await this.repository.findOne({
            where: {
                id
            },
            relations: [
                "busStop"
            ]
        });
    };

    async GetBase64Pictures(formID: number): Promise<Base64Pics> {
        const form = await this.repository.findOne({
            where: {
                id: formID
            }
        });
        if(!form) throw EntityNotFoundError;
        const uploadsRoot = process.cwd();
        const picBeforePath = form.picBeforeURL
            ? join(uploadsRoot, form.picBeforeURL)
            : null;
        const picAfterPath = form.picAfterURL
            ? join(uploadsRoot, form.picAfterURL)
            : null;
        let picBeforeBase64 = "";
        let picAfterBase64 = "";
        if(picBeforePath && fs.existsSync(picBeforePath)) {
            const buffer = await fs.promises.readFile(picBeforePath);
            picBeforeBase64 = buffer.toString("base64");
        }
        if(picAfterPath && fs.existsSync(picAfterPath)) {
            const buffer = fs.readFileSync(picAfterPath);
            picAfterBase64 = buffer.toString("base64");
        }
        return {
            picBefore: picBeforeBase64,
            picAfter: picAfterBase64
        };
    }

    private async SaveMulterFileLocally(
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        },
        busStopId?: number,
        routeId?: number
    ): Promise<string> {
        if(!file?.buffer) return "";
        const uploadsRoot = join(process.cwd(), "uploads");
        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() || "bin");
        const key = `visit-forms/parada-${busStopId ?? "parada-desconocida"}/${randomUUID()}.${ext}`;
        const absDir = join(uploadsRoot, `visit-forms/parada-${busStopId ?? "parada-desconocida"}/ruta-${routeId ?? "ruta-desconocida"}`);
        fs.mkdirSync(absDir, { recursive: true });
        const absPath = join(uploadsRoot, key);
        await fs.promises.writeFile(absPath, file.buffer);
        // Return a URL-like path for later static serving (e.g., via ServeStaticModule)
        const relPath = absPath.replace(uploadsRoot, "").split(sep).join("/");
        return `/uploads${relPath}`;
    };
};