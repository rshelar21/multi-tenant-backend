import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  In,
  FindOptionsRelations,
} from 'typeorm';
import { RequestType } from 'src/global/types';
import { Reviews } from '../reviews.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { ReviewsQueryParms } from '../dtos/review-query.dto';
import { ProductsService } from 'src/products/services/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,

    private readonly productsService: ProductsService,
  ) {}

  public async getAllReviews(
    req: RequestType,
    reviewsQueryParms: ReviewsQueryParms,
  ) {
    const where: FindOptionsWhere<Reviews> = {};
    try {
      const user = req.user;
      const { productId } = reviewsQueryParms;

      if (productId) {
        where.product = {
          id: productId,
        };
      }

      if (user?.id) {
        where.user = {
          id: user?.id,
        };
      }

      const [data, count] = await this.reviewsRepository.findAndCount({
        where,
      });

      return {
        data,
        count,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async getSingleReview(
    req: RequestType,
    reviewsQueryParms: ReviewsQueryParms,
  ) {
    const where: FindOptionsWhere<Reviews> = {};
    try {
      const { productId } = reviewsQueryParms;

      if (productId) {
        where.product = {
          id: productId,
        };
      }

      if (req.user) {
        where.user = {
          id: req.user.id,
        };
      }

      const review = await this.reviewsRepository.findOne({
        where,
      });

      return review;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to fetched', err.message);
    }
  }

  public async createReview(
    req: RequestType,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      const user = req.user;

      const product = await this.productsService.getSingleProduct(
        createReviewDto?.productId,
      );

      if (!product) {
        throw new BadRequestException('Product not found!');
      }
      const review = this.reviewsRepository.create({
        description: createReviewDto?.description,
        rating: createReviewDto?.rating,
        product,
        user,
      });

      return await this.reviewsRepository.save(review);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create', err.message);
    }
  }
}
