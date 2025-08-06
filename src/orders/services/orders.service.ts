import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../orders.entity';
import {
  Repository,
  FindOptionsWhere,
  FindOptionsRelations,
  FindOptionsSelect,
} from 'typeorm';
import { ProductsService } from 'src/products/services/products.service';
import { OrdersQueryParms } from '../dtos/orders-query.dto';
import { RequestType } from 'src/global/types';
import { PaginationProvider } from 'src/global/pagination/services/pagination.provider';
import { Request } from 'express';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

    private readonly productsService: ProductsService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getAllOrders(
    req: RequestType,
    ordersQueryParms: OrdersQueryParms,
  ) {
    const where: FindOptionsWhere<Orders> = {};
    const { limit, page, access, productId } = ordersQueryParms;
    try {
      if (req.user && access !== 'admin') {
        where.user = {
          id: req.user.id,
        };
      }

      if (productId) {
        where.product = {
          id: productId,
        };
      }

      const relations: FindOptionsRelations<Orders> = {
        user: false,
        product: {
          reviews: true,
          user: {
            roles: false,
          },
        },
      };

      const select: FindOptionsSelect<Orders> = {
        name: true,
        createDate: true,
        id: true,
        product: true,
        updateDate: true,
        user: {
          tenant: true,
          name: true,
          roles: false,
          password: false,
        },
      };

      return await this.paginationProvider.paginateQuery(
        {
          limit,
          page,
        },
        this.ordersRepository,
        where,
        relations,
        select,
      );
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleOrder(id: string, productId: string) {
    try {
      const where: FindOptionsWhere<Orders> = {};
      if (id) {
        where.id = id;
      }
      if (productId) {
        where.product = {
          id: productId,
        };
      }
      return this.ordersRepository?.findOne({
        where,
        relations: {
          user: true,
          product: true,
        },
        select: {
          name: true,
          createDate: true,
          id: true,
          product: true,
          updateDate: true,
        },
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleOrderByProduct(req: Request, productId: string) {
    try {
      const where: FindOptionsWhere<Orders> = {};

      if (productId) {
        where.product = {
          id: productId,
        };
      }
      if (req.user.id) {
        where.user = {
          id: req.user.id,
        };
      }
      return this.ordersRepository?.findOne({
        where,
        relations: {
          user: true,
          product: true,
        },
        select: {
          name: true,
          createDate: true,
          id: true,
          product: true,
          updateDate: true,
        },
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async createOrder(createOrderDto: CreateOrderDto) {
    console.log({ createOrderDto });
    try {
      const products = await this.productsService.getManyProducts(
        createOrderDto?.productIds,
      );

      const order = await this.ordersRepository.save({
        name: products[0]?.name || 'test1',
        product: products,
        stripeCheckoutSessionId: createOrderDto?.stripeCheckoutSessionId,
        user: createOrderDto?.user,
      });

      await this.ordersRepository.save(order);
      return {
        sucess: 'order placed',
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to get categories',
        err.message,
      );
    }
  }
}
