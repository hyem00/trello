import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, Param } from '@nestjs/common';
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
    @InjectRepository(Members) private readonly membersRepository: Repository<Members>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Boards) private readonly boardsRepository: Repository<Boards>,
  ) {}

  //멤버 추가
  async createMember(MemberData: createMemberDto, myUid: number): Promise<Members> {
    const adminId = await this.boardsRepository.findOne({ where: { users: { uid: myUid } } });
    if (!adminId || adminId == undefined) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    const id = await this.usersRepository.findOne({ where: { uid: myUid } });
    if (!id || id == undefined) {
      throw new NotFoundException('쿠키값에 유저가 존재하지 않습니다.');
    }

    const user = await this.usersRepository.findOne({
      where: { uid: MemberData.uid },
    });
    if (!user || user == undefined) {
      throw new NotFoundException('찾을 수 없는 사용자 입니다.');
    }

    return await this.membersRepository.save({
      ...MemberData,
    });
  }
  // 보드값에 맞는 멤버 회원들 모두 조회
  async getAllMembers(bid: number): Promise<Members[]> {
    if (!bid || bid == undefined) {
      throw new NotFoundException('해당보드가 존재하지 않습니다');
    }
    return await this.membersRepository.find({ where: { bid } });
  }
  //                                                    void : 반환 안할때
  async deleteMember(MemberData: createMemberDto, myUid: number): Promise<void> {
    const adminId = await this.boardsRepository.findOne({ where: { users: { uid: myUid } } });
    if (!adminId || adminId == undefined) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
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
  }
}
