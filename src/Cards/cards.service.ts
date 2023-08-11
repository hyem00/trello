import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from './cards.entity';
import { Comments } from 'src/Comments/comments.entity';
import { Lists } from 'src/Lists/lists.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DeadlineDto } from './dto/update-deadline.dto'
import { ManagerDto } from './dto/update-manager.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private cardRepository: Repository<Cards>,
    @InjectRepository(Comments) private commentRepository: Repository<Comments>,
    @InjectRepository(Lists) private listRepository: Repository<Lists>,
  ) {}

  // 1. 카드 목록 조회
  async getCard(lid: number) {
    const listId = await this.listRepository.findOne({ where: { lid } });
    if (!listId || listId == undefined) {
      throw new NotFoundException('해당 리스트가 존재하지 않습니다.');
    }

    const result = await this.cardRepository.find({ where: { lid } });
    return result;
  }

  // 2. 카드 작성
  createCard(lid: number, data: CreateCardDto) {

    // return this.cardRepository.insert({
    //   lid: lid,
    //   title: data.title,
    //   color: data.color,
    //   explanation: data.explanation,
    //   deadline: data.deadline,
    // });
  }

  // 3. 카드 수정
  async updateCard(cid: number, data: UpdateCardDto) {
    const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }

    return this.cardRepository.update(cid, { title: data.title, color: data.color, explanation: data.explanation, deadline: data.deadline });
  }

  // 4. 카드 삭제
  async deleteCard(cid: number) {
    const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }
    await this.cardRepository.delete(cid);
  }

  // 5. 작업자 할당/변경
  async updateManager(cid: number, data: ManagerDto) {
    const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }
    const newManager = this.cardRepository.update(cid, { manager: data.manager})
    return newManager;
}

    // 6. 마감일 수정
    async updateDeadline(cid: number, data: DeadlineDto) {
        const { deadline, NewDeadline } = data;
        const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }

    IsCid.deadline = NewDeadline
    const updateManager = this.cardRepository.save(IsCid)
    return updateManager;
    }


    // 7. 카드 순서변경
async changeCards(lid: number, data: {cid: number, position: number, newPosition: number}): Promise<void> {
    try{
        if(!lid || lid == undefined){
            throw new NotFoundException('List ID가 존재하지 않습니다.')
        } else if (!data || data == undefined){
            throw new NotFoundException('미기입된 항목을 입력해주세요.')
        }
    // 트랜잭션 사용
    await this.cardRepository.manager.transaction(async (manager) => {
        const { cid, position, newPosition } = data;
        const cardToUpdate = await manager.findOne(Cards, {where: {cid}});
    
    if(!cardToUpdate){
        throw new NotFoundException('카드가 조회되지 않습니다.')
    }
    const cardsToUpdate = await manager.find(Cards, {
        where: {lid},
        order: {position: 'ASC'}
    })
    const updateNewPosition = Math.max(0, Math.min(data.newPosition, cardsToUpdate.length -1))

    cardsToUpdate.splice(position, 1);
    cardsToUpdate.splice(updateNewPosition, 0, cardToUpdate);

    cardsToUpdate.forEach((card, index) => {
        card.position = index;
    })
    await manager.save(cardsToUpdate);

    })
    }catch(error){
        console.log(error);
        throw new NotFoundException('카드 순서변경에 실패했습니다.')
    }
}



}
