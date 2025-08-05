import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import stripeConfig from 'src/config/stripe.config';
import appConfig from 'src/config/app.config';
import { RequestType } from 'src/global/types';
import { CreateCheckoutDto } from '../dto/create-checkout.dto.';
import { ProductsService } from 'src/products/services/products.service';
import { TenantsService } from 'src/tenants/services/tenants.service';
import { ProductMetada } from 'src/global/types/product-metadata';
import { PLATFORM_FEE_PERCENTAGE } from 'src/global/constants/query-params';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private frontendUrl: string;
  constructor(
    private readonly productsService: ProductsService,
    private readonly tenantsService: TenantsService,
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,

    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    this.stripe = new Stripe(
      this.stripeConfiguration.stripeSecretKey as string,
    );
    this.frontendUrl = this.appConfiguration.frontendUrl as string;
  }

  public async createCheckoutSession(
    createCheckoutDto: CreateCheckoutDto,
    req: RequestType,
  ) {
    try {
      const user = req.user;
      const products = await this.productsService.getManyProducts(
        createCheckoutDto?.productIds,
      );
      // add FE check also
      if (!products.length) {
        throw new BadRequestException('No products found!');
      }
      const tenant = await this.tenantsService.getSingleTenantBySlug(
        createCheckoutDto?.tenantSlug,
      );

      if (!tenant) {
        throw new BadRequestException('Tenant not found!');
      }
      if (!tenant.stripeDetailsSubmitted) {
        throw new BadRequestException('Tenant not alloed to sell product!');
      }

      const totoalAmount = products?.reduce(
        (acc, item) => acc + Number(item?.price) * 100,
        0,
      );

      const platformFeeAmount = Math.round(
        totoalAmount * (PLATFORM_FEE_PERCENTAGE / 100),
      );

      const productItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products?.map((item) => ({
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Number(item?.price) * 100,
            product_data: {
              name: item.name,

              metadata: {
                stripeAccountId: tenant?.stripeAccountId || '',
                id: item?.id,
                name: item?.name,
                price: Number(item?.price),
              },
            },
          },
        }));

      // let returnUrl = '';

      // if (process.env.NODE_ENV === 'development') {
      //   returnUrl = `https://${createCheckoutDto?.tenantSlug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/checkout`;
      // }

      const session = await this.stripe.checkout.sessions.create(
        {
          line_items: productItems,
          mode: 'payment',
          // payment_method_types: ['card'],
          customer_email: user?.email,
          success_url: `${this.frontendUrl}?success=true`,
          cancel_url: `${this.frontendUrl}?cancel=false`,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId: user?.id || '',
            productIds: JSON.stringify(products?.map((i) => i.id)),
            stripeAccountId: tenant?.stripeAccountId || '',
          },
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          stripeAccount: tenant?.stripeAccountId,
        },
      );

      if (!session.url) {
        throw new BadRequestException('Failed to create checkout session');
      }

      return {
        url: session?.url,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create session',
        err.message,
      );
    }
  }
}
