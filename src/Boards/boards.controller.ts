import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res, ValidationPipe, Response, Request } from '@nestjs/common';
import { Boards } from './boards.entity';
import { BoardsService } from './boards.service';

@Controller('api')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  @Get('/board/:bid')
  async getBoard(@Param('bid') bid: number) {
    const getBoard = await this.boardService.getBoard(bid);
    return getBoard;
  }

  @Post('/board')
  async createBoard(@Body() data: Boards, @Request() req) {
    const { name, color, explanation } = data;
    const uid = req.user.uid;
    console.log(uid);

    const createBoard = await this.boardService.createBoard(uid, name, color, explanation);
    console.log(createBoard);
    return createBoard;
  }

  @Patch('/board/:bid')
  updateBoard(@Param('bid') bid: number, @Body() data: Boards) {
    console.log(bid);
    return this.boardService.updateBoard(bid, data.name, data.explanation, data.color);
  }

  @Delete('board/:bid')
  async deleteBoard(@Param('bid') bid: number) {
    const remove = await this.boardService.deleteBoard(bid);
    return remove;
  }
}
