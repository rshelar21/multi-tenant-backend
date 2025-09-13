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
import { TagsService } from './services/tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';
import { RequestType } from 'src/global/types';
import { Request } from 'express';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  public getAllTags(
    @Query() genericQueryParams: GenericQueryParams,
    @Req() req: Request,
  ) {
    return this.tagsService.getAllTags(genericQueryParams, req);
  }

  @Get('/:id')
  public getSingleTag(@Param() params: { id: string }) {
    return this.tagsService.getSingleTag(params?.id);
  }

  @Post()
  public createTag(
    @Body() createTagDto: CreateTagDto,
    @Req()
    req: Request,
  ) {
    return this.tagsService.createTag(createTagDto, req);
  }

  @Delete()
  public deleteTag(@Body() id: string) {
    return this.tagsService.deleteTag(id);
  }
}
