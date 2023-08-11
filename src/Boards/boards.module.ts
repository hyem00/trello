import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Repository } from 'typeorm';
import { Boards } from './boards.entity';
import { Users } from 'src/Users/users.entity';

// import { MemberModule } from '../Members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards, Users]),
    // MemberModule // 인증유저만 게시글 보고 쓸수있음
  ],
  controllers: [BoardsController],
  providers: [BoardsService, Repository],
})
export class BoardsModule {}
