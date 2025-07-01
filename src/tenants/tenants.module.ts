import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './services/tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenants.entity';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService],
  imports: [TypeOrmModule.forFeature([Tenant])],
  exports: [TenantsService],
})
export class TenantsModule {}
