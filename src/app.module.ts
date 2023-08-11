import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { BoardsModule } from './Boards/boards.module';
import { CardsModule } from './Cards/cards.module';
import { CommentsModule } from './Comments/comments.module';
import { ListsModule } from './Lists/lists.module';
import { MembersModule } from './Members/members.module';
import { UsersModule } from './Users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from '../src/auth/auth.middlewares';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtConfigService } from './configs/jwt.config.service';
import { UsersService } from './Users/users.service';
import { UsersController } from './Users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => typeORMConfig }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
    BoardsModule,
    CardsModule,
    CommentsModule,
    ListsModule,
    MembersModule,
    UsersModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class AppModule {}
