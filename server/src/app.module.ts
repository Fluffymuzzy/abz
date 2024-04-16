import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TokenModule } from "./token/token.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";
import { PhotoModule } from './photo/photo.module';
import { PositionsController } from './positions/positions.controller';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, TokenModule, PrismaModule, HttpModule, PhotoModule, PositionsModule],
  controllers: [UsersController, PositionsController],
  providers: [UsersService],
})
export class AppModule {}
