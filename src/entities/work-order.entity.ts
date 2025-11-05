import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Route } from "./route.entity";
import { User } from "./user.entity";

@Entity()
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({default: false})
    completada: boolean
    @Column()
    fichas_ids: number[];
    @Column({type: "timestamp"})
    creation_date: Date;
    @Column({type: "timestamp"})
    complete_date: Date;
    @Column({nullable: true})
    user_id: number | null;
    @Column({nullable: true})
    route_id: number | null;
    @OneToOne( () => Route, route => route.work_order, {nullable: true} )
    @JoinColumn({name: "route_id"})
    route: Route | null;
    @ManyToOne( () => User, user => user.work_orders, {nullable: true} )
    @JoinColumn({name: "user_id"})
    user_final: User | null;
};