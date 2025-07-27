import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../category.entity';
import { SubCategory } from '../sub-category.entity';
import { CreateSubCategoryDto, CreateManySubCategoryDto } from '../dto';
import { PaginationProvider } from 'src/global/pagination/services/pagination.provider';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { RequestType } from 'src/global/types';
import { UserRolesIdType } from 'src/user-roles/enums/user-roles.enum';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReposity: Repository<Category>,

    @InjectRepository(SubCategory)
    private readonly subCategoryReposity: Repository<SubCategory>,

    private dataSource: DataSource,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getAllSubCategories(genericQueryParams: GenericQueryParams) {
    const { page, limit } = genericQueryParams;
    try {
      const data = await this.paginationProvider.paginateQuery(
        {
          limit,
          page,
        },
        this.subCategoryReposity,
      );
      return data;
      // const [data, count] = await this.subCategoryReposity.findAndCount();
      // return { data, count };
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

  public async getSingleSubCategory(id: string) {
    try {
      return this.subCategoryReposity?.findOneBy({
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

  public async createSubCategory(
    req: RequestType,
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    try {
      if (
        req.user?.roles.some((i) => i.roleType === UserRolesIdType.SUPER_ADMIN)
      ) {
        throw new BadRequestException('Can not create category');
      }
      const existingCategory = await this.subCategoryReposity.findOneBy({
        name: createSubCategoryDto?.name,
      });

      if (existingCategory) {
        throw new BadRequestException('Sub-Category already exist');
      }

      const createSubCategory = await this.subCategoryReposity.create({
        name: createSubCategoryDto?.name,
        slug: createSubCategoryDto?.slug,
      });

      return this.subCategoryReposity.save(createSubCategory);
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

  public async createManySubCategory(
    req: RequestType,
    createManySubCategoryDto: CreateManySubCategoryDto,
  ) {
    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      if (
        req.user?.roles.some((i) => i.roleType === UserRolesIdType.SUPER_ADMIN)
      ) {
        throw new BadRequestException('Can not create category');
      }
      // Connect the query ryunner to the datasource
      await queryRunner.connect();

      // Start the transaction
      await queryRunner.startTransaction();

      for (let c of createManySubCategoryDto?.category) {
        const newCategory = queryRunner.manager.create(SubCategory, c); // entityClass, data
        await queryRunner.manager.save(newCategory);
      }

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

  public async deteleSubCategory(id: string) {
    try {
      const existingCategory = await this.subCategoryReposity.findOneBy({
        id,
      });

      if (!existingCategory) {
        throw new BadRequestException('Sub-Category not found');
      }

      return await this.subCategoryReposity.delete(id);
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
