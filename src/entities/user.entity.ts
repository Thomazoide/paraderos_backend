import { UserType } from "src/types/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";
import { VisitForm } from "./visit-form.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    full_name: string;
    @Column()
    email: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    user_type: UserType;
    @Column({type: "double precision", nullable: true, default: null})
    lat: number | null;
    @Column({type: "double precision", nullable: true, default: null})
    lng: number | null;
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