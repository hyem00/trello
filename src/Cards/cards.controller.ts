import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Patch, Post, ValidationPipe } from '@nestjs/common';
import { Cards } from './cards.entity';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DeadlineDto } from './dto/update-deadline.dto'
import { ManagerDto } from './dto/update-manager.dto';

@Controller('api')
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  // 1. 카드 목록 조회
  @Get('/board/:bid/list/:lid/card')
  async getCard(@Param('lid') lid: number) {
    const cards = await this.cardService.getCard(lid);
    return cards
  }

  // 2. 카드 작성
  @Post('/board/:bid/list/:lid/card')
  async createCard(@Param('lid') lid: number, @Body() createCardDto: CreateCardDto) {
    const card = await this.cardService.createCard(lid, createCardDto);
    return { message: "카드가 성공적으로 작성되었습니다.", data: { card }}

  }
  // 3. 카드 수정
  @Put('/board/:bid/list/:lid/card/:cid')
  async updateCard(@Param('cid') cid: number, @Body() updateCardDto: UpdateCardDto) {
    const update = await this.cardService.updateCard(cid, updateCardDto);
    return { message: "카드가 성공적으로 수정되었습니다.", data: { update } }
  }

  // 4. 카드 삭제
  @Delete('/board/:bid/list/:lid/card')
  async deleteCard(@Param('lid') lid: number, @Body() cid: number) {
    await this.cardService.deleteCard(lid, cid);
    return { message: "카드가 성공적으로 삭제되었습니다" };
  }

  // 5. 작업자 할당 / 변경 localhost:3000/api/board/:bid/card/:cid
  @Patch('/board/:bid/list/:lid/card/:cid')
  async updateManager(@Param('cid') cid: number, @Body() managerDto: ManagerDto) {
    const update = await this.cardService.updateManager(cid, managerDto)
    return { message: "작업자가 변경되었습니다.", newManager: {update} }
  }

  // 6. 카드 마감일 수정
  @Patch('/board/:bid/list/:lid/card/:cid')
  async updateDeadline(@Param('cid') cid: number, @Body() deadlineDto: DeadlineDto) {
    const update = await this.cardService.updateDeadline(cid, deadlineDto);
    return { message: "카드 마감일이 수정되었습니다.", newDeadline: {update} }
  }

  
  // 7. 카드 순서변경 : PUT : localhost:3000/api/list/:lid/order
  // 리스트아이디(lid)는 params에 받고, body에 변경할 카드아이디(cid), 현재순서(position), 바꾸고싶은순서(newPosition)를 넣는다.
  @Put('/list/:lid/order')
  async changeCards(
    @Param('lid') lid: number,
    @Body() data: {cid: number, position: number, newPosition: number}
  ) {
      await this.cardService.changeCards(lid, data)
      return { message: "카드가 성공적으로 변경되었습니다." }
  }

}
