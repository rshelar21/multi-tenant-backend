import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './services/payments.service';
import stripeConfig from 'src/config/stripe.config';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from 'src/products/products.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';
import { StripeWebhookController } from './stripe-webhooks.controller';
import { StripeService } from './services/stripe.service';

@Module({
  controllers: [PaymentsController, StripeWebhookController],
  providers: [PaymentsService, StripeService],
  imports: [
    ConfigModule.forFeature(stripeConfig),
    ProductsModule,
    TenantsModule,
    UsersModule,
    OrdersModule,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
