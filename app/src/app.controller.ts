/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginUserDto } from './users/dto/login-user.dto';
import { LoginUser, User } from './users/entities/user.model';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private userService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto): Promise<any>{
    const user: LoginUser = {
      email: loginUser.email.trim(),
      password: loginUser.password.trim(),
    };
    return this.userService.login(user);
  }
}
