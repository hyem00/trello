import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Members } from 'src/Members/members.entity';
import { Boards } from 'src/Boards/boards.entity'
import { Cards } from 'src/Cards/cards.entity';
import _ from 'lodash';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>
  ) {}

  // 1. < 댓글목록 전체 조회 >
  async getAllComments(bid: number, cid: number): Promise<Comments[]> {
    // params 체크
    if (!bid || bid == undefined) {
      throw new NotFoundException('board ID가 존재하지 않습니다.');
    } else if (!cid || cid == undefined) {
      throw new NotFoundException('card ID가 존재하지 않습니다.');
    }

    const comments = this.commentsRepository.find({ where: { cid } });
    if (!comments || comments == undefined) {
      throw new NotFoundException('댓글조회에 실패했습니다.');
    }
    return comments;
  }

  // 2. < 댓글 1개 조회 >
  async GetCommentById(bid: number, cid: number, commentId: number): Promise<Comments> {
    // params 체크
    if (!bid || bid == undefined) {
      throw new NotFoundException('board ID가 존재하지 않습니다.');
    } else if (!cid || cid == undefined) {
      throw new NotFoundException('card ID가 존재하지 않습니다.');
    } else if (!commentId || commentId == undefined) {
      throw new NotFoundException('comment ID가 존재하지 않습니다.');
    }
    const comment = this.commentsRepository.findOne({ where: { commentId } });
    if (!comment || comment == undefined) {
      throw new NotFoundException('댓글조회에 실패했습니다.');
    }
    return comment;
  }

  // 3. < 댓글 생성 >
  async createComment(bid: number, cid: number, createCommentDto: CreateCommentDto) {
   
      const { comment } = createCommentDto;
      const cards = await this.cardsRepository.findOne({where: {cid}})
      const boards = await this.boardRepository.findOne({where: {bid}})

      if (!boards.bid || boards.bid == undefined) {
       throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!cards.cid || cards.cid == undefined) {
        throw new NotFoundException('Card ID가 존재하지 않습니다.');
      } else if (!comment) {
        throw new BadRequestException('댓글을 작성해주세요.');
      }

      const content = await this.commentsRepository.create({ cid, comment: createCommentDto.comment });
      return await this.commentsRepository.save(content);
  
  }

  // 4. < 댓글 수정 >
  async updateComment(bid: number, cid: number, commentId: number, updateCommentDto: UpdateCommentDto) {
   
      const { comment } = updateCommentDto;
      const boards = await this.boardRepository.findOne({where: {bid}});
      const cards = await this.cardsRepository.findOne({where: {cid}});
      const content = await this.commentsRepository.findOne({where: {commentId}});

      if (!boards.bid || boards.bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
       } else if (!cards.cid || cards.cid == undefined) {
         throw new NotFoundException('Card ID가 존재하지 않습니다.');
       } else if (!content.commentId || content.commentId == undefined) {
        throw new NotFoundException('해당 댓글이 조회되지 않습니다.');
      } else if (!comment) {
        throw new BadRequestException('수정할 댓글을 작성해주세요.');
      }
      await this.commentsRepository.update(commentId, {comment});
      return await this.commentsRepository.findOne({where: {commentId}})
      
      // const newComment = updateCommentDto.comment;
      // (await content).comment = comment;
      // const update = this.commentsRepository.save(await content);
      // return update;
  }

  // 5. < 댓글 삭제 >
  async deleteComment(bid: number, cid: number, commentId: number): Promise<void> {

      if (!bid || bid == undefined) {
        throw new NotFoundException('board ID가 존재하지 않습니다.');
      } else if (!cid || cid == undefined) {
        throw new NotFoundException('card ID가 존재하지 않습니다.');
      } else if (!commentId || commentId == undefined) {
        throw new NotFoundException('comment ID가 존재하지 않습니다.');
      }
      // 댓글존재유무
      const content = this.commentsRepository.findOne({ where: { commentId } });
      if (!content || content == undefined) {
        throw new NotFoundException('해당 댓글이 조회되지 않습니다.');
      }

      const remove = await this.commentsRepository.delete(commentId);
      if (remove.affected === 0) {
        throw new NotFoundException(`해당 댓글이 조회되지 않습니다. commentId: ${commentId}`);
      }

  }
}
