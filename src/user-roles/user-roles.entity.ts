import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.roles, {
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
