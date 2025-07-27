import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { RequestType } from 'src/global/types';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/me')
  public getMe(
    @Req()
    req: RequestType,
    @Res() res: Response,
  ) {
    return this.usersService.getMe(req, res);
  }

  @Get(':userId')
  public getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }
}
