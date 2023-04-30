import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class DGuild {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    GuildID: string

    @Column()
    wchannel: string

    @Column()
    wmessage: string

    @Column()
    wimg: string

}