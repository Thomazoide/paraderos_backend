import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VisitForm } from "./visit-form.entity";

@Entity()
export class BusStop {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "double precision"})
    lat: number;
    @Column({type: "double precision"})
    lng: number;
    @Column()
    codigo: string;
    @Column()
    description: string;
    @OneToMany( () => VisitForm, vf => vf.busStop )
    visitForms: VisitForm[];
};