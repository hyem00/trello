import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from './cards.entity';


@Controller('api')
export class CardsController {}