import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Members } from './members.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Members]),
    // MemberModule // 인증유저만 게시글 보고 쓸수있음
  ],
  controllers: [MembersController],
  providers: [MembersService, Repository],
})
export class MembersModule {}
