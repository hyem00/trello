import { IsDate, IsNotEmpty } from 'class-validator';

export class ManagerDto {

@IsNotEmpty({ message: '할당 작업자를 입력해주세요.'})
@IsDate()
manager: string;
}
