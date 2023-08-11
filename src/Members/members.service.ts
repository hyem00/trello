import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createMemberDto } from './dto/create-member.dto';
import { Members } from './members.entity';
import { Users } from 'src/Users/users.entity';
import { Boards } from 'src/Boards/boards.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { throws } from 'assert';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Members)
    private readonly membersRepository: Repository<Members>,
    private readonly usersRepository: Repository<Users>,
    private readonly BoardsRepository: Repository<Boards>,
  ) {}

  //멤버 추가
  async createMember(MemberData: createMemberDto, MyUid: number): Promise<Members> {
    try {
      // const adminId = await this.BoardsRepository.findOne({ where: { uid: MyUid } });
      // if (!adminId || adminId == undefined) {
      //   throw new UnauthorizedException('권한이 없습니다');
      // }

      // 토큰에 있는 이메일 가져와서 그걸로 조인해서 유저 아이디 찾아오기

      const user = await this.usersRepository.findOne({
        where: { uid: MemberData.uid },
      });
      if (!user || user == undefined) {
        throw new NotFoundException('찾을 수 없는 사용자 입니다.');
      }
      
      return await this.membersRepository.save({
        ...MemberData,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('멤버 추가에 실패하였습니다');
    }
  }

  async getAllMembers(bid): Promise<Members[]> {
    if (!bid || bid == undefined) {
      throw new NotFoundException('board ID가 존재하지 않습니다.');
    }
    return await this.membersRepository.find({ where: { bid } });
  }
  //                                                    void : 반환 안할때
  async deleteMember(MemberData: createMemberDto): Promise<void> {
    try {
      const uid = await this.membersRepository.findOne({
        where: { uid: MemberData.uid },
      });
      if (!uid || uid == undefined) {
        throw new NotFoundException('존재하지 않는 멤버입니다');
      }

      const bid = await this.membersRepository.findOne({
        where: { bid: MemberData.bid },
      });
      if (!bid || bid == undefined) {
        throw new NotFoundException('존재하지 않는 보드입니다');
      }
      await this.membersRepository.delete(MemberData);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('멤버 삭제에 실패하였습니다');
    }
  }
}
