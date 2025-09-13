import { Products } from 'src/products/products.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Index(['name'])
export class Tags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 112,
    nullable: false,
  })
  name: string;

  @ManyToMany(() => Products, (Products) => Products.tags)
  products: Products;

  @ManyToOne(() => User, (user) => user.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
