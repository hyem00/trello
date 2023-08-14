import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DeadlineDto {
  @IsNotEmpty({ message: '기존 카드마감일을 입력해주세요.' })
  @IsString()
  deadline: string;

  @IsNotEmpty({ message: '새로운 카드마감일을 입력해주세요.' })
  @IsString()
  NewDeadline: string;
}
