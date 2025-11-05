import { UserType } from "src/types/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({name: "ID"})
    id: number;
    @Column()
    full_name: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    user_type: UserType;
};