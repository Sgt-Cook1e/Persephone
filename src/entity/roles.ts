import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class DGuild {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    GuildID: string

    @Column()
    Group : string

    @Column()
    Roles: JSON

}