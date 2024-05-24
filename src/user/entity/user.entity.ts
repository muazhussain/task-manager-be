import { CommonEntity } from "src/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity('user')
export class UserEntity extends CommonEntity {
    @Column({
        nullable: true,
    })
    name?: string;

    @Column()
    username: string;

    @Column()
    password: string;
}