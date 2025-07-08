import { Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { MovementController } from './movement.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MovementController],
  providers: [MovementService, PrismaService],
  exports: [MovementService],
})
export class MovementModule {}
