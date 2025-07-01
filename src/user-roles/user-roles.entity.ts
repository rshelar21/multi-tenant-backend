import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { UserRolesType, UserRolesIdType } from './enums/user-roles.enum';
import { User } from 'src/users/user.entity';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRolesType,
    unique: true,
    nullable: false,
    default: UserRolesType.USER,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRolesIdType,
    unique: true,
    nullable: false,
    default: UserRolesIdType.USER,
  })
  roleType: number;

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
