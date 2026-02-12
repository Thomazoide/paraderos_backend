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

export class ReportDTO {
    constructor(){
        this.id = 0;
        this.fileURL = "/file/uri/to/object";
        this.userId = 0;
        this.userName = "user name";
        this.reportType = "month";
    }
    @ApiProperty()
    id: number;
    @ApiProperty()
    fileURL: string;
    @ApiProperty()
    userId: number;
    @ApiProperty()
    userName: string;
    @ApiProperty()
    reportType: string;
}