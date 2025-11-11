import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { VisitForm } from "./visit-form.entity";

@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "array"})
    route_points: number[];
    @Column({type: "array"})
    route_points_visited: number[];
    @Column({type: "boolean", default: false})
    completed: boolean;
    @OneToOne( () => WorkOrder, wo => wo.route )
    work_order: WorkOrder;
    @OneToMany( () => VisitForm, vf => vf.route )
    visitForms: VisitForm[];
};