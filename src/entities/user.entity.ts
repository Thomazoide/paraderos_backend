import { UserType } from "src/types/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";
import { VisitForm } from "./visit-form.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity()
export class User {
    @ApiPropertyOptional()
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty()
    @Column()
    full_name: string;
    @ApiProperty()
    @Column()
    email: string;
    @ApiProperty()
    @Column()
    username: string;
    @ApiProperty()
    @Column()
    password: string
    @ApiProperty()
    @Column()
    user_type: UserType;
    @ApiPropertyOptional()
    @Column({type: "double precision", nullable: true, default: null})
    lat: number | null;
    @ApiPropertyOptional()
    @Column({type: "double precision", nullable: true, default: null})
    lng: number | null;
    @ApiPropertyOptional({example: new Date().toISOString()})
    @Column({name: "last_updated", nullable: true, default: null})
    lastUpdated: string | null;
    @OneToMany( () => Entry, entry => entry.user, {nullable: true} )
    entries: Entry[] | null;
    @OneToMany( () => Departure, dep => dep.user, {nullable: true} )
    departures: Departure[] | null;
    @OneToMany( () => WorkOrder, wo => wo.user_final, {nullable: true} )
    work_orders: WorkOrder[] | null;
    @OneToMany( () => VisitForm, vf => vf.user )
    visitForms: VisitForm[];
};