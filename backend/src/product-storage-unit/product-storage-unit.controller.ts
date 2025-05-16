import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductStorageUnitService } from './product-storage-unit.service';
import {
  GetProductStorageUnitDto,
  ProductStorageUnitDto,
} from './dto/product-storage-unit.dto';

import { Public } from '@/modules/auth/common/decorators/public.decorator';
import { ProductStorageUnit } from '@prisma/client';

@Controller('product-storage-unit')
export class ProductStorageUnitController {
  constructor(
    private readonly productStorageUnitService: ProductStorageUnitService,
  ) {}
  @Public()
  @Get()
  async getAllProductStorageUnit(): Promise<GetProductStorageUnitDto[]> {
    return this.productStorageUnitService.getAll();
  }

  @Public()
  @Post()
  async createProductStorageUnit(
    @Body() productStorageUnit: ProductStorageUnitDto,
  ): Promise<ProductStorageUnit> {
    return this.productStorageUnitService.create(productStorageUnit);
  }
}
