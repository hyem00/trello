import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards } from './cards.entity';
import { Lists } from 'src/Lists/lists.entity';
import { Boards } from 'src/Boards/boards.entity';
import { Comments } from 'src/Comments/comments.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Cards, Lists, Boards])],
  controllers: [CardsController],
  providers: [CardsService, Repository],
})
export class CardsModule {}