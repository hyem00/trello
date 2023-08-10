import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ListsService } from './lists.service';
import { Lists } from "./lists.entity"
import { ListsDto } from './dto/list.dto';


@Controller('api')
export class ListsController {
    constructor(private listsService: ListsService) {}

    
    // 1. 리스트 순서변경 : POST : localhost:3000/api/board/:bid/order
    @Put('/board/:bid/order')
    async changeLists(
        @Param('bid') bid: number,
        @Body() data: {lid: number, position: number, newPosition: number},
        ) {
        await this.listsService.changeLists(bid, data)
         return { message: "리스트가 성공적으로 변경되었습니다."}
    }
}

