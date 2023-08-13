import { Controller, Post, Delete, Get, Body, Param, Request } from '@nestjs/common';
import { CardManagerService } from './card-manager.service';
import { CreateCardMDto } from './Dto/crerate-card-manager';
import { UpdateCardMDto } from './Dto/update-card-manager';

@Controller('api')
export class CardManagerController {
  constructor(private readonly cardManagerService: CardManagerService) {}

  //매니저 추가
  @Post('/cmanager')
  async createMember(@Body() createCardMDto: CreateCardMDto, @Request() req) {
    const myUid = req.user.uid;
    const result = await this.cardManagerService.createManager(createCardMDto, myUid);
    return { message: '카드 매니저 추가에 성공하였습니다', data: result };
  }
  //그 카드의 매니저 조회
  @Get('/card/:cid/cmanager')
  async getAllMembers(@Param('cid') cid: number) {
    const result = await this.cardManagerService.getAllManager(cid);
    return { message: '카드 매니저가 조회 완료 되었습니다', data: result };
  }

  // 매니저 변경
  // @Patch('/cmanager')
  // async updateMember(@Body() updateCardMDto: UpdateCardMDto, @Request() req) {
  //   const myUid = req.user.uid;
  //   const update = await this.cardManagerService.updateMember(updateCardMDto, myUid);
  // }

  // 매니저 삭제
  @Delete('/cmanager')
  async deleteMember(@Body() createCardMDto: CreateCardMDto, @Request() req) {
    const myUid = req.user.uid;
    const result = await this.cardManagerService.deleteManager(createCardMDto, myUid);
    return { message: '카드 매니저 삭제에 성공하였습니다', data: result };
  }
}
