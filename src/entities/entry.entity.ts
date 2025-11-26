import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BusStop } from "./bus-stop.entity";

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    date: string;
    @Column()
    user_id: number;
    @Column()
    bus_stop_id: number;
    @ManyToOne( () => User, user => user.entries, {nullable: true} )
    @JoinColumn({name: "user_id"})
    user: User | null;
    @ManyToOne( () => BusStop, bs => bs.entries, {nullable: true} )
    @JoinColumn({name: "bus_stop_id"})
    busStop: BusStop | null;
};