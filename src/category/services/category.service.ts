import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Category } from '../category.entity';
import { SubCategory } from '../sub-category.entity';
import { CreateCategoryDto, CreateManyCategoryDto } from '../dto';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReposity: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryReposity: Repository<SubCategory>,

    private dataSource: DataSource,
  ) {}

  public async getAllCategories() {
    try {
      const [data, count] = await this.categoryReposity.findAndCount();
      return { data, count };
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

  public async getSingleCategory(id: string) {
    try {
      return this.categoryReposity?.findOneBy({
        id,
      });
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
  public async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const existingCategory = await this.categoryReposity.findOneBy({
        name: createCategoryDto?.name,
      });

      if (existingCategory) {
        throw new BadRequestException('Sub-Category already exist');
      }

      const subCategoryList = await this.subCategoryReposity.findBy({
        id: In(createCategoryDto?.subCategories || []),
      });

      const createSubCategory = await this.categoryReposity.create({
        name: createCategoryDto?.name,
        slug: createCategoryDto?.slug,
        color: createCategoryDto?.color,
        subCategories: subCategoryList,
      });

      return this.categoryReposity.save(createSubCategory);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create categories',
        err.message,
      );
    }
  }

  public async createManyCategory(
    createManyCategoryDto: CreateManyCategoryDto,
  ) {
    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect the query ryunner to the datasource
      await queryRunner.connect();

      // Start the transaction
      await queryRunner.startTransaction();

      // for (let c of createManyCategoryDto?.category) {
      //   const newUser = queryRunner.manager.create(Category, c); // entityClass, data
      //   await queryRunner.manager.save(newUser);
      // }

      // if success
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create categories',
        err.message,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  public async deteleCategory(id: string) {
    try {
      const existingCategory = await this.categoryReposity.findOneBy({
        id,
      });

      if (!existingCategory) {
        throw new BadRequestException('Sub-Category not found');
      }

      return await this.categoryReposity.delete(id);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to delete categories',
        err.message,
      );
    }
  }
}
