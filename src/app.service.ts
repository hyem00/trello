import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  home(): string {
    return '어서와요 동물의 숲';
  }
}
