import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RequestType } from 'src/global/types';
import { ProductsService } from './services/products.service';
import { ContentDto, CreateProductDto } from './dto/create-product.dto';
import { ProductsQueryParms } from './dto/product-query-params.dto';
import { PatcProductDto } from './dto/update-product.dto';
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

  @Patch('/content')
  public updateProductContent(
    @Req() req: RequestType,
    @Body() contentDto: ContentDto,
  ) {
    return this.productsService.createProductContent(req, contentDto);
  }

  @Patch('/:id')
  public updateProduct(
    @Req() req: RequestType,
    @Param('id') id: string,
    @Body() updateProductDto: PatcProductDto,
  ) {
    return this.productsService.updateProduct(req, id, updateProductDto);
  }

  @Delete()
  public deleteProduct(@Req() req: RequestType, @Body() body: { id: string }) {
    return this.productsService.deleteProduct(req, body.id);
  }
}
