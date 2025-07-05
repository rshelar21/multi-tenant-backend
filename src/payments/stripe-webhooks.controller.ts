import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { RequestType } from 'src/global/types';
import { CreateCheckoutDto } from './dto/create-checkout.dto.';
import { StripeService } from './services/stripe.service';
import { Request } from 'express';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/webhook')
  public postStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.stripeService.processWebhook(req)
  }
}
