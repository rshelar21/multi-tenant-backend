import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './services/analytics.service';
import { RequestType } from 'src/global/types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  public async getReport(@Req() req: RequestType) {
    return this.analyticsService.getReport(req);
  }
}
