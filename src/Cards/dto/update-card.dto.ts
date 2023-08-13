import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  title: string;

  @IsString()
  color: string;

  @IsNumber()
  explanation: string;

}
