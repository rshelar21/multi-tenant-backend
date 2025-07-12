import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { RequestType } from 'src/global/types';
import { StripeService } from './services/stripe.service';
import { Request } from 'express';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/webhook')
  public postStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.stripeService.processWebhook(req);
  }

  @Post('/account-link')
  public postCreateAccount(@Req() req: RequestType) {
    return this.stripeService.postCreateAccount(req);
  }
}
