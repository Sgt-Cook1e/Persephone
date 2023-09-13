import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class DGuild {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    GuildID: string

    @Column()
    CustomCurrency: boolean

    @Column()
    CustomCurrencyName: string

    @Column()
    wchannel: string

    @Column()
    wimg: string

    @Column()
    wmessage: string

    @Column()
    confessChannel: string

    @Column()
    confessLogger: string

    @Column()
    memberCount: string

    @Column()
    botsCount: string

    @Column()
    onlineCount: string

    @Column()
    lmsg: string

    @Column()
    lchannel: string

    @Column()
    bdaychannel: string

    @Column()
    chatgptChannel: string

    @Column()
    chatgptEnabled: boolean
}