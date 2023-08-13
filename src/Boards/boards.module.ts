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
  ],
  controllers: [BoardsController],
  providers: [BoardsService, Repository],
})
export class BoardsModule {}
