import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '../tags.entity';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { CreateTagDto } from '../dto/create-tag.dto';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { PaginationProvider } from 'src/global/pagination/services/pagination.provider';
import { Request } from 'express';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getAllTags(
    genericQueryParams: GenericQueryParams,
    @Req() req: Request,
  ) {
    try {
      const { page, limit } = genericQueryParams;

      const where: FindOptionsWhere<Tags> = {};

      if (req?.user) {
        where.user = {
          id: req?.user?.id,
        };
      }

      const relations: FindOptionsRelations<Tags> = {
        user: true,
      };

      const tags = await this.paginationProvider.paginateQuery(
        {
          limit,
          page,
        },
        this.tagsRepository,
        where,
        relations,
      );

      // const [data, count] = await this.tagsRepository.findAndCount({
      //   skip: (page - 1) * limit,
      //   take: limit,
      // });
      // return { data, count };
      return tags;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }
  // many
  public async getTagsByIds(ids: string[]) {
    try {
      const [data, count] = await this.tagsRepository.findAndCountBy({
        id: In(ids),
      });

      return { data, count };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getTagsByNames(names: string[]) {
    try {
      const [data, count] = await this.tagsRepository.findAndCountBy({
        name: In(names),
      });
      return { data, count };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleTag(id: string) {
    try {
      return this.tagsRepository?.findOneBy({
        id,
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async createTag(createTagDto: CreateTagDto, req: Request) {
    try {
      const existingTag = await this.tagsRepository.findOneBy({
        name: createTagDto?.name,
      });
      if (existingTag) {
        throw new BadRequestException('Tag already exist');
      }
      const newTag = await this.tagsRepository.create({
        name: createTagDto?.name,
        user: req?.user,
      });

      return this.tagsRepository.save(newTag);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create', err.message);
    }
  }

  public async deleteTag(id: string) {
    try {
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete', err.message);
    }
  }
}
