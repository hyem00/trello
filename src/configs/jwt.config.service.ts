import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import * as dotenv from 'dotenv';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.DATABASE_PASSWORD, //this.configService.get<string>("JWT_SECRET"),
      signOptions: { expiresIn: "3600s" },
    };
  }
}
