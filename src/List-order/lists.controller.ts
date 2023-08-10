// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
// import { ListsService } from './lists.service';
// import { Lists } from "./lists.entity"


// @Controller('api')
// export class ListsController {
//     constructor(private listsService: ListsService) {}

    
//     // 1. 리스트 순서변경 : POST : localhost:3000/api/board/:bid/list/:lid/target/:targetlid
//     @Post('/list/:lid/order')
//     async listOrder(
//         @Param('bid') bid: number,
//         @Param('lid') lid: number,
//         @Param('targetlid') targetlid: number,
//         ) {
//         const list = await this.listsService.listOrder(bid, lid, targetlid);
//         return list;
//     }
// }

