import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Request } from 'express';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import stripeConfig from 'src/config/stripe.config';
import { RequestType } from 'src/global/types';
import { UsersService } from 'src/users/services/users.service';
import { OrdersService } from 'src/orders/services/orders.service';
import { TenantsService } from 'src/tenants/services/tenants.service';
import { UserRolesIdType } from 'src/user-roles/enums/user-roles.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,

    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,

    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly tenantService: TenantsService,
  ) {
    this.stripe = new Stripe(
      this.stripeConfiguration.stripeSecretKey as string,
    );
  }

  public async getRevenueDataails(req: RequestType) {
    const isSuperAdmin = req?.user?.roles.some(
      (i) => i.roleType === UserRolesIdType.SUPER_ADMIN,
    );
    try {
      if (isSuperAdmin) {
        const transfers = await this.stripe.balanceTransactions.list({
          type: 'application_fee',
        });
        const netRevenue = transfers.data.reduce(
          (acc, item) => acc + Number(item.net) / 100,
          0,
        );

        return netRevenue?.toFixed(2);
      } else {
        const balanceTransactions = await this.stripe.balanceTransactions.list({
          stripeAccount: 'acct_1Rk9UEIwiIDvZrN3', // connected account ID
        });
        const netRevenue = balanceTransactions.data?.reduce(
          (acc, item) => acc + item.net / 100,
          0,
        );

        return netRevenue?.toFixed(2);
      }
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create user',
        err.message,
      );
    }
  }

  public async processWebhook(request: RawBodyRequest<Request>) {
    const stripeSignature = request.headers['stripe-signature'];
    const data = request.rawBody;
    let event: Stripe.Event;

    if (!stripeSignature) {
      throw new BadRequestException(
        'stripe-signature header missing from stripe webhook header',
      );
    }

    if (!data) {
      throw new BadRequestException('body missing from stripe webhook request');
    }

    try {
      event = await this.stripe.webhooks.constructEvent(
        data,
        stripeSignature,
        this.stripeConfiguration.webhookSecretKey as string,
      );
    } catch (err) {
      if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new BadRequestException('Invalid stripe signature');
      }
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create webhook',
        err.message,
      );
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const data = event.data.object as Stripe.Checkout.Session;

        try {
          if (!data?.metadata?.userId) {
            throw new BadRequestException('User id is required');
          }

          const user = await this.usersService.getUser(data?.metadata?.userId);

          if (!user) {
            throw new BadRequestException('User not found');
          }

          // const session = await this.stripe.checkout.sessions.retrieve(
          //   data.id,
          //   {
          //     expand: ['line_items'],
          //   },
          // );

          // const lineItems = session.line_items;

          return await this.ordersService.createOrder({
            stripeCheckoutSessionId: data?.id,
            user,
            productIds: JSON.parse(data?.metadata?.productIds),
          });
        } catch (err) {
          if (err instanceof BadRequestException) {
            throw err;
          }
          throw new InternalServerErrorException(
            'Failed to create session',
            err.message,
          );
        }
      case 'account.updated':
        const acc = event.data.object as Stripe.Account;

        try {
          await this.tenantService.updateTenantBySlug(
            acc?.id,
            acc?.details_submitted,
          );
        } catch (err) {
          if (err instanceof BadRequestException) {
            throw err;
          }
          throw new InternalServerErrorException(
            'Failed to create session',
            err.message,
          );
        }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  public async postCreateAccount(req: RequestType) {
    try {
      if (!req?.user) {
        throw new BadRequestException('UnAuthorised');
      }
      const tenant = req.user?.tenant;

      const accountLink = await this.stripe.accountLinks.create({
        account: tenant?.stripeAccountId,
        type: 'account_onboarding',
        refresh_url: `${this.appConfiguration.frontendUrl}/admin`,
        return_url: `${this.appConfiguration.frontendUrl}/admin`,
      });

      if (!accountLink?.url) {
        throw new BadRequestException('Failed to create link');
      }

      return {
        url: accountLink?.url,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to create user',
        err.message,
      );
    }
  }
}
