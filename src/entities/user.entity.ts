import { UserType } from "src/types/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./work-order.entity";
import { Entry } from "./entry.entity";
import { Departure } from "./departure.entity";
import { VisitForm } from "./visit-form.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty()
    @Column()
    full_name: string;
    @ApiProperty()
    @Column()
    email: string;
    @ApiProperty()
    @Column()
    username: string;
    @ApiProperty()
    @Column()
    password: string
    @ApiProperty()
    @Column()
    user_type: UserType;
    @ApiPropertyOptional()
    @Column({type: "double precision", nullable: true, default: null})
    lat: number | null;
    @ApiPropertyOptional()
    @Column({type: "double precision", nullable: true, default: null})
    lng: number | null;
    @ApiPropertyOptional({example: new Date().toISOString()})
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

export class UserDTO {
    constructor(){}
    @ApiProperty({
        example: 0
    })
    id: number;
    @ApiProperty({
        example: "Tulio Triviño"
    })
    full_name: string;
    @ApiProperty({
        example: "t.triviño@email.cl"
    })
    email: string;
    @ApiProperty({
        description: "Generado automáticamente en el backend usando el nombre y el apellido.\nSi varios usuarios cuentan con el mismo nombre y apellido, a este username se le agrega un numero al final de manera incremental dependiendo de cuantos haya con el mismo nombre y apellido",
        examples: {
            "Primer usuario con el mismo nombre y apellido": "t.triviño",
            "Segundo usuario con el mismo nombre y apellido": "t.triviño1",
            "Tercer usuario con el mismo nombre y apellido": "t.triviño2"
        }
    })
    username: string;
    @ApiProperty({
        description: "Describe el rol del usuario, solo puede tomar tres valores, en caso de asignar un valor erroneo, el servidor notificará un error",
        examples: {
            "Tipo 1": "jefatura" as UserType,
            "Tipo 2": "oferente" as UserType,
            "Tipo 3": "terreno" as UserType
        }
    })
    user_type: UserType;
    @ApiProperty({
        description: "Contraseña almacenada en BBDD, esta se guarda encriptada en formato SHA256, utilizando secretos de encriptación que están guardados como variables de entorno para evitar filtraciones de seguridad de los usuarios",
    })
    password: string;
    @ApiPropertyOptional({
        description: "Latitud de la ubicación del usuario, marcada como opcional, ya que, solo los usuarios en terreno van cambiando el valor de esta variable según se muevan.",
        example: -71.0934
    })
    lat: number;
    @ApiPropertyOptional({
        description: "Longitud de la ubicación del usuario, marcada como opcional, ya que, solo los usuarios en terreno van cambiando el valor de esta variable según de muevan",
        example: -71.9234
    })
    lng: number;
    @ApiPropertyOptional({
        description: "Fecha, hora y segundos en formato ISO en los que el usuario tuvo su última actualización en la geolocalización, marcada como opcional, ya que, solo los usuario en terreno van cambiando el valor de esta variable según se muevan",
        example: new Date().toISOString()
    })
    lastUpdated: string;
}

export class CreateUserDTO{}