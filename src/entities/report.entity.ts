import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @ApiPropertyOptional()
    @PrimaryGeneratedColumn()
    id: number;
    @ApiPropertyOptional()
    @Column()
    fileURL: string;
    @ApiProperty()
    @Column()
    userId: number;
    @Column()
    createdAt: string; //ISOString date
    @ApiProperty()
    @Column()
    userName: string; //user full name
    @ApiPropertyOptional()
    @Column()
    reportType: string;
};