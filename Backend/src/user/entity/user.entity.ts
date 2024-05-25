import { CommonEntity } from "src/common/common.entity";
import { TaskEntity } from "src/task/entity/task.entity";
import { Column, Entity, OneToMany } from "typeorm";

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

    @OneToMany(() => TaskEntity, (task) => task.user,)
    task: TaskEntity[];
}