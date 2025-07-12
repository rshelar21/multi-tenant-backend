import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './services/reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewsQueryParms } from './dtos/review-query.dto';
import { RequestType } from 'src/global/types';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('/all')
  public getAllReviews(
    @Req() req: RequestType,
    @Query() reviewsQueryParms: ReviewsQueryParms,
  ) {
    return this.reviewsService.getAllReviews(req, reviewsQueryParms);
  }

  @Get()
  public getSingleReview(
    @Req() req: RequestType,
    @Query() reviewsQueryParms: ReviewsQueryParms,
  ) {
    return this.reviewsService.getSingleReview(req, reviewsQueryParms);
  }

  @Post()
  public createReview(
    @Req() req: RequestType,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(req, createReviewDto);
  }
}
