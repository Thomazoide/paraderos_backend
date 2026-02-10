import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { VisitForm } from "./visit-form.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity()
export class Route {
    @ApiPropertyOptional()
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({example: "Ruta eyzaguirre"})
    @Column()
    route_name: string;
    @ApiProperty({example: [1, 2, 3, 4]})
    @Column({type: "json"})
    route_points: number[];
    @ApiProperty({default: false})
    @Column({type: "boolean", default: false})
    completed: boolean;
    @OneToMany( () => WorkOrder, wo => wo.route, {nullable: true} )
    work_orders: WorkOrder[] | null;
    @OneToMany( () => VisitForm, vf => vf.route, {nullable: true} )
    visitForms: VisitForm[] | null;
};