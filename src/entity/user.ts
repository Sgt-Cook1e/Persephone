import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm"

@Entity()
export class DMember {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    MemberID: string

    @Column()
    Birthday: string
}