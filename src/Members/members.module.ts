import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Members } from './members.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/Users/users.entity';
import { Boards } from 'src/Boards/boards.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Members, Users, Boards]),
    // MemberModule // 인증유저만 게시글 보고 쓸수있음
  ],
  controllers: [MembersController],
  providers: [MembersService, Repository],
})
export class MembersModule {}
