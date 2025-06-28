import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Products } from 'src/products/products.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 96,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 256,
    unique: true,
  })
  slug: string;

  // Deletes subcategories if category is deleted
  @ManyToOne(() => Category, (Category) => Category.subCategories, {
    onDelete: 'CASCADE',
    eager: true,
  })
  category: Category[];

  @OneToMany(() => Products, (Products) => Products.category)
  @JoinColumn()
  product: Products;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
