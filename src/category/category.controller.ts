import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import {
  CreateCategoryDto,
  CreateSubCategoryDto,
  CreateManySubCategoryDto,
  CreateManyCategoryDto,
} from './dto';
import { SubCategoryService } from './services/sub-category.service';

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
  public getAllSubCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Get('/sub-category/:id')
  public getSingleSubCategory(@Param() params: { id: string }) {
    return this.subCategoryService.getSingleSubCategory(params?.id);
  }

  @Post('/')
  public createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
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
  public createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Post('/sub-category/many')
  public createManySubCategory(
    @Body() createManySubCategoryDto: CreateManySubCategoryDto,
  ) {
    return this.subCategoryService.createManySubCategory(
      createManySubCategoryDto,
    );
  }

  @Delete('/sub-category')
  public deteleSubCategory(@Body() id: string) {
    return this.subCategoryService.deteleSubCategory(id);
  }
}
