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
    try {
      if (!bid || bid == undefined) {
        throw new NotFoundException('존재하지 않는 보드 입니다.');
      }
      return await this.boardRepository.findOne({ where: { bid } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //보드 생성
  async createBoard(name: string, color: string, explanation: string) {
    try {
      // const user = await this.userRepository.findOne({ where: { uid } });
      // if (!user) {
      //   throw new NotFoundException('로그인을 해주세요!');
      // }
      if (!name || !color || !explanation) {
        throw new NotFoundException('모든 필드를 입력해주세요');
      }
      const newBoard = this.boardRepository.create({ name, color, explanation });
      return await this.boardRepository.save(newBoard);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //보드 수정
  async updateBoard(bid: number, name: string, color: string, explanation: string) {
    try {
      if (!bid || bid == undefined) {
        throw new NotFoundException('존재하지 않는 보드입니다.');
      }
      await this.boardRepository.update(bid, { name, color, explanation });
      return await this.boardRepository.findOne({ where: { bid } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //보드 삭제
  async deleteBoard(bid: number) {
    try {
      const isExistBoard = await this.checkBoard(bid);
      if (!isExistBoard) {
        throw new NotFoundException('이미 삭제되었거나 존재하지 않는 보드입니다.');
      }
      this.boardRepository.delete(bid);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 보드가 존재하는지 확인하는 함수 작성
  private async checkBoard(bid: number) {
    try {
      const board = await this.boardRepository.findOne({
        where: { bid },
      });
      if (!board) {
        throw new NotFoundException(`${bid}번 보드는 존재하지 않는 보드 입니다.`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
