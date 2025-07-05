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
import { ProductsService } from './services/products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsQueryParms } from './dto/product-query-params.dto';
import { RequestType } from 'src/global/types';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public getAllProducts(
    @Req() req: RequestType,
    @Query() productsQueryParms: ProductsQueryParms,
  ) {
    return this.productsService.getAllProducts(req, productsQueryParms);
  }

  @Get('/many-products')
  public getManyProducts(@Query() productsQueryParms: { ids: string[] }) {
    return this.productsService.getManyProducts(productsQueryParms.ids);
  }

  @Get('/:id')
  public getSpecificProduct(@Param() params: { id: string }) {
    return this.productsService.getSingleProduct(params?.id);
  }

  @Post()
  public createProduct(
    @Req() req: RequestType,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(req, createProductDto);
  }

  @Delete()
  public deleteProduct(@Body() id: string) {
    return this.productsService.deleteProduct(id);
  }
}
