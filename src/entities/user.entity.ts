import { UserType } from "src/types/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    full_name: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    user_type: UserType;
    @OneToMany( () => Entry, entry => entry.user )
    entries: Entry;
    @OneToMany( () => Departure, dep => dep.user )
    departures: Departure;
    @OneToMany( () => WorkOrder, wo => wo.user_final, {nullable: true} )
    work_orders: WorkOrder[] | null;
};