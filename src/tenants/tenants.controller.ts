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

//   @Post()
//   public createTag(@Body() createTagDto: CreateTagDto) {
//     return this.tenantsService.createTag(createTagDto);
//   }

  @Delete()
  public deleteTenant(@Body() id: string) {
    return this.tenantsService.deleteTenant(id);
  }
}
