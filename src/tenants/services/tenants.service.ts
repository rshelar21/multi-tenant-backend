import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  public async getAllTenants() {
    try {
      const [data, count] = await this.tenantRepository.findAndCount();
      return { data, count };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleTenant(id: string) {
    try {
      return this.tenantRepository?.findOneBy({
        id,
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async deleteTenant(id: string) {
    try {

    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete', err.message);
    }
  }
}
