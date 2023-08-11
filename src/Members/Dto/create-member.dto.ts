import { IsNumber } from 'class-validator';

export class createMemberDto {
  @IsNumber()
  readonly uid: number;

  @IsNumber()
  readonly bid: number;
}
