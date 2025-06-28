import { Products } from 'src/products/products.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Tags {
  @PrimaryGeneratedColumn("uuid")
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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
