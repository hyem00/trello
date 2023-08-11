import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, ValidationPipe } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListsDto } from './dto/create-list.dto'
import { UpdateListsDto } from './dto/update-list.dto'
import { ListsDto } from './dto/order.dto'
import { Lists } from './lists.entity';

@Controller('api')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  // 1. 리스트 목록 전체 조회 GET : localhost:3000/api/board/:bid/list
  @Get('/board/:bid/list')
  async getLists(@Param('bid') bid: number) {
    const lists = await this.listsService.getLists(bid);
    return lists;
  }

  // 2. 리스트 작성 
  @Post('/board/:bid/list')
  async createList(
    @Param('bid') bid: number,
    @Body() createListsDto: CreateListsDto
    ) {
    const list = await this.listsService.createList(bid, createListsDto)
    
    if (list) {
        return { message: '리스트가 성공적으로 생성 되었습니다.', data :{list} };
    }
  }

  // 3. 리스트 수정  
  @Put('/board/:bid/list/:lid')
    async updateList(
      @Param('bid') bid: number,
      @Param('lid') lid: number,
      @Body() updateListsDto: UpdateListsDto
    ) {
      const update = await this.listsService.updateList(bid, lid, updateListsDto)
        if(update){
            return {message: '리스트가 성공적으로 수정되었습니다.', data: {update}}
        }
    }

  // 4. 리스트 삭제
  @Delete('/board/:bid/list/:lid')
    async deleteList(
      @Param('bid') bid: number,
      @Param('lid') lid: number, 
    ) {
        await this.listsService.deleteList(bid, lid);
        return { message: '리스트가 성공적으로 삭제되었습니다.' }
    }

  // 5. 리스트 순서변경 : POST : localhost:3000/api/board/:bid/order
    @Put('/board/:bid/order')
    async changeLists(
        @Param('bid') bid: number,
        @Body() data: {lid: number, position: number, newPosition: number},
        ) {
        await this.listsService.changeLists(bid, data)
        return { message: "리스트가 성공적으로 변경되었습니다."}
    }
}
