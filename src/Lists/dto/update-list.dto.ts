import { IsString, IsNotEmpty } from "class-validator";

export class UpdateListsDto {

    @IsNotEmpty({ message: '제목을 입력해주세요.'})
    @IsString()
    title: string;
}