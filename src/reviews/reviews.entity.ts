import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Products } from 'src/products/products.entity';

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  description: string;

  @Column({
    type: 'smallint',
    nullable: false,
    default: 1,
  })
  rating: number;

  @ManyToOne(() => Products, (products) => products.reviews)
  product: Products;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
