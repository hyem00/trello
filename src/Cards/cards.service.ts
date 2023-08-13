import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cards } from './cards.entity';
import { Comments } from 'src/Comments/comments.entity';
import { Lists } from 'src/Lists/lists.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DeadlineDto } from './dto/update-deadline.dto';
import { ManagerDto } from './dto/update-manager.dto';
import { OrderDto } from './dto/order.dto';
import { create, max } from 'lodash';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards) private cardRepository: Repository<Cards>,
    @InjectRepository(Comments) private commentRepository: Repository<Comments>,
    @InjectRepository(Lists) private listRepository: Repository<Lists>,
    private readonly dataSource: DataSource,
  ) {}

  // 1. 카드 목록 조회
  async getCard(lid: number): Promise<Cards[]> {
    const list = await this.listRepository.findOne({ where: { lid } });
    if (!list.lid || list.lid == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    }
    const cards = await this.cardRepository.find({ where: { lid } });
    if (!cards || cards == undefined) {
      throw new NotFoundException('카드 조회에 실패했습니다.');
    }
    return cards;
  }

  async findMaxOrder(lid: number): Promise<number> {
    const maxOrderRecord = await this.cardRepository.createQueryBuilder('card').select('MAX(card.order)', 'max_order').where('card.lid = :lid', { lid: lid }).getRawOne();

    return maxOrderRecord?.max_order || 0;
  }

  // 2. 카드 생성
  async createCard(lid: number, createCardDto: CreateCardDto) {
    const list = await this.listRepository.findOne({ where: { lid } });
    if (!list || list == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    } else if (!createCardDto) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.');
    }

    // order 1씩증가
    const maxOrder = await this.findMaxOrder(lid);

    if (maxOrder == 0) {
      const data = await this.cardRepository.save({
        lid: lid,
        title: createCardDto.title,
        color: createCardDto.color,
        manager: createCardDto.manager,
        explanation: createCardDto.explanation,
        deadline: createCardDto.deadline,
      });
      return data;
    } else {
      const data = await this.cardRepository.save({
        lid: lid,
        title: createCardDto.title,
        color: createCardDto.color,
        manager: createCardDto.manager,
        explanation: createCardDto.explanation,
        deadline: createCardDto.deadline,
        order: maxOrder + 1,
      });
      return data;
    }
  }

  // 3. 카드 수정
  async updateCard(cid: number, updateCardDto: UpdateCardDto) {
    const IsCid = await this.cardRepository.findOne({ where: { cid } });
    if (!IsCid || IsCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    }

    await this.cardRepository.update(
      { cid },
      {
        title: updateCardDto.title,
        color: updateCardDto.color,
        explanation: updateCardDto.explanation,
      },
    );
    const update = await this.cardRepository.findOne({ where: { cid } });
    return update;
  }

  // 4. 카드 삭제
  async deleteCard(lid: number, cid: number): Promise<void> {
    const list = await this.listRepository.findOne({ where: { lid } });
    const card = await this.cardRepository.findOne({ where: { cid } });
    if (!list || list == undefined) {
      throw new NotFoundException('해당 리스트가 존재하지 않습니다.');
    }
    if (!cid) {
      throw new BadRequestException('삭제할 카드 ID를 입력해주세요.');
    }
    const remove = await this.cardRepository.delete(cid);
    // if (remove.affected === 0) {
    //   throw new NotFoundException(`해당 카드가 조회되지 않습니다. cardId: ${cid}`);
    // }
  }

  // 5. 작업자 할당/변경
  async updateManager(cid: number, managerDto: ManagerDto) {
    const { manager, newManager } = managerDto;
    const managerCid = await this.cardRepository.findOne({ where: { cid } });
    if (!managerCid || managerCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    } else if (!manager || !newManager) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.');
    }
    managerCid.manager = newManager;
    const update = this.cardRepository.save(managerCid);
    return update;
  }

  // 6. 마감일 수정
  async updateDeadline(cid: number, deadlineDto: DeadlineDto) {
    const { deadline, NewDeadline } = deadlineDto;
    const deadlineCid = await this.cardRepository.findOne({ where: { cid } });
    if (!deadlineCid || deadlineCid == undefined) {
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    } else if (!deadline || !NewDeadline) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.');
    }

    deadlineCid.deadline = NewDeadline;
    const update = this.cardRepository.save(deadlineCid);
    return update;
  }

  // 7. 카드 순서변경
  async changeCards(lid: number, newlid: number, cid: number, newPosition: number): Promise<void> {
    const list = await this.listRepository.findOne({ where: { lid } });
    const cardq = await this.cardRepository.findOne({ where: { cid } });

    // 유효성 검사
    if (!list || list == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    } else if (!cardq || cardq == undefined) {
      throw new NotFoundException('Card ID가 존재하지 않습니다.');
    } else if (!cid || !newPosition) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.');
    }
    const cards = await this.cardRepository.find({ where: { lid } });
    const card = cards.find((c) => c.cid === cid);
    // card  :카드 레포cid worker    cards 카드 레포 , lid
    const min = Math.min(card.order, newPosition);
    const max = Math.max(card.order, newPosition);

    await this.dataSource.manager.transaction(async (transactionManager) => {
      if (lid == newlid) {
        // 같은 컬럼일경우
        if (card.order === min) {
          cards
            .filter((card) => {
              return card.order >= min && card.order <= max;
            })
            .forEach(async (card) => {
              card.order = card.order - 1;
              const a = await transactionManager.save(card);
              return a;
            });
          card.order = max;
          return await transactionManager.save(card);
        } else if (card.order === max) {
          cards
            .filter((card) => {
              return card.order <= max && card.order >= min;
            })
            .forEach(async (card) => {
              card.order = card.order + 1;
              await transactionManager.save(card);
            });
          card.order = min;
          return await transactionManager.save(card);
        }
      } else {
        // 다른 컬럼일경우
        cards
          .filter((card) => {
            return card.order >= newPosition;
          })
          .forEach(async (card) => {
            card.order = card.order + 1;
            await transactionManager.save(card);
          });
        cards
          .filter((val) => {
            return val.order > card.order;
          })
          .forEach(async (card) => {
            card.order = card.order - 1;
            await transactionManager.save(card);
          });
        card.order = newPosition;
        const updateCnt = await transactionManager.save(card);
        return updateCnt;
      }
    });
  }
}
