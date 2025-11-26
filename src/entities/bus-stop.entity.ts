import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VisitForm } from "./visit-form.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";

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
    @OneToMany( () => VisitForm, vf => vf.busStop, {nullable: true} )
    visitForms: VisitForm[] | null;
    @OneToMany( () => Entry, entry => entry.busStop, {nullable: true} )
    entries: Entry[] | null;
    @OneToMany( () => Departure, departure => departure.busStop, {nullable: true} )
    departures: Departure[] | null;
};