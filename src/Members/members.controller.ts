import { Controller, Post, Body, Get, Delete, Request, Param, Response } from '@nestjs/common';
import { MembersService } from './members.service';
import { createMemberDto } from './dto/create-member.dto';
import { Members } from './members.entity';

@Controller('api')
export class MembersController {
  constructor(private readonly MembersService: MembersService) {}

  @Post('/member')
  async createMember(@Body() MemberData: createMemberDto, @Response() res): Promise<Members> {
    const myUid = res.user.uid;
    return await this.MembersService.createMember(MemberData, myUid);
  }
  //그 보드의 전체 멤버
  @Get('/board/:bid/member')
  async getAllMembers(@Param('bid') bid: number) {
    return await this.MembersService.getAllMembers(bid);
  }

  @Delete('/member')
  async deleteMember(@Body() MemberData: createMemberDto, @Response() res): Promise<void> {
    const myUid = res.user.uid;
    await this.MembersService.deleteMember(MemberData, myUid);
  }
}
