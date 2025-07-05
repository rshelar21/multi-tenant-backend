import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestType } from 'src/global/types';
import { CreateCheckoutDto } from './dto/create-checkout.dto.';
import { PaymentsService } from './services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Post('/checkout')
  public createCheckoutSession(
    @Body() createCheckoutDto: CreateCheckoutDto,
    @Req() req: RequestType,
  ) {
    return this.paymentsService.createCheckoutSession(createCheckoutDto, req)
  }
}
