import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/configs/jwt.config.service';
import { UsersController } from './users.controller';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { Users } from './users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, Repository],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
