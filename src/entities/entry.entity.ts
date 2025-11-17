import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "timestamp"})
    date: Date;
    @Column()
    user_id: number;
    @Column()
    bus_stop_id: number;
    @ManyToOne( () => User, user => user.entries )
    @JoinColumn({name: "user_id"})
    user: User;
};