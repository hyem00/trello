import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateCardDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly color: string;

  @IsString()
  readonly explanation: string;

  @IsString()
  readonly deadline: string;
}
