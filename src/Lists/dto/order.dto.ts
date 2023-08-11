import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class ListsDto {

    @IsNotEmpty({ message: '리스트ID를 입력해주세요.'})
    @IsNumber()
    lid: number;

    @IsNotEmpty({ message: '리스트의 현재 순서를 입력해주세요.'})
    @IsNumber()
    position: number;

    @IsNotEmpty({ message: '리스트 순서를 변경할 위치를 숫자로 입력해주세요.'})
    @IsNumber()
    newPosition: number;

}