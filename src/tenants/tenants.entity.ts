import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Tenant {
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
  slug: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  stripeAccountId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 512,
  })
  storeImg?: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  stripeDetailsSubmitted: boolean;

  @OneToOne(() => User, (user) => user.tenant, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
