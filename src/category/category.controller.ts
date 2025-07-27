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
import { RequestType } from 'src/global/types';
import { CategoryService } from './services/category.service';
import {
  CreateCategoryDto,
  CreateSubCategoryDto,
  CreateManySubCategoryDto,
  CreateManyCategoryDto,
} from './dto';
import { SubCategoryService } from './services/sub-category.service';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,

    private readonly subCategoryService: SubCategoryService,
  ) {}

  @Get('/')
  public getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  public getSingleCategory(@Param() params: { id: string }) {
    return this.categoryService.getSingleCategory(params?.id);
  }

  @Get('/sub-category/all')
  public getAllSubCategories(@Query() genericQueryParams: GenericQueryParams) {
    return this.subCategoryService.getAllSubCategories(genericQueryParams);
  }

  @Get('/sub-category/:id')
  public getSingleSubCategory(@Param() params: { id: string }) {
    return this.subCategoryService.getSingleSubCategory(params?.id);
  }

  @Post('/')
  public createCategory(
    @Req() req: RequestType,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(req, createCategoryDto);
  }

  @Post('/many')
  public createManyCategory(
    @Body() createManyCategoryDto: CreateManyCategoryDto,
  ) {
    return this.categoryService.createManyCategory(createManyCategoryDto);
  }

  @Delete('/')
  public deteleCategory(@Body() id: string) {
    return this.categoryService.deteleCategory(id);
  }

  //
  //
  // Sub categories
  //
  //

  @Post('/sub-category')
  public createSubCategory(
    @Req() req: RequestType,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoryService.createSubCategory(req, createSubCategoryDto);
  }

  @Post('/sub-category/many')
  public createManySubCategory(
    @Req() req: RequestType,
    @Body() createManySubCategoryDto: CreateManySubCategoryDto,
  ) {
    return this.subCategoryService.createManySubCategory(
      req,
      createManySubCategoryDto,
    );
  }

  @Delete('/sub-category')
  public deteleSubCategory(@Body() id: string) {
    return this.subCategoryService.deteleSubCategory(id);
  }
}
