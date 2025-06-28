import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GenericQueryParams } from 'src/global/dto/generic-query-params.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  public getAllTags(@Query() genericQueryParams: GenericQueryParams) {
    return this.tagsService.getAllTags(genericQueryParams);
  }

  @Get('/:id')
  public getSingleTag(@Param() params: { id: string }) {
    return this.tagsService.getSingleTag(params?.id);
  }

  @Post()
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Delete()
  public deleteTag(@Body() id: string) {
    return this.tagsService.deleteTag(id);
  }
}
