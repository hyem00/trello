import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './comments.entity';
import { Cards } from 'src/Cards/cards.entity';
import { Boards } from 'src/Boards/boards.entity';
import { Lists } from 'src/Lists/lists.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Repository } from 'typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Comments, Cards, Lists, Boards])],
  controllers: [CommentsController],
  providers: [CommentsService, Repository],
})
export class CommentsModule {}

// 모듈 내의 depencies : (class의 의존성, constructor에 설정된 값들)은
// 모듈 내에 의존성을 불러야 한다.