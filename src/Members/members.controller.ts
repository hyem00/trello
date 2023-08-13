import { Controller, Post, Body, Get, Delete, Request, Param, Response } from '@nestjs/common';
import { MembersService } from './members.service';
import { createMemberDto } from './dto/create-member.dto';
import { Members } from './members.entity';

@Controller('api')
export class MembersController {
  constructor(private readonly MembersService: MembersService) {}

  @Post('/member')
  async createMember(@Body() MemberData: createMemberDto, @Request() req) {
    const myUid = req.user.uid;
    const result = await this.MembersService.createMember(MemberData, myUid);
    return { message: '멤버 추가에 성공하였습니다', data: result };
  }
  //그 보드의 전체 멤버
  @Get('/board/:bid/member')
  async getAllMembers(@Param('bid') bid: number) {
    const result = await this.MembersService.getAllMembers(bid);
    return { message: '멤버 리스트가 조회 완료 되었습니다', data: result };
  }

  @Delete('/member')
  async deleteMember(@Body() MemberData: createMemberDto, @Request() req) {
    const myUid = req.user.uid;
    await this.MembersService.deleteMember(MemberData, myUid);
    return { message: '멤버 삭제에 성공하였습니다' };
  }
}
