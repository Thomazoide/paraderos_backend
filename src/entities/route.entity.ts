import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    @Column({nullable: true})
    work_order_id: number | null;
    @OneToOne( () => WorkOrder, wo => wo.route, {nullable: true} )
    @JoinColumn({name: "work_order_id"})
    work_order: WorkOrder | null;
    @OneToMany( () => VisitForm, vf => vf.route )
    visitForms: VisitForm[];
};