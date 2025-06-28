import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  In,
} from 'typeorm';
import { Products } from '../products.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { SubCategoryService } from 'src/category/services/sub-category.service';
import { ProductsQueryParms } from '../dto/product-query-params.dto';
import { TagsService } from 'src/tags/services/tags.service';
import { PaginationProvider } from 'src/global/pagination/services/pagination.provider';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    private readonly subCategoryService: SubCategoryService,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getAllProducts(productsQueryParms: ProductsQueryParms) {
    try {
      const where: FindOptionsWhere<Products> = {};
      const { maxPrice, minPrice, parentSlug, slug, tags, limit, page } =
        productsQueryParms;

      console.log([tags].flat(2), 'tags');

      if (parentSlug || slug) {
        where.category = {};
        if (slug) {
          where.category.slug = slug;
        }
        if (parentSlug) {
          where.category.category = {
            slug: parentSlug,
          };
        }
      }

      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      } else if (minPrice) {
        where.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice) {
        where.price = LessThanOrEqual(maxPrice);
      }

      if (tags) {
        const list = [tags].flat(2);
        where.tags = {
          name: In(list),
        };
      }
      const products = await this.paginationProvider.paginateQuery(
        {
          limit,
          page,
        },
        this.productsRepository,
        where,
      );
      return products;
      // const [data, count] = await this.productsRepository.findAndCount({
      //   where,
      // });
      // return { data, count };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleProduct(id: string) {
    try {
      return this.productsRepository?.findOneBy({
        id,
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async createProduct(createProductDto: CreateProductDto) {
    try {
      const existingProduct = await this.productsRepository.findOneBy({
        name: createProductDto?.name,
      });
      if (existingProduct) {
        throw new BadRequestException('Product already exist');
      }
      const category = await this.subCategoryService.getSingleSubCategory(
        createProductDto?.category,
      );

      const newProduct = await this.productsRepository?.create({
        name: createProductDto?.name,
        description: createProductDto?.description,
        price: createProductDto?.price,
        productImg: createProductDto?.productImg,
        refundPolicy: createProductDto?.refundPolicy,
        // category,
      });

      if (createProductDto?.tags) {
        const { data } = await this.tagsService.getTagsByIds(
          createProductDto?.tags,
        );
        newProduct.tags = data;
      }
      if (category) {
        newProduct.category = category;
      }
      return await this.productsRepository.save(newProduct);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create', err.message);
    }
  }

  public async deleteProduct(id: string) {
    try {
      const existingProduct = await this.productsRepository.findOneBy({
        id,
      });

      if (!existingProduct) {
        throw new BadRequestException('Sub-Category not found');
      }

      return await this.productsRepository.delete(id);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to delete product',
        err.message,
      );
    }
  }
}
