import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/Users/users.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: any, res: any, next: Function) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('JWT not found');
    }

    let token: string;
    try {
      console.log('들어는 왔니');
      token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verify(token);
      res.user = payload;
      console.log('@@@@', res.user);
      next();
    } catch (err) {
      throw new UnauthorizedException(`Invalid JWT: ${token}`);
    }
  }
}
