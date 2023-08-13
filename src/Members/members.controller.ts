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
    const mem = await this.MembersService.createMember(MemberData, myUid);
    return { message: '리스트가 성공적으로 생성 되었습니다.', data: { mem } };
  }
  //그 보드의 전체 멤버
  @Get('/board/:bid/member')
  async getAllMembers(@Param('bid') bid: number) {
    return await this.MembersService.getAllMembers(bid);
  }

  @Delete('/member')
  async deleteMember(@Body() MemberData: createMemberDto, @Request() req): Promise<void> {
    const myUid = req.user.uid;
    await this.MembersService.deleteMember(MemberData, myUid);
  }
}
