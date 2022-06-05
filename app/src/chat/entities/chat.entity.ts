/* eslint-disable */
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from "typeorm";

@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
	_id: string

    @Column()
    message: string;

    @JoinColumn()
    user: UserEntity;

}
