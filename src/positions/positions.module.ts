import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PositionsController } from './positions.controller';

@Module({
  imports: [PrismaModule],
  providers: [PositionsService],
  controllers: [PositionsController],
  exports: [PositionsService]
})
export class PositionsModule {}
