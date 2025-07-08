import { Controller, Get, Query, Param, Post, Body, UseGuards } from '@nestjs/common';
import { MovementService } from './movement.service';
import { CreateMovementDto, GetMovementsQueryDto } from './dto/movement.dto';
import { AtGuard } from '@/modules/auth/common/guards/at.guard';

@Controller('inventory/movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}
  // TODO: ADD BETTER TYPES FOR THIS WHOLE MODULE
  @Get()
  async getMovements(@Query() query: GetMovementsQueryDto) {
    return this.movementService.getMovements(query);
  }

  @Get(':id')
  async getMovement(@Param('id') id: string) {
    return this.movementService.getMovement(Number(id));
  }

  @Post('adjust')
  @UseGuards(AtGuard)
  async createManualMovement(@Body() dto: CreateMovementDto) {
    return this.movementService.createManualMovement(dto);
  }
}
