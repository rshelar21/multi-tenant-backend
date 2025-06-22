import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserRoles } from 'src/user-roles/user-roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 96,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 96,
  })
  username: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 96,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  @Exclude()
  password: string;

  @ManyToMany(() => UserRoles, (role) => role.user)
  @JoinTable()
  roles: UserRoles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
