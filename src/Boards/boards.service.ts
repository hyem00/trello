import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './boards.entity';
import { Users } from 'src/Users/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  //보드 조회
  async getBoard(bid: number) {
    if (!bid || bid == undefined) {
      throw new NotFoundException('존재하지 않는 보드 입니다.');
    }
    return await this.boardRepository.findOne({ where: { bid } });
  }

  //보드 생성
  async createBoard(uid: number, name: string, color: string, explanation: string) {
    if (!name || !color || !explanation) {
      throw new NotFoundException('모든 필드를 입력해주세요');
    }
    const user = await this.userRepository.findOne({ where: { uid } });
    const newBoard = this.boardRepository.create({ users: user, name, color, explanation });
    const saveBoard = await this.boardRepository.save(newBoard);
    return saveBoard;
  }

  //보드 수정
  async updateBoard(bid: number, name: string, color: string, explanation: string) {
    if (!bid || bid == undefined) {
      throw new NotFoundException('존재하지 않는 보드입니다.');
    }
    await this.boardRepository.update(bid, { name, color, explanation });
    return await this.boardRepository.findOne({ where: { bid } });
  }

  //보드 삭제
  async deleteBoard(bid: number) {
    const isExistBoard = await this.checkBoard(bid);
    if (!isExistBoard) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 보드입니다.');
    }
    if (isExistBoard){
      this.boardRepository.delete(bid);
      return { message: '보드가 삭제되었습니다.' };
    }
  }
  // 보드가 존재하는지 확인하는 함수 작성
  async checkBoard(bid: number): Promise<boolean> {
    const board = await this.boardRepository.findOne({ where: { bid } });
    return !!board; // board가 존재하면 true, 존재하지 않으면 false를 반환
  }
}
