// src/auth/auth.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';


@Controller('login')
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @Post('')
  login(@Body() loginDto: CreateLoginDto) {
    return this.authService.login(loginDto);
  }

  
}
