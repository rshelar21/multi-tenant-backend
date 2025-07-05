import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../orders.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { ProductsService } from 'src/products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  public async createOrder(createOrderDto: CreateOrderDto) {

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
