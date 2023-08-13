import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, Post, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './comments.entity';
import { Users } from 'src/Users/users.entity';

@Controller('api')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 1. 댓글목록 전체 조회 : GET localhost:3000/api/board/:bid/card/:cid/comment
  @Get('/board/:bid/card/:cid/comment')
  async getComments(
    @Param('bid') bid: number, 
    @Param('cid') cid: number) {
    const comments = await this.commentsService.getAllComments(bid, cid);
    return comments;
  }

  // 2. 댓글 1개 조회: GET localhost:3000/api/board/:bid/card/:cid/comment/:commentId
  @Get('/board/:bid/card/:cid/comment/:commentId')
  async GetCommentById(
    @Param('bid') bid: number, 
    @Param('cid') cid: number, 
    @Param('commentId') commentId: number) {
    const comment = await this.commentsService.GetCommentById(bid, cid, commentId);
    return comment;
  }

  // 3. 댓글 생성 POST : localhost:3000/api/board/:bid/card/:cid/comment
  @Post('/board/:bid/card/:cid/comment')
  async createComment(
    @Param('bid') bid: number, 
    @Param('cid') cid: number, 
    @Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.createComment(bid, cid, createCommentDto);
    if (comment) {
      return { message: '댓글이 성공적으로 생성되었습니다.', comment: {comment} };
    }
  }

  // 4. 댓글 수정 PUT : localhost:3000/api/board/:bid/card/:cid/comment/:commentId
  @Put('/board/:bid/card/:cid/comment/:commentId')
  async updateComment(
    @Param('bid') bid: number,
    @Param('cid') cid: number,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const update = await this.commentsService.updateComment(bid, cid, commentId, updateCommentDto);
    if (update) {
      return { message: '댓글이 성공적으로 수정되었습니다.', comment: {update}};
    }
  }

  // 5. 댓글 삭제 DELETE : localhost:3000/api/board/:bid/card/:cid/comment/:commentId
  @Delete('/board/:bid/card/:cid/comment/:commentId')
  async deleteComment(
    @Param('bid') bid: number, 
    @Param('cid') cid: number, 
    @Param('commentId') commentId: number) {
    await this.commentsService.deleteComment(bid, cid, commentId);
    return { message: '댓글이 정상적으로 삭제되었습니다.'};
  }
}
