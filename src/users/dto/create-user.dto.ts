// src/applications/dto/create-application.dto.ts

import { IsString, IsOptional, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name kiriting' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefon raqam kiriting' })
  // Telefon raqam formati uchun IsPhoneNumber validatorini ishlatamiz
  @IsPhoneNumber('UZ', { message: 'Telefon raqam noto‘g‘ri formatda' })
  phone: string;

  @IsOptional()
  @IsString()
  additionalPhone?: string;

  @IsString()
  @IsNotEmpty({ message: 'Username kiriting' })
  username: string;

  @IsOptional()
  @IsString()
  utmTag?: string;

  

  @IsOptional()
  applicationDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}
