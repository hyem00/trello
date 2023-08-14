import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { BoardsModule } from './Boards/boards.module';
import { CardsModule } from './Cards/cards.module';
import { CommentsModule } from './Comments/comments.module';
import { ListsModule } from './Lists/lists.module';
import { MembersModule } from './Members/members.module';
import { UsersModule } from './Users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middlewares';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtConfigService } from './configs/jwt.config.service';
import { UsersService } from './Users/users.service';
import { UsersController } from './Users/users.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardManagerController } from './CardManager/card-manager.controller';
import { CardManagerModule } from './CardManager/card-manager.module';

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
    CardManagerModule,
  ],
  providers: [AppService, AuthMiddleware],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    .forRoutes(
    { path: 'api/member', method: RequestMethod.ALL }, 
    { path: 'api/board', method: RequestMethod.ALL }, 
    { path: 'api/cmanager', method: RequestMethod.ALL },
    { path: 'api/user', method: RequestMethod.ALL },
    { path: 'api/signup', method: RequestMethod.ALL },
    { path: 'api/login', method: RequestMethod.ALL },
    { path: 'api/card', method: RequestMethod.ALL }
    );
    

  }
}
console.log(typeORMConfig, '앱에서 확인');

// AuthMiddleware;
