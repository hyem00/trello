import { Controller, Post, Body, Get, Delete, Request, Response } from '@nestjs/common';
import { MembersService } from './members.service';
import { createMemberDto } from './dto/create-member.dto';
import { Members } from './members.entity';

@Controller('api')
export class MembersController {
  constructor(private readonly MembersService: MembersService) {}

  @Post('/member')
  async createMember(@Body() MemberData: createMemberDto, @Response() res): Promise<Members> {
    const MyUid = res.user;
    console.log('@@@@@@@@@@@@', MyUid);
    return await this.MembersService.createMember(MemberData, MyUid);
  }
  //그 보드의 전체 멤버
  @Get('/member')
  async getAllMembers(@Body() bid: number) {
    return await this.MembersService.getAllMembers(bid);
  }

  @Delete('/member')
  async deleteMember(@Body() MemberData: createMemberDto): Promise<void> {
    await this.MembersService.deleteMember(MemberData);
  }
}
