import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Products } from 'src/products/products.entity';
import { Orders } from 'src/orders/orders.entity';
import { RequestType } from 'src/global/types';
import { UserRolesIdType } from 'src/user-roles/enums/user-roles.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

    private readonly dataSource: DataSource,
  ) {}

  async getReport(req: RequestType) {
    const isSuperAdmin = req?.user?.roles?.some(
      (i) => i.roleType === UserRolesIdType.SUPER_ADMIN,
    );
    let totalUsers = 0;
    let totalProducts = 0;
    try {
      if (isSuperAdmin) {
        totalUsers = await this.userRepository.count();
      }
      if (isSuperAdmin) {
        totalProducts = await this.productsRepository.count();
      } else {
        totalProducts = await this.productsRepository.countBy({
          user: {
            id: req?.user?.id,
          },
        });
      }

      const [orders, count] = await this.ordersRepository.findAndCount({
        order: {
          createDate: 'DESC', // or 'ASC' for ascending
        },
        relations: {
          product: true,
        },
        select: {
          product: {
            id: true,
            name: true,
            price: true,
            category: false,
            tags: false,
          },
          stripeCheckoutSessionId: false,
        },
        take: 5,
        ...(!isSuperAdmin && {
          where: {
            user: {
              id: req?.user?.id,
            },
          },
        }),
      });

      const totalRevenueQuery = await this.dataSource
        .getRepository(Orders)
        .createQueryBuilder('orders')
        .leftJoin('orders.product', 'product')
        .select('product.id', 'product_id')
        .addSelect('product.name', 'product_name')
        .addSelect('product.price', 'product_price')
        .addSelect('COUNT(orders.id)', 'order_count')
        .groupBy('product.id')
        .addGroupBy('product.name')
        .addGroupBy('product.price')
        .orderBy('order_count', 'DESC')
        .limit(5); // Top 10 products

      if (!isSuperAdmin) {
        totalRevenueQuery.where('product.userId = :userId', {
          userId: req?.user?.id,
        });
      }

      const totalRevenueResult = await totalRevenueQuery.getRawOne();

      return {
        totalUsers,
        totalProducts,
        orders,
        count,
        topProducts: [totalRevenueResult],
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to fetch analytics report',
        err?.message || 'Unknown error',
      );
    }
  }
}
