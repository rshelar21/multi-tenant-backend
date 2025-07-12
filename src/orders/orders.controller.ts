import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersQueryParms } from './dtos/orders-query.dto';
import { RequestType } from 'src/global/types';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  public getAllOrders(
    @Req() req: RequestType,
    @Query() ordersQueryParms: OrdersQueryParms,
  ) {
    return this.ordersService.getAllOrders(req, ordersQueryParms);
  }

  @Get('/product')
  public getSingleOrderByProduct(@Query() query: { productId: string }) {
    return this.ordersService.getSingleOrderByProduct(query?.productId);
  }

  @Get('/:id')
  public getSpecificProduct(
    @Param() params: { id: string },
    @Query() query: { productId: string },
  ) {
    return this.ordersService.getSingleOrder(params?.id, query?.productId);
  }

  @Post()
  public createOrder(createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }
}
