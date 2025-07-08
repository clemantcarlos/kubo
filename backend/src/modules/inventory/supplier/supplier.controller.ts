import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/supplier.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSupplier(@Body() dto: CreateSupplierDto) {
    return this.supplierService.createSupplier(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSuppliers() {
    return this.supplierService.getSuppliers();
  }
}
