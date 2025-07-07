import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorsModule } from './operators/operators.module';
import { LoginModule } from './login/login.module';
// import { GoogleModule } from './google/google.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',  // yoki sizning DB turi (mysql, sqlite, mssql va h.k.)
      host: 'dpg-d1lsetili9vc73earvig-a.oregon-postgres.render.com',
      port: 5432,
      username: 'usat',
      password: 'ElBaikZXyjD8tlMCWIYx71XWGHSjchrG',
      database: 'usatregis',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // faqat dev muhitda ishlatish uchun, productionda ehtiyot bo‘ling
      ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
    }),UsersModule,  OperatorsModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
