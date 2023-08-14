import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  color: string;

  @IsString()
  manager: string | null;

  @IsString()
  explanation: string;

  @IsString()
  deadline: string;
}
