import { Exclude } from 'class-transformer';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserRoles } from 'src/user-roles/user-roles.entity';
import { Tenant } from 'src/tenants/tenants.entity';
import { Products } from 'src/products/products.entity';
import { Orders } from 'src/orders/orders.entity';

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

  @ManyToMany(() => UserRoles, (role) => role.user, {
    eager: true,
  })
  @JoinTable()
  roles: UserRoles[];

  @OneToOne(() => Tenant, (tenant) => tenant.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  tenant: Tenant;

  @OneToMany(() => Products, (products) => products.user)
  product: Products[];

  @OneToMany(() => Orders, (orders) => orders.user, {
    cascade: true,
  })
  orders: Orders[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
