import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { Boards } from 'src/Boards/boards.entity';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { Repository } from 'typeorm';
import { Cards } from 'src/Cards/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lists, Boards, Cards])],
  controllers: [ListsController],
  providers: [ListsService, Repository],
})
export class ListsModule {}
