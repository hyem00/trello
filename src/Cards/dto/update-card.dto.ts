import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly color: string;

  @IsNumber()
  readonly explanation: string;

  @IsOptional() // null 허용
  @IsDate()
  readonly deadline: Date;
}
