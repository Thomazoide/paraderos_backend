import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { VisitForm } from "./visit-form.entity";

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