import { Controller, Get, Query, Param, Post, Body, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, GetSalesQueryDto } from './dto/sale.dto';
import { AtGuard } from '@/modules/auth/common/guards/at.guard';

@Controller('inventory/sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async getSales(@Query() query: GetSalesQueryDto) {
    return this.saleService.getSales(query);
  }

  @Get(':id')
  async getSale(@Param('id') id: string) {
    return this.saleService.getSale(Number(id));
  }

  @Post()
  @UseGuards(AtGuard)
  async createSale(@Body() dto: CreateSaleDto) {
    return this.saleService.createSale(dto);
  }
}
