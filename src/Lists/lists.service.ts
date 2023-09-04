import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lists } from './lists.entity';
import { CreateListsDto } from './dto/create-list.dto';
import { UpdateListsDto } from './dto/update-list.dto';
import { ListsDto } from './dto/order.dto';
import { Boards } from 'src/Boards/boards.entity';
import { Cards } from 'src/Cards/cards.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Lists)
    private listsRepository: Repository<Lists>,
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    private readonly dataSource: DataSource,
  ) {}

  // 1. 리스트 전체 조회
  async getLists(bid: number): Promise<Lists[]> {
    const boards = await this.boardRepository.findOne({ where: { bid } });
    if (!boards || boards == undefined) {
      throw new NotFoundException('board ID가 존재하지 않습니다.');
    }

    const lists = await this.listsRepository.find({ where: { bid } });
    if (!lists || lists == undefined) {
      throw new NotFoundException('리스트 조회에 실패했습니다.');
    }
    return lists;
  }
  async findMaxOrder(bid: number): Promise<number> {
    const maxOrderRecord = await this.listsRepository.createQueryBuilder('list').select('MAX(list.order)', 'max_order').where('list.bid = :bid', { bid: bid }).getRawOne();

    return maxOrderRecord?.max_order || 0;
  }

  // 2. 리스트 생성
  async createList(bid: number, createListsDto: CreateListsDto) {
    const boards = await this.boardRepository.findOne({ where: { bid } });

    if (!boards || boards == undefined) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    } else if (!createListsDto) {
      throw new BadRequestException('제목을 입력해주세요.');
    }

    const maxOrder = await this.findMaxOrder(bid);

    if (maxOrder == 0) {
      const data = await this.listsRepository.save({
        bid: bid,
        title: createListsDto.title,
      });
      return data;
    } else {
      const data = await this.listsRepository.save({
        bid: bid,
        title: createListsDto.title,
        order: maxOrder + 1,
      });
      return data;
    }
  }

  // 3. 리스트 수정
  async updateList(bid: number, lid: number, updateListsDto: UpdateListsDto) {
    const board = await this.boardRepository.findOne({ where: { bid } });
    const list = await this.listsRepository.findOne({ where: { lid } });
    if (!board || board == undefined) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    } else if (!list || list == undefined) {
      throw new NotFoundException('해당 리스트가 존재하지 않습니다.');
    }
    if (!updateListsDto) {
      throw new BadRequestException('수정할 제목을 입력해주세요.');
    }
    try {
      const update = await this.listsRepository.update({ lid }, { title: updateListsDto.title });
      const result = await this.listsRepository.findOne({ where: { lid } });
      return result;
    } catch (error) {
      throw new Error('리스트 수정에 실패하였습니다.');
    }
  }

  // 4. 리스트 삭제
  async deleteList(bid: number, lid: number): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { bid } });
    const list = await this.listsRepository.findOne({ where: { lid } });
    if (!board || board == undefined) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    } else if (!list || list == undefined) {
      throw new NotFoundException('해당 리스트가 존재하지 않습니다.');
    }

    const remove = await this.listsRepository.delete(lid);
    if (remove.affected === 0) {
      throw new NotFoundException(`해당 리스트가 조회되지 않습니다. listId: ${lid}`);
    }
  }
  
  // 5. 리스트 순서변경
  async changeLists(bid: number, lid: number, newPosition: number): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { bid } });
    const list = await this.listsRepository.findOne({ where: { lid } });
    // 유효성
    if (!board || board == undefined) {
      throw new NotFoundException('Board ID가 존재하지 않습니다.');
    } else if (!list || list == undefined) {
      throw new NotFoundException('List ID가 존재하지 않습니다.');
    } else if (!lid || !newPosition) {
      throw new BadRequestException('미기입된 항목이 있습니다. 모두 입력해주세요.');
    }

    const lists = await this.listsRepository.find({ where: { bid } });
    const listorder = lists.find((c) => c.lid === lid);
    const entityToUpdate = await this.cardsRepository.findOne({ where: { lid: lid } });
    // card  :카드 레포cid worker    cards 카드 레포 , lid
    const min = Math.min(list.order, newPosition);
    const max = Math.max(list.order, newPosition);

    await this.dataSource.manager.transaction(async (transactionManager) => {
      if (listorder.order === min) {
        lists
          .filter((list) => {
            return list.order > min && list.order <= max;
          })
          .forEach(async (list) => {
            list.order = list.order - 1;
            return await transactionManager.save(list);
          });
        list.order = max;
        return await transactionManager.save(list);
      } else if (list.order === max) {
        lists
          .filter((list) => {
            return list.order <= max && list.order >= min;
          })
          .forEach(async (list) => {
            list.order = list.order + 1;
            await transactionManager.save(list);
          });
        list.order = min;
        return await transactionManager.save(list);
      }
    });
  }
}
