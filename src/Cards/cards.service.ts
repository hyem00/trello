import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  async getCard(lid: number): Promise<Cards[]> {
    const list = await this.listRepository.findOne({ where: { lid } });
    if (!list.lid || list.lid == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    }
    const cards = await this.cardRepository.find({where: {lid}})
    if(!cards || cards == undefined){
      throw new NotFoundException('카드 조회에 실패했습니다.');
    }
    return cards;
  }


  // 2. 카드 작성
  async createCard(lid: number, createCardDto: CreateCardDto) {

    const list = await this.listRepository.findOne({ where: { lid } });
    if (!list.lid || list.lid == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    } else if (!createCardDto) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.')
    }

    const card = await this.cardRepository.create({
      lid: lid,
      title: createCardDto.title,
      color: createCardDto.color,
      manager: createCardDto.manager,
      explanation: createCardDto.explanation,
      deadline: createCardDto.deadline,
    })
    return await this.cardRepository.save(card);

    
  }

  // 3. 카드 수정
  async updateCard(cid: number, updateCardDto: UpdateCardDto) {
    const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }

    await this.cardRepository.update( {cid}, {
      title: updateCardDto.title, 
      color: updateCardDto.color, 
      explanation: updateCardDto.explanation,
      deadline: updateCardDto.deadline 
      });
    const update = await this.cardRepository.findOne({where: {cid}})
    return update;
  }


  // 4. 카드 삭제
  async deleteCard(lid: number, cid: number) {
    
    const list = await this.listRepository.findOne({ where: { lid } });
    if (!list.lid || list.lid == undefined) {
      throw new NotFoundException('해당 리스트가 존재하지 않습니다.');
    } 
    if(!cid){
      throw new BadRequestException("삭제할 카드 ID를 입력해주세요.")
    }
    const remove = await this.cardRepository.delete(cid);
    if(remove.affected === 0){
      throw new NotFoundException(`해당 카드가 조회되지 않습니다. cardId: ${cid}`)
  }
  }

  // 5. 작업자 할당/변경
  async updateManager(cid: number, managerDto: ManagerDto) {

    const { manager, newManager } = managerDto
    const managerCid = await this.cardRepository.findOne({ where: { cid } });
    if (!managerCid || managerCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    } else if (!manager || !newManager) {
      throw new BadRequestException("미기입된 항목이 있습니다. 모두 입력해주세요.")
    }

    managerCid.manager = newManager
    const update = this.cardRepository.save(managerCid)
    return update;
}

    // 6. 마감일 수정
    async updateDeadline(cid: number, deadlineDto: DeadlineDto) {
      const { deadline, NewDeadline } = deadlineDto;
      const deadlineCid = await this.cardRepository.findOne({ where: { cid } });
    if (!deadlineCid || deadlineCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    } else if (!deadline || !NewDeadline) {
      throw new BadRequestException("미기입된 항목이 있습니다. 모두 입력해주세요.")
    }

    deadlineCid.deadline = NewDeadline
    const update = this.cardRepository.save(deadlineCid)
    return update;
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
