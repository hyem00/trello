import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction } from 'typeorm';
import { Cards } from './cards.entity'

@Injectable()
export class CardsService{
    constructor(
    @InjectRepository(Cards)
    private readonly cardsRepository: Repository<Cards>,
    ) {}

// 1. 카드 순서변경
async changeCards(lid: number, data: {cid: number, position: number, newPosition: number}): Promise<void> {
    try{
        if(!lid || lid == undefined){
            throw new NotFoundException('List ID가 존재하지 않습니다.')
        } else if (!data || data == undefined){
            throw new NotFoundException('미기입된 항목을 입력해주세요.')
        }
    // 트랜잭션 사용
    await this.cardsRepository.manager.transaction(async (manager) => {
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
        throw new UnauthorizedException('카드 순서변경에 실패했습니다.')
    }
}







}