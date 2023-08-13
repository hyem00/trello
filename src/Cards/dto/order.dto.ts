import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDto {
  @IsNotEmpty({ message: '카드ID를 입력해주세요.' })
  @IsNumber()
  cid: number;

  @IsNotEmpty({ message: '카드 순서를 변경할 위치를 숫자로 입력해주세요' })
  @IsNumber()
  newPosition: number;

  @IsNotEmpty({ message: '리스트 변경할 위치를 숫자로 입력해주세요' })
  @IsNumber()
  lid: number;
}
