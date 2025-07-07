import { Module } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Operator])],
  controllers: [OperatorsController],
  providers: [OperatorsService],
})
export class OperatorsModule {}
