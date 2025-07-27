import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestType } from '../global/types';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  public signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('/sign-up')
  public signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    return this.authService.signUp(signUpDto, res);
  }

  @Post('/change-password')
  public updatePassword(@Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.authService.updatePassword(updateUserPasswordDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-token')
  public refreshToken(
    @Req()
    req: RequestType,
    @Res() res: Response,
  ) {
    return this.authService.refreshtoken(req, res);
  }

  @Post('/logout')
  public logout(@Req() req: RequestType, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
