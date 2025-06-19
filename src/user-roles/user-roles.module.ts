import { Module } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './services/user-roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './user-roles.entity';

@Module({
  controllers: [UserRolesController],
  imports: [TypeOrmModule.forFeature([UserRoles])],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
