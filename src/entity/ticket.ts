import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class Tickets {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    GuildID: string

    @Column()
    Channel: string

    @Column()
    Category: string

    @Column()
    Ticket: string

}