import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

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
};