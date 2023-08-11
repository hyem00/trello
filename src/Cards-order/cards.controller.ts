import { Body, Controller, Delete, Get, Put, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Cards } from './cards.entity';
import { CardsDto } from './dto/card.dto'


@Controller('api')
export class CardsController {
    constructor(private cardsService: CardsService) {}

    // 1. 카드 순서변경 : PUT : localhost:3000/api/list/:lid/order
    // 리스트아이디(lid)는 params에 받고, body에 변경할 카드아이디(cid), 현재순서(position), 바꾸고싶은순서(newPosition)를 넣는다.
    @Put('/list/:lid/order')
    async changeCards(
        @Param('lid') lid: number,
        @Body() data: {cid: number, position: number, newPosition: number}
    ) {
        await this.cardsService.changeCards(lid, data)
        return { message: "카드가 성공적으로 변경되었습니다." }
    }


}