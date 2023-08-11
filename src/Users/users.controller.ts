import { Body, Controller, Delete, Get, Put, Param, ParseIntPipe, Patch, Post, ValidationPipe, Response } from '@nestjs/common';
import { Users } from './users.entity';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/signup.dto';
import { UserDto } from './dto/user.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. 회원가입 Post: localhost:3000/api/signup
  @Post('/signup')
  async signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return await this.usersService.signup(authCredentialsDto);
  }

  // 2. 로그인 Post : localhost:3000/api/login
  @Post('/login')
  async login(@Body() userDto: UserDto, @Response({ passthrough: true }) res) {
    const auth = await this.usersService.login(userDto);
    res.cookie('Authentication', 'Bearer ' + auth);
  }

  // 3. 회원정보 조회 Get : localhost:3000/api/user/:uid (userId)
  @Get('/user/:uid')
  async getUserInfo(@Param('uid') uid: number) {
    const user = await this.usersService.getUserById(uid);
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        nickname: user.nickname,
      };
    }
  }

  // 4. 회원정보 수정 Put : localhost:3000/api/user/:uid (userId)
  @Put('/user/:uid')
  async updateUser(@Param('uid') uid: number, @Body() updateDto: UpdateDto) {
    const update = await this.usersService.updateUser(uid, updateDto);
    if (update) {
      return {
        uid: update.uid,
        email: update.email,
        nickname: update.nickname,
      };
    }
  }
}
