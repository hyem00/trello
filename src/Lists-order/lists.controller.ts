import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ListsService } from './lists.service';
import { Lists } from "./lists.entity"
import { ListsDto } from './dto/list.dto';


@Controller('api')
export class ListsController {
    constructor(private listsService: ListsService) {}

    
    // 1. 리스트 순서변경 : PUT : localhost:3000/api/board/:bid/order
    // 보드아이디(bid)는 params에 받고, body에 변경할 리스트아이디(lid), 현재순서(position), 바꾸고싶은순서(newPosition)를 넣는다.
    @Put('/board/:bid/order')
    async changeLists(
        @Param('bid') bid: number,
        @Body() data: {lid: number, position: number, newPosition: number},
        ) {
        await this.listsService.changeLists(bid, data)
         return { message: "리스트가 성공적으로 변경되었습니다."}
    }
}

