import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Operator } from 'src/operators/entities/operator.entity';
import { GoogleService } from 'src/google/google.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Operator],)
  ],
  controllers: [UsersController],
  providers: [UsersService,GoogleService],
})
export class UsersModule {}
