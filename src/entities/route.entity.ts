import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { VisitForm } from "./visit-form.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    route_name: string;
    @Column({type: "json"})
    route_points: number[];
    @Column({type: "boolean", default: false})
    completed: boolean;
    @OneToMany( () => WorkOrder, wo => wo.route, {nullable: true} )
    work_orders: WorkOrder[] | null;
    @OneToMany( () => VisitForm, vf => vf.route, {nullable: true} )
    visitForms: VisitForm[] | null;
};

export class RouteDTO {
    constructor(){
        this.id = 0;
        this.route_name = "Ruta eyzaguirre";
        this.route_points = [2, 3, 5];
        this.completed = false;
    }
    @ApiProperty({
        example: 0
    })
    id: number;
    @ApiProperty({
        example: "Ruta eyzaguirre"
    })
    route_name: string;
    @ApiProperty({
        description: "IDs de los paraderos que pertenecen a la ruta",
        example: [2, 3, 5]
    })
    route_points: number[];
    @ApiProperty({
        example: false
    })
    completed: boolean;
}