import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { TenantsService } from './services/tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  public getAllTenants() {
    return this.tenantsService.getAllTenants();
  }

  @Get('/:id')
  public getSingleTenant(@Param() params: { id: string }) {
    return this.tenantsService.getSingleTenant(params?.id);
  }

  @Get('/slug/:slug')
  public getSingleTenantBySlug(@Param() params: { slug: string }) {
    return this.tenantsService.getSingleTenantBySlug(params?.slug);
  }

  //   @Post()
  //   public createTag(@Body() createTagDto: CreateTagDto) {
  //     return this.tenantsService.createTag(createTagDto);
  //   }

  @Delete()
  public deleteTenant(@Body() id: string) {
    return this.tenantsService.deleteTenant(id);
  }
}
