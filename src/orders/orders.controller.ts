import { Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  @Post()
  public createOrder(createOrderDto: CreateOrderDto) {
    
  }
}
