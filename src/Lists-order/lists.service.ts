import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction } from 'typeorm';
import { Lists } from './lists.entity';
import { Boards } from 'src/Boards/boards.entity';

@Injectable()
export class ListsService{
    constructor(
    @InjectRepository(Lists)
    private readonly  listsRepository: Repository<Lists>,
    ) {}

// 1. 리스트 순서변경
async changeLists(bid: number, data: {lid: number, position: number, newPosition: number}): Promise<void> {

try{
    // params 체크
    if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!data || data == undefined) {
        throw new NotFoundException('미기입된 항목을 입력해주세요.')
      }

      // 트랜잭션 사용
      await this.listsRepository.manager.transaction(async (manager) => {
        const { lid, position, newPosition } = data;
        const listToUpdate = await manager.findOne(Lists, {where: {lid}});

        if(!listToUpdate){
            throw new NotFoundException('리스트가 조회되지 않습니다.')
        }
        const listsToUpdate = await manager.find(Lists, {
            where: {bid},
            order: {position: 'ASC'},
        })

        const updateNewPosition = Math.max(0, Math.min(data.newPosition, listsToUpdate.length - 1))
       
        listsToUpdate.splice(position, 1);
        listsToUpdate.splice(updateNewPosition, 0, listToUpdate);

        listsToUpdate.forEach((list, index) => {
            list.position = index;
        })
    await manager.save(listsToUpdate);
})
}catch(error){
    console.log(error);
    throw new UnauthorizedException('리스트 순서변경에 실패했습니다.')
}};
}


 // newListOrder 배열을 순회하면서 각 리스트의 lid를 찾아 새로운 순서에 맞게 position값을 업데이트
    //     newListOrder.forEach((lid, position) => {
    //         const list = lists.find(list => list.lid === lid) as Lists;

    //         if(list){
    //             list.position = position
    //         }
    //     })

    //     // 기존 리스트들의 position을 새로운 순서에 맞게 업데이트
    //     lists.forEach((list) =>{
    //         const newPosition = newListOrder.findIndex(lid => lid === list.lid);
    //         if(newPosition !== -1){
    //             list.position = newPosition
    //         }
    //     })
    //     await manager.save(lists)
    
    //   })