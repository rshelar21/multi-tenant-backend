import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefundPolicy } from './enums/refund-policy.enum';
import { SubCategory } from 'src/category/sub-category.entity';
import { Tags } from 'src/tags/tags.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 112,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 96,
  })
  price: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 512,
  })
  productImg?: string;

  @Column({
    type: 'enum',
    enum: RefundPolicy,
    default: RefundPolicy.DAY_30,
    nullable: false,
  })
  refundPolicy: string;

  @ManyToOne(() => SubCategory, (SubCategory) => SubCategory.product, {
    eager: true,
    onDelete: 'CASCADE',
  })
  category: SubCategory;

  @ManyToMany(() => Tags, (Tags) => Tags.products, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  tags: Tags[];

  @ManyToOne(() => User, (user) => user.product)
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
