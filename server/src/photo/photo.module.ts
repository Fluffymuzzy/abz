import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PhotoService } from './photo.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
