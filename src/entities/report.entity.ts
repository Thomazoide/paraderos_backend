import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fileURL: string;
    @Column()
    userId: number;
    @Column()
    createdAt: string; //ISOString date
    @Column()
    userName: string; //user full name
};