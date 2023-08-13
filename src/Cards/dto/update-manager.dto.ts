import { IsDate, IsNotEmpty } from 'class-validator';

export class ManagerDto {

@IsNotEmpty({ message: '기존 작업자를 입력해주세요.'})
@IsDate()
manager: string;

@IsNotEmpty({ message: '새로운 작업자를 입력해주세요.'})
@IsDate()
newManager: string;
}
