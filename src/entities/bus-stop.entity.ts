import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VisitForm } from "./visit-form.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class BusStop {
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({example: -71.0324, description: "Latitud de la ubicación del paradero"})
    @Column({type: "double precision"})
    lat: number;
    @ApiProperty({example: -71.3021, description: "Longitud de la ubicación del paradero"})
    @Column({type: "double precision"})
    lng: number;
    @ApiProperty({example: "PJ803-i", description: "Codigo visible fisicamente en el paradero"})
    @Column()
    codigo: string;
    @ApiProperty({example: "Eyzaguirre/German Ebbinghaus", description: "Por lo general un detalle sobre la ubicación del paradero, sin embargo puede ser cualquier otra cosa relacionada al paradero"})
    @Column()
    description: string;
    @OneToMany( () => VisitForm, vf => vf.busStop, {nullable: true} )
    visitForms: VisitForm[] | null;
    @OneToMany( () => Entry, entry => entry.busStop, {nullable: true} )
    entries: Entry[] | null;
    @OneToMany( () => Departure, departure => departure.busStop, {nullable: true} )
    departures: Departure[] | null;
    @Column({nullable: true})
    lastVisited: string; //Fecha en formato ISO string
};

export class BusStopDTO {
    constructor(){
        this.id = 0;
        this.lat = -71.0324;
        this.lng = -71.3021;
        this.codigo = "pf102-j";
        this.description = "Eyzaguirre/German Ebbinghaus"
    }
    @ApiProperty()
    id: number;
    @ApiProperty()
    lat: number;
    @ApiProperty()
    lng: number;
    @ApiProperty()
    codigo: string;
    @ApiProperty()
    description: string;
}