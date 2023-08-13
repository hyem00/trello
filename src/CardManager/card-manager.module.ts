import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardManagerService } from './card-manager.service';
import { CardManagerController } from './card-manager.controller';
import { Repository } from 'typeorm';
import { Cards } from 'src/Cards/cards.entity';
import { Members } from 'src/Members/members.entity';
import { CardManagers } from './card-manager.entity';
import { Boards } from 'src/Boards/boards.entity';
import { Users } from 'src/Users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards, Members, CardManagers, Boards, Users]),
    // MemberModule // 인증유저만 게시글 보고 쓸수있음
  ],
  controllers: [CardManagerController],
  providers: [CardManagerService, Repository],
})
export class CardManagerModule {}
