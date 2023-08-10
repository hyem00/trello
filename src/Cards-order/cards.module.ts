import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cards } from './cards.entity'
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Repository } from 'typeorm'


@Module({
  imports: [TypeOrmModule.forFeature([Cards])],
  controllers: [CardsController],
  providers: [CardsService, Repository],
})
export class CardsModule {}