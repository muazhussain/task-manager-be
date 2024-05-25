import { CommonEntity } from "src/common/common.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

@Entity('task')
export class TaskEntity extends CommonEntity {
    @Column()
    title: string;

    @Column({
        nullable: true,
    })
    description?: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.OPEN,
    })
    status: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({
        nullable: true,
    })
    dueDate?: string;

    @ManyToOne(() => UserEntity, (user) => user.task,)
    @JoinColumn({ name: 'user', referencedColumnName: 'id' })
    user: UserEntity;
}