import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCardMDto } from './Dto/crerate-card-manager';
import { Cards } from 'src/Cards/cards.entity';
import { Users } from 'src/Users/users.entity';
import { Repository } from 'typeorm';
import { CardManagers } from './card-manager.entity';
import { Members } from 'src/Members/members.entity';
import { Boards } from 'src/Boards/boards.entity';
import { UpdateCardMDto } from './Dto/update-card-manager';

@Injectable()
export class CardManagerService {
  constructor(
    @InjectRepository(Cards) private readonly cardsRepository: Repository<Cards>,
    @InjectRepository(Members) private readonly membersRepository: Repository<Members>,
    @InjectRepository(CardManagers) private readonly cardManagerRepository: Repository<CardManagers>,
    @InjectRepository(Boards) private readonly boardsRepository: Repository<Boards>,
    @InjectRepository(Users) private readonly usersepository: Repository<Users>,
  ) {}

  //매니저 추가
  async createManager(createCardMDto: CreateCardMDto, myUid: number): Promise<CardManagers> {
    const adminId = await this.boardsRepository.findOne({ where: { users: { uid: myUid } } });
    if (!adminId || adminId == undefined) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const user = await this.usersepository.find({
      where: { uid: createCardMDto.uid },
    });
    if (!user || user == undefined) {
      throw new NotFoundException('존재하는 유저가 아닙니다.');
    }

    const member = await this.membersRepository.findOne({
      where: { uid: createCardMDto.uid },
    });
    if (!member || member == undefined) {
      throw new NotFoundException('우리 멤버 유저가 아닙니다.');
    }

    return await this.cardManagerRepository.save({
      ...createCardMDto,
    });
  }
  // 카드값에 맞는 멤버 회원들 모두 조회
  async getAllManager(cid: number): Promise<CardManagers[]> {
    if (!cid || cid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다');
    }
    return await this.cardManagerRepository.find({ where: { cid } });
  }

  // 카드 매니저 수정
  // async updateMember(@ )

  // 카드 매니저 삭제
  async deleteManager(createCardMDto: CreateCardMDto, myUid: number) {
    const adminId = await this.boardsRepository.findOne({ where: { users: { uid: myUid } } });
    if (!adminId || adminId == undefined) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    const uid = await this.cardManagerRepository.findOne({
      where: { uid: createCardMDto.uid },
    });
    if (!uid || uid == undefined) {
      throw new NotFoundException('존재하지 않는 매니저입니다.');
    }

    const bid = await this.cardsRepository.findOne({
      where: { cid: createCardMDto.cid },
    });
    if (!bid || bid == undefined) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }
    return await this.membersRepository.delete(createCardMDto);
  }
}
