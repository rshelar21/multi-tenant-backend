import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':userId')
  public getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
