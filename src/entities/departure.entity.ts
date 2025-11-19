import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BusStop } from "./bus-stop.entity";

@Entity()
export class Departure {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "timestamp"})
    date: Date;
    @Column()
    user_id: number;
    @Column()
    bus_stop_id: number;
    @ManyToOne( () => User, user => user.entries )
    user: User;
    @ManyToOne( () => BusStop, bs => bs.departures, {nullable: true} )
    @JoinColumn({name: "bus_stop_id"})
    busStop: BusStop | null;
};