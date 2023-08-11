import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lists } from './lists.entity';
import { CreateListsDto } from './dto/create-list.dto';
import { UpdateListsDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Lists)
    private listsRepository: Repository<Lists>,
  ) {}

  // 1. 리스트 전체 조회
  async getLists(bid: number): Promise<Lists[]> {
    if (!bid || bid == undefined) {
      throw new NotFoundException('board ID가 존재하지 않습니다.');
    }

    const lists = this.listsRepository.find({ where: { bid } });
    if (!lists || lists == undefined) {
      throw new NotFoundException('리스트 조회에 실패했습니다.');
    }
    return lists;
  }

  // 2. 리스트 생성
  async createList(bid: number, createListsDto: CreateListsDto): Promise<Lists> {
    const { title } = createListsDto;
    try {
      if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!title) {
        throw new NotFoundException('제목을 입력해주세요.');
      }
      const list = this.listsRepository.create({ title });
      return this.listsRepository.save(list);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('리스트 생성에 실패하였습니다.');
    }
  }

  // 3. 리스트 수정
  async updateList(bid: number, lid: number, updateListsDto: UpdateListsDto): Promise<Lists> {
    const { title } = updateListsDto;

    try {
      if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!lid || lid == undefined) {
        throw new NotFoundException('List ID가 존재하지 않습니다.');
      }
      if (!title) {
        throw new BadRequestException('수정할 제목을 입력해주세요.');
      }

      // 리스트 존재유무
      const list = this.listsRepository.findOne({ where: { lid } });
      if (!list || list == undefined) {
        throw new NotFoundException('해당 리스트가 조회되지 않습니다.');
      }
      (await list).title = title;
      const update = this.listsRepository.save(await list);
      return update;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('리스트 수정에 실패하였습니다.');
    }
  }

  // 4. 리스트 삭제
  async deleteList(bid: number, lid: number): Promise<void> {
    try {
      if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!lid || lid == undefined) {
        throw new NotFoundException('List ID가 존재하지 않습니다.');
      }

      // 리스트 존재유무
      const list = this.listsRepository.findOne({ where: { lid } });
      if (!list || list == undefined) {
        throw new NotFoundException('해당 리스트가 조회되지 않습니다.');
      }

      const remove = await this.listsRepository.delete(lid);
      if (remove.affected === 0) {
        throw new NotFoundException(`해당 리스트가 조회되지 않습니다. listId: ${lid}`);
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('리스트 삭제에 실패했습니다.');
    }
  }

  // 5. 리스트 순서변경
  async changeLists(bid: number, data: { lid: number; position: number; newPosition: number }): Promise<void> {
    try {
      // params 체크
      if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!data || data == undefined) {
        throw new NotFoundException('미기입된 항목을 입력해주세요.');
      }

      // 트랜잭션 사용
      await this.listsRepository.manager.transaction(async (manager) => {
        const { lid, position, newPosition } = data;
        const listToUpdate = await manager.findOne(Lists, { where: { lid } });

        if (!listToUpdate) {
          throw new NotFoundException('리스트가 조회되지 않습니다.');
        }
        const listsToUpdate = await manager.find(Lists, {
          where: { bid },
          order: { position: 'ASC' },
        });

        const updateNewPosition = Math.max(0, Math.min(data.newPosition, listsToUpdate.length - 1));

        listsToUpdate.splice(position, 1);
        listsToUpdate.splice(updateNewPosition, 0, listToUpdate);

        listsToUpdate.forEach((list, index) => {
          list.position = index;
        });
        await manager.save(listsToUpdate);
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('리스트 순서변경에 실패했습니다.');
    }
  }
}
