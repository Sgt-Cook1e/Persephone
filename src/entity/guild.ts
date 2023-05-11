import { Collection } from "oceanic.js"
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

    @Column()
    rchannel: string
    
    @Column()
    cchannel: string

    @Column()
    gptChannel: string

    @Column()
    formApi: string

    @Column()
    logger: string

}