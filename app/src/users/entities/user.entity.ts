/* eslint-disable */

import { Column, Entity, PrimaryGeneratedColumn, ObjectIdColumn } from "typeorm";

@Entity()
export class UserEntity {
    @ObjectIdColumn()
	_id: string
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column({unique: false})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

}
