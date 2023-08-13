import { IsNumber } from 'class-validator';

export class UpdateCardMDto {
  @IsNumber()
  readonly uid: number;

  @IsNumber()
  readonly newUid: number;

  @IsNumber()
  readonly cid: number;
}
