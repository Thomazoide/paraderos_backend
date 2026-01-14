import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseJSONPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) throw new BadRequestException("Sin datos para el formulario");
        try {
            return JSON.parse(value)
        } catch (error) {
            throw new BadRequestException(`${metadata.data} debe ser un string JSON valido. Detalles ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}