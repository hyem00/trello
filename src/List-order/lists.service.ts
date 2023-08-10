// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Lists } from './lists.entity';
// import { Boards } from 'src/Boards/boards.entity';

// @Injectable()
// export class ListsService{
//     constructor(
//     @InjectRepository(Lists)
//     private commentsRepository: Repository<Lists>,
//     ) {}



// // 1. 리스트 순서변경
// async listOrder(bid: number, lid: number, targetlid: number): Promise<Lists>{
//     // params 체크
//     if (!bid || bid == undefined) {
//         throw new NotFoundException('board ID가 존재하지 않습니다.');
//       } else if (!lid || lid == undefined) {
//         throw new NotFoundException('card ID가 존재하지 않습니다.');
//       }



// }

// }