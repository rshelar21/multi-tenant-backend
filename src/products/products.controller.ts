import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsQueryParms } from './dto/product-query-params.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public getAllProducts(@Query() productsQueryParms: ProductsQueryParms) {
    return this.productsService.getAllProducts(productsQueryParms);
  }

  @Get('/:id')
  public getSpecificProduct(@Param() params: { id: string }) {
    return this.productsService.getSingleProduct(params?.id);
  }

  @Post()
  public createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Delete()
  public deleteProduct(@Body() id: string) {
    return this.productsService.deleteProduct(id);
  }
}
