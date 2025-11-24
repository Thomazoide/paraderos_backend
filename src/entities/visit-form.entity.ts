import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusStop } from "./bus-stop.entity";
import { Route } from "./route.entity";

@Entity()
export class VisitForm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({name: "pic_before_url"})
    picBeforeURL: string;
    @Column({name: "pic_after_url", nullable: true, default: null})
    picAfterURL: string | null;
    @Column()
    description: string;
    @Column({name: "bus_stop_id"})
    busStopId: number;
    @Column({nullable: true, default: null, name: "route_id"})
    routeId: number | null;
    @ManyToOne( () => BusStop, bs => bs.visitForms )
    @JoinColumn({name: "bus_stop_id"})
    busStop: BusStop;
    @ManyToOne( () => Route, route => route.visitForms, {nullable: true})
    @JoinColumn({name: "route_id"})
    route: Route | null;
    @Column({default: false})
    completed: boolean;
};