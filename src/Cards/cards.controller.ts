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
    return await this.cardService.getCard(lid);
  }

  // 2. 카드 작성
  @Post('/board/:bid/list/:lid/card')
  createCard(@Param('lid') lid: number, @Body() data: CreateCardDto) {
    const result = this.cardService.createCard(lid, data);
    return { message: "카드가 작성되었습니다.", data: result }

  }
  // 3. 카드 수정
  @Put('/board/:bid/list/:lid/card/:cid')
  updateCard(@Param('cid') cid: number, @Body() data: UpdateCardDto) {
    const result = this.cardService.updateCard(cid, data);
    return { message: "카드가 수정되었습니다.", data: result }
  }

  // 4. 카드 삭제
  @Delete('/board/:bid/list/:lid/card')
  deleteCard(@Body() cid: number) {
    const result = this.cardService.deleteCard(cid);
    return { message: "카드가 삭제되었습니다", data: result };
  }

  // 5. 작업자 할당 / 변경 localhost:3000/api/board/:bid/card/:cid
  @Patch('/board/:bid/list/:lid/card/:cid')
  updateManager(@Param('cid') cid: number, @Body() data: ManagerDto) {
    const result = this.cardService.updateManager(cid, data)
    return { message: "작업자가 변경되었습니다.", Manager: result }
  }

  // 6. 카드 마감일 수정
  @Patch('/board/:bid/list/:lid/card/:cid')
  updateDeadline(@Param('cid') cid: number, @Body() data: DeadlineDto) {
    const result = this.cardService.updateDeadline(cid, data);
    return { message: "카드 마감일이 수정되었습니다.", newDeadline: result}
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
