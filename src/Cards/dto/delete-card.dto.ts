import { IsNumber, IsString, IsOptional } from 'class-validator';

export class DeleteCardDto {
  @IsString()
  readonly lid: string;
}
