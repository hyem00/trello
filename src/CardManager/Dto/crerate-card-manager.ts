import { IsNumber } from 'class-validator';

export class CreateCardMDto {
  @IsNumber()
  readonly uid: number;

  @IsNumber()
  readonly cid: number;
}
