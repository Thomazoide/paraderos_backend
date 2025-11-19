import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntryController } from "src/controllers/entry.controller";
import { Entry } from "src/entities/entry.entity";
import { EntryService } from "src/services/entry.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Entry
        ])
    ],
    controllers: [
        EntryController
    ],
    providers: [
        EntryService
    ]
})
export class EntryModule {};