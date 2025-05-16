import { Module } from '@nestjs/common';
import { ProductStorageUnitService } from './product-storage-unit.service';
import { ProductStorageUnitController } from './product-storage-unit.controller';

@Module({
  controllers: [ProductStorageUnitController],
  providers: [ProductStorageUnitService],
})
export class ProductStorageUnitModule {}
