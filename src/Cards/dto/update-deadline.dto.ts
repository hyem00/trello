import { IsDate, IsNotEmpty } from 'class-validator';

export class DeadlineDto {

@IsNotEmpty({ message: '기존 카드마감일을 입력해주세요.'})
@IsDate()
deadline: Date;

@IsNotEmpty({ message: '새로운 카드마감일을 입력해주세요.'})
@IsDate()
NewDeadline: Date;
}
