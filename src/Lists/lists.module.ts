import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { Boards } from 'src/Boards/boards.entity';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lists, Boards])],
  controllers: [ListsController],
  providers: [ListsService, Repository],
})
export class ListsModule {}
