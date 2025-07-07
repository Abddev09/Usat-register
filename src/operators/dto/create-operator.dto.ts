// src/operators/dto/create-operator.dto.ts
import { IsString } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  name: string;
}
