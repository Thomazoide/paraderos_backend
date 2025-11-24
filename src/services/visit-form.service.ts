import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { VisitForm } from "src/entities/visit-form.entity";
import { AmazonBucketNameNotFound, EntityNotFoundError } from "src/types/errors";
import { Repository } from "typeorm";
import { extension as getExtension } from "mime-types";
import { randomUUID } from "crypto";

@Injectable()
export class VisitFormService {
    private s3: S3Client;
    private bucket: string;
    private publicBaseURL: string;
    private region: string;
    constructor(
        @InjectRepository(VisitForm)
        private readonly repository: Repository<VisitForm>,
        private readonly env: ConfigService
    ){
        this.region = this.env.get<string>("AWS_REGION");
        this.bucket = this.env.get<string>("BUCKET_NAME");
        this.publicBaseURL = this.env.get<string>("S3_PUBLIC_BASE_URL") || (this.bucket && this.region ? `https://${this.bucket}.s3.${this.region}.amazonaws.com` : "");
        this.s3 = new S3Client({
            region: this.region
        });
    };

    async CreateVisitForm(
        data: Partial<VisitForm>,
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        }
    ): Promise<VisitForm> {
        const picURL = await this.UploadMulterFileToS3(file, data.busStopId, data.routeId);
        const newVisitForm = this.repository.create({
            ...data,
            picBeforeURL: picURL ?? null
        });
        return await this.repository.save(newVisitForm);
    };

    async FinishVisitForm(
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
        const picURL = await this.UploadMulterFileToS3(file, visitForm.busStopId, visitForm.routeId);
        visitForm.picAfterURL = picURL;
        visitForm.completed = true;
        return await this.repository.save(visitForm);
    }

    private async UploadMulterFileToS3(
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string;
        },
        busStopId?: number,
        routeId?: number
    ): Promise<string> {
        if(!this.bucket) throw AmazonBucketNameNotFound;
        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() || "bin");
        const key = `visit-forms/parada-${busStopId ?? "parada-desconocida"}/ruta-${routeId ?? "ruta-desconocida"}/${randomUUID()}.${ext}`;
        const putParams: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: mimeType
        };
        const acl = this.env.get("S3_OBJECT_ACL") as PutObjectCommandInput["ACL"] | undefined;
        if(acl) putParams.ACL = acl;
        await this.s3.send(new PutObjectCommand(putParams));
        return this.publicBaseURL
            ? `${this.publicBaseURL}/${key}`
            : `https://${this.bucket}.s3.amazonaws.com/${key}`;
    };
};