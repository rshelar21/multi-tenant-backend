import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';
import { SubCategory } from './sub-category.entity';

@Entity()
@Index(['slug'])
export class Category {
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
    nullable: true,
    length: 96,
  })
  color: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 256,
    unique: true,
  })
  slug: string;

  // Automatically saves subcategories when creating a category
  @OneToMany(() => SubCategory, (SubCategory) => SubCategory.category, {
    cascade: true,
    // eager: true,
  })
  subCategories: SubCategory[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
